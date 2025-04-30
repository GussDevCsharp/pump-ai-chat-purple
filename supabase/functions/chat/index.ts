
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

    const { message, themeId, userEmail, furtivePrompt, sessionId } = await req.json()
    
    // Buscar o histórico da conversa, se houver um ID de sessão
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
        // Se já existem mensagens, não é a primeira interação
        isFirstInteraction = false;
        
        // Converter as mensagens do histórico para o formato esperado pela OpenAI
        // Limitando apenas às 6 últimas mensagens (3 pares de perguntas e respostas)
        const limitedHistory = historyData.slice(Math.max(0, historyData.length - 6));
        messageHistory = limitedHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        console.log(`Using ${messageHistory.length} most recent messages for context (from total of ${historyData.length})`);
      }
    }

    // Obter todos os prompts do sistema (agora incluindo layout)
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
    console.log("1. Layout:", components.layout)
    console.log("2. Rules:", components.rules)
    console.log("3. Tags:", components.tags)
    console.log("4. Theme:", components.theme)
    console.log("5. User message:", message)
    console.log("6. Furtive prompt:", furtivePrompt?.text || 'None')
    
    if (furtiveFragments) {
      console.log("7. Furtive fragment 1:", furtiveFragments.fragment1)
      console.log("8. Furtive fragment 2:", furtiveFragments.fragment2)
    }
    
    // Construir o prompt final integrando os três fragmentos furtivos
    // apenas na primeira interação ou se um tema for explicitamente selecionado
    let finalSystemPrompt = systemPrompt;
    let finalUserMessage = message;
    
    // Flag para determinar se deve usar prompts furtivos
    const shouldUseFurtivePrompts = isFirstInteraction || furtivePrompt?.text;
    
    // Se temos os fragmentos furtivos e é a primeira interação, adicionamos ao prompt final
    if (furtiveFragments && shouldUseFurtivePrompts) {
      console.log("Including furtive fragments in system prompt (first interaction or theme selected)");
      finalSystemPrompt = `${furtiveFragments.fragment1}\n\n${furtiveFragments.fragment2}\n\n${systemPrompt}`;
    }
    
    // Se há um prompt furtivo específico do tema, ajustamos a mensagem do usuário
    if (furtivePrompt?.text) {
      console.log("Including furtive prompt in user message (theme selected)");
      finalUserMessage = `${furtivePrompt.text} ${message}`;
    }
    
    // Criar payload OpenAI (agora com histórico limitado)
    const openAIPayload = createChatPayload(finalSystemPrompt, finalUserMessage, messageHistory);
    
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
