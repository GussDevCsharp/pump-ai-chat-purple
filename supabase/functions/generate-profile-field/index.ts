
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openAIApiKey) {
  console.error("OPENAI_API_KEY is not defined in environment variables");
}

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
