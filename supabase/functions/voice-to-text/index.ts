
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./utils/cors.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String, chunkSize = 32768) {
  const chunks = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
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

    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log("Received audio data, processing...")
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio)
    
    // Prepare form data
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')

    console.log("Sending to OpenAI Whisper API...")

    // Get OpenAI API key
    const { data: keyData, error: keyError } = await supabase
      .from('modelkeys')
      .select('apikey')
      .eq('model', 'OpenAI')
      .single()
    
    if (keyError || !keyData) {
      console.error("Could not fetch API key:", keyError?.message || "No key found");
      return new Response(
        JSON.stringify({ 
          error: "Chave da API OpenAI não encontrada. Verifique se a tabela 'modelkeys' contém uma entrada para o modelo 'OpenAI'." 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openai_key = keyData.apikey;
    if (!openai_key) {
      console.error("API key is empty");
      return new Response(
        JSON.stringify({ 
          error: "Chave da API OpenAI está vazia. Verifique a configuração da chave na tabela 'modelkeys'." 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openai_key}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Erro na API do OpenAI: ${response.status} - ${errorText}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await response.json()
    console.log("Transcrição bem-sucedida:", result.text)

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Erro na função voice-to-text:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
