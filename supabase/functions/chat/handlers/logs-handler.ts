
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function handleGetLogs(supabase: ReturnType<typeof createClient>, email: string) {
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
