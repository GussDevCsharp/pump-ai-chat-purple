
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

    // Se for uma requisição para obter a chave API
    const url = new URL(req.url)
    if (url.pathname.endsWith('/getApiKey')) {
      const { data, error } = await supabase
        .from('modelkeys')
        .select('apikey')
        .eq('id', 1)
        .single()

      if (error) {
        throw new Error('Could not fetch API key')
      }

      const maskedKey = data.apikey ? `${data.apikey.substring(0, 3)}...${data.apikey.substring(data.apikey.length - 4)}` : null
      return new Response(
        JSON.stringify({ maskedKey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Processamento normal da mensagem do chat
    const { data: keyData, error: keyError } = await supabase
      .from('modelkeys')
      .select('apikey')
      .eq('id', 1)
      .single()

    if (keyError || !keyData) {
      console.error("API key error:", keyError)
      throw new Error('Could not fetch API key')
    }

    const apikey = keyData.apikey
    const { message } = await req.json()

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
            content: 'You are a helpful AI assistant focused on providing guidance and expertise.'
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
