
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function handleGetApiKey(supabase: ReturnType<typeof createClient>) {
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
