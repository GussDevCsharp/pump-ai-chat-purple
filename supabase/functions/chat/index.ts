
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleGetApiKey, handleGetLogs, handleChatMessage } from "./handler-service.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    
    // Handle API key request
    if (url.pathname.endsWith('/getApiKey')) {
      return await handleGetApiKey(supabase)
    }

    // Handle logs request
    if (url.pathname.endsWith('/getLogs')) {
      const { email } = await req.json()
      return await handleGetLogs(supabase, email)
    }

    // Handle chat message
    const requestData = await req.json()
    return await handleChatMessage(supabase, requestData)
    
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
