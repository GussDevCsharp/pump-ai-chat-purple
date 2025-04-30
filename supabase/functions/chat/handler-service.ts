
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSystemPrompts } from "./prompt-service.ts"
import { savePromptLog } from "./log-service.ts"
import { createChatPayload, callOpenAI } from "./api-service.ts"
import { getUserProfiles, createFurtivePromptFragments } from "./profile-service.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handler for API key retrieval
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

// Handler for prompt logs
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

// Main handler for chat messages
export async function handleChatMessage(supabase: ReturnType<typeof createClient>, requestData: {
  message: string;
  themeId?: string | null;
  userEmail?: string;
  furtivePrompt?: { text: string } | null;
  sessionId?: string;
}) {
  const { message, themeId, userEmail, furtivePrompt, sessionId } = requestData;
  
  // Get API key for OpenAI
  const { data: keyData, error: keyError } = await supabase
    .from('modelkeys')
    .select('apikey')
    .eq('model', 'OpenAI')
    .single()

  if (keyError || !keyData) {
    console.error("API key error:", keyError)
    throw new Error('Could not fetch API key')
  }
  
  // Process chat message and get response
  const data_response = await processChatMessage(
    supabase,
    keyData.apikey,
    message,
    themeId,
    userEmail,
    furtivePrompt,
    sessionId
  );
  
  return new Response(
    JSON.stringify(data_response),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

// Process chat message and generate response
async function processChatMessage(
  supabase: ReturnType<typeof createClient>,
  apiKey: string, 
  message: string,
  themeId: string | null | undefined,
  userEmail: string | undefined,
  furtivePrompt: { text: string } | null | undefined,
  sessionId: string | undefined
) {
  // Fetch message history if sessionId is provided
  let messageHistory: Array<{role: string, content: string}> = [];
  let isFirstInteraction = true;
  
  if (sessionId) {
    console.log("Fetching message history for session:", sessionId);
    const { data: historyData, error: historyError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (historyError) {
      console.error("Error fetching message history:", historyError);
    } else if (historyData && historyData.length > 0) {
      // If there are existing messages, it's not the first interaction
      isFirstInteraction = false;
      
      // Convert history messages to OpenAI format, limited to last 6 messages
      const limitedHistory = historyData.slice(Math.max(0, historyData.length - 6));
      messageHistory = limitedHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      console.log(`Using ${messageHistory.length} most recent messages for context (from total of ${historyData.length})`);
    }
  }

  // Get all system prompts
  const { systemPrompt, components } = await getSystemPrompts(supabase, themeId)
  
  // Get user profiles if email is provided
  let userProfiles = null;
  let furtiveFragments = null;
  
  if (userEmail) {
    userProfiles = await getUserProfiles(supabase, userEmail);
    furtiveFragments = createFurtivePromptFragments(
      userProfiles.entrepreneur, 
      userProfiles.company
    );
  }
  
  // Log prompt components for debugging
  console.log("System prompts in order:")
  console.log("1. Layout:", components.layout ? "Present" : "Missing");
  console.log("2. Rules:", components.rules ? "Present" : "Missing");
  console.log("3. Tags:", components.tags ? "Present" : "Missing");
  console.log("4. Theme:", components.theme ? "Present" : "Missing");
  console.log("5. User message:", message);
  console.log("6. Furtive prompt:", furtivePrompt?.text || 'None');
  
  if (furtiveFragments) {
    console.log("7. Furtive fragment 1:", furtiveFragments.fragment1 ? "Present" : "Missing");
    console.log("8. Furtive fragment 2:", furtiveFragments.fragment2 ? "Present" : "Missing");
  }
  
  // Build final prompt integrating furtive fragments
  let finalSystemPrompt = systemPrompt;
  let finalUserMessage = message;
  
  // Determine if we should use furtive prompts
  const shouldUseFurtivePrompts = isFirstInteraction || furtivePrompt?.text;
  
  // Add furtive fragments if available and should be used
  if (furtiveFragments && shouldUseFurtivePrompts) {
    console.log("Including furtive fragments in system prompt (first interaction or theme selected)");
    finalSystemPrompt = `${furtiveFragments.fragment1}\n\n${furtiveFragments.fragment2}\n\n${systemPrompt}`;
  }
  
  // Adjust user message if theme-specific furtive prompt exists
  if (furtivePrompt?.text) {
    console.log("Including furtive prompt in user message (theme selected)");
    finalUserMessage = `${furtivePrompt.text} ${message}`;
  }
  
  // Log final prompt length for debugging
  console.log(`Final system prompt length: ${finalSystemPrompt.length} characters`);
  
  // Create OpenAI payload and save prompt log
  const openAIPayload = createChatPayload(finalSystemPrompt, finalUserMessage, messageHistory);
  
  await savePromptLog(supabase, {
    userEmail,
    systemPrompt,
    message,
    openAIPayload,
    furtivePrompt,
    finalUserMessage,
    furtiveFragments
  });
  
  // Call OpenAI API and return response
  const data_response = await callOpenAI(apiKey, openAIPayload);
  console.log("Response received from OpenAI");
  
  return data_response;
}
