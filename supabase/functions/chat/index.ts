
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // If it's a request for the API key
    const url = new URL(req.url)
    if (url.pathname.endsWith('/getApiKey')) {
      console.log('Getting API key')
      
      const { data, error } = await supabase
        .from('modelkeys')
        .select('apikey')
        .eq('model', 'OpenAI')
        .single()

      if (error) {
        throw new Error(`Could not fetch API key: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ apiKey: data.apikey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Normal chat message processing
    const { data: keyData, error: keyError } = await supabase
      .from('modelkeys')
      .select('apikey')
      .eq('model', 'OpenAI')
      .single()

    if (keyError || !keyData) {
      console.error("API key error:", keyError)
      throw new Error('Could not fetch API key')
    }

    const apikey = keyData.apikey
    const { message, themeId } = await req.json()

    // 1. First, get rules prompt
    const { data: rulesPrompt, error: rulesError } = await supabase
      .from('furtive_prompts')
      .select('content')
      .eq('category', 'regras')
      .maybeSingle()

    if (rulesError) {
      console.error("Error fetching rules prompt:", rulesError)
    }

    // 2. Second, get tags prompt
    const { data: tagsPrompt, error: tagsError } = await supabase
      .from('furtive_prompts')
      .select('content')
      .eq('category', 'tags')
      .maybeSingle()

    if (tagsError) {
      console.error("Error fetching tags prompt:", tagsError)
    }

    // 3. Third, get theme prompt if themeId exists
    let themePromptContent = null
    if (themeId) {
      const { data: themePrompt, error: themeError } = await supabase
        .from('theme_prompts')
        .select('prompt_furtive')
        .eq('theme_id', themeId)
        .maybeSingle()

      if (themeError) {
        console.error("Error fetching theme prompt:", themeError)
      } else if (themePrompt) {
        themePromptContent = themePrompt.prompt_furtive
      }
    }

    // Build the system prompt in the correct order
    const systemPrompts = [
      rulesPrompt?.content,
      tagsPrompt?.content,
      themePromptContent
    ].filter(Boolean)

    const systemPrompt = systemPrompts.join('\n\n')

    console.log("System prompts in order:")
    console.log("1. Rules:", rulesPrompt?.content || 'None')
    console.log("2. Tags:", tagsPrompt?.content || 'None')
    console.log("3. Theme:", themePromptContent || 'None')
    console.log("4. User message:", message)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data_response = await response.json()
    console.log("Response received from OpenAI")
    
    return new Response(
      JSON.stringify(data_response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error("Error in edge function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
