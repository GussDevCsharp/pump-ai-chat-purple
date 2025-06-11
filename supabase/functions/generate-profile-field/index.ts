
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, field } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Faltando parâmetros necessários" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client to fetch API key from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch OpenAI API key from database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('modelkeys')
      .select('apikey')
      .eq('model', 'OpenAI')
      .single();

    if (apiKeyError || !apiKeyData?.apikey) {
      console.error('Could not fetch API key:', apiKeyError);
      return new Response(
        JSON.stringify({ error: "Chave da API OpenAI não encontrada" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = apiKeyData.apikey;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um assistente especialista em negócios que gera sugestões concisas para perfis empresariais. SEMPRE responda com no máximo 140 caracteres. Seja direto, objetivo e útil. Não use introduções ou explicações adicionais. Gere apenas o conteúdo solicitado de forma natural e prática.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 50
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Erro na API OpenAI');
    }

    let generatedText = data.choices[0].message.content.trim();
    
    // Ensure the text doesn't exceed 140 characters
    if (generatedText.length > 140) {
      generatedText = generatedText.substring(0, 137) + '...';
    }

    return new Response(
      JSON.stringify({ text: generatedText, field }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-profile-field function:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
