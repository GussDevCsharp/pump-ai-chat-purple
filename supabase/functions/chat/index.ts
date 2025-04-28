
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSystemPrompts } from "./prompt-service.ts"
import { savePromptLog } from "./log-service.ts"
import { createChatPayload, callOpenAI } from "./api-service.ts"
import { getUserProfiles, createFurtiveFragments } from "./profile-service.ts"

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

    const { message, themeId, userEmail, furtivePrompt, isFirstMessage } = await req.json()

    // Only get system prompts on first message
    const { systemPrompt, components } = await getSystemPrompts(supabase, themeId)
    
    let userProfiles = null;
    let furtiveFragments = null;
    let finalSystemPrompt = "";
    
    // Only get and include user profiles and furtive fragments on first message
    if (isFirstMessage && userEmail) {
      userProfiles = await getUserProfiles(supabase, userEmail);
      furtiveFragments = createFurtiveFragments(
        userProfiles.entrepreneur, 
        userProfiles.company
      );
      
      // Construct complete system prompt with fragments
      if (furtiveFragments) {
        finalSystemPrompt = `${furtiveFragments.fragment1}\n\n${furtiveFragments.fragment2}\n\n${systemPrompt}`;
      } else {
        finalSystemPrompt = systemPrompt;
      }
    } else {
      // For subsequent messages, use only the theme system prompt
      finalSystemPrompt = systemPrompt;
    }
    
    let finalUserMessage = message;
    if (furtivePrompt?.text) {
      finalUserMessage = `${furtivePrompt.text} ${message}`;
    }
    
    // Create OpenAI payload
    const openAIPayload = createChatPayload(finalSystemPrompt, finalUserMessage);
    
    // Get OpenAI API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('apikey')
      .eq('provider', 'openai')
      .maybeSingle();
      
    if (keyError || !keyData?.apikey) {
      console.error("Error fetching OpenAI API key:", keyError);
      throw new Error("Could not find OpenAI API key");
    }
    
    // Save prompt log
    await savePromptLog(supabase, {
      userEmail,
      systemPrompt: finalSystemPrompt,
      message,
      openAIPayload,
      furtivePrompt,
      finalUserMessage,
      furtiveFragments
    });
    
    // Call OpenAI API
    const data_response = await callOpenAI(keyData.apikey, openAIPayload);
    console.log("Response received from OpenAI");
    
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
