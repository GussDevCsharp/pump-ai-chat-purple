
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSystemPrompts } from "./prompt-service.ts"
import { savePromptLog } from "./log-service.ts"
import { createChatPayload, callOpenAI } from "./api-service.ts"

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

    const url = new URL(req.url)
    
    // If it's a request for the API key
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

    // If it's a request for prompt logs
    if (url.pathname.endsWith('/getLogs')) {
      const { email } = await req.json()
      
      if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
      }
      
      const { data, error } = await supabase
        .from('prompt_logs')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) {
        console.error("Error fetching logs:", error)
        throw new Error(`Could not fetch logs: ${error.message}`)
      }
      
      return new Response(
        JSON.stringify({ logs: data }),
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

    const { message, themeId, userEmail, furtivePrompt } = await req.json()

    // Get all system prompts
    const { systemPrompt, components } = await getSystemPrompts(supabase, themeId)

    // Log the prompts for debugging
    console.log("System prompts in order:")
    console.log("1. Rules:", components.rules)
    console.log("2. Tags:", components.tags)
    console.log("3. Theme:", components.theme)
    console.log("4. User message:", message)
    console.log("5. Furtive prompt:", furtivePrompt?.text || 'None')
    
    // Prepare final message
    const finalUserMessage = furtivePrompt?.text ? `${furtivePrompt.text} ${message}` : message
    
    // Create OpenAI payload
    const openAIPayload = createChatPayload(systemPrompt, finalUserMessage)
    
    // Save prompt log
    await savePromptLog(supabase, {
      userEmail,
      systemPrompt,
      message,
      openAIPayload,
      furtivePrompt,
      finalUserMessage
    })
    
    // Call OpenAI API
    const data_response = await callOpenAI(keyData.apikey, openAIPayload)
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
