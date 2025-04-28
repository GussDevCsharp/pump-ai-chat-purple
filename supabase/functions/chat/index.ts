
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSystemPrompts } from "./prompt-service.ts"
import { savePromptLog } from "./log-service.ts"
import { createChatPayload, callOpenAI } from "./api-service.ts"
import { getUserProfiles, createFurtivePromptFragments } from "./profile-service.ts"

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
    
    // Se for requisição para obter chave de API
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

    // Se for requisição para logs de prompts
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

    // Processamento normal de mensagem de chat
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

    // Obter todos os prompts do sistema
    const { systemPrompt, components } = await getSystemPrompts(supabase, themeId)
    
    // Obter perfis do usuário se houver email
    let userProfiles = null;
    let furtiveFragments = null;
    
    if (userEmail) {
      userProfiles = await getUserProfiles(supabase, userEmail);
      furtiveFragments = createFurtivePromptFragments(
        userProfiles.entrepreneur, 
        userProfiles.company
      );
    }
    
    // Log dos prompts para depuração
    console.log("System prompts in order:")
    console.log("1. Rules:", components.rules)
    console.log("2. Tags:", components.tags)
    console.log("3. Theme:", components.theme)
    console.log("4. User message:", message)
    console.log("5. Furtive prompt:", furtivePrompt?.text || 'None')
    
    if (furtiveFragments) {
      console.log("6. Furtive fragment 1:", furtiveFragments.fragment1)
      console.log("7. Furtive fragment 2:", furtiveFragments.fragment2)
    }
    
    // Construir o prompt final integrando os três fragmentos furtivos
    let finalSystemPrompt = systemPrompt;
    let finalUserMessage = message;
    
    // Se temos os fragmentos furtivos, adicionamos ao prompt final
    if (furtiveFragments) {
      finalSystemPrompt = `${furtiveFragments.fragment1}\n\n${furtiveFragments.fragment2}\n\n${systemPrompt}`;
    }
    
    // Se há um prompt furtivo específico do tema, ajustamos a mensagem do usuário
    if (furtivePrompt?.text) {
      finalUserMessage = `${furtivePrompt.text} ${message}`;
    }
    
    // Criar payload OpenAI
    const openAIPayload = createChatPayload(finalSystemPrompt, finalUserMessage);
    
    // Salvar log de prompt
    await savePromptLog(supabase, {
      userEmail,
      systemPrompt,
      message,
      openAIPayload,
      furtivePrompt,
      finalUserMessage,
      furtiveFragments
    });
    
    // Chamar API OpenAI
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
