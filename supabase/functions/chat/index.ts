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

    console.log("Fetching OpenAI API key...")
    
    const { data: allData, error: allError } = await supabase
      .from('modelkeys')
      .select('*');
    
    console.log("All modelkeys records:", JSON.stringify(allData, null, 2));
    
    const { data, error } = await supabase
      .from('modelkeys')
      .select('apikey')
      .eq('id', 1)
      .single()
    
    console.log("Database query result:", { data, error })
    
    if (error) {
      console.error("Database error:", error)
      throw new Error('Could not fetch API key from database')
    }
    
    if (!data || !data.apikey) {
      console.error("No API key found or key is null")
      throw new Error('No OpenAI API key found in database')
    }

    const apikey = data.apikey
    
    console.log("API key retrieved successfully")

    const { message } = await req.json()

    console.log("Sending request to OpenAI with message:", message)

    const requestBody = {
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
    }

    console.log("Request body prepared:", JSON.stringify(requestBody))

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data_response = await response.json()
    console.log("Received response from OpenAI:", data_response)

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
