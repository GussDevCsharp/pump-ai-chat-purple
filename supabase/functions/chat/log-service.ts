
export async function savePromptLog(supabase: any, {
  userEmail,
  systemPrompt,
  message,
  openAIPayload,
  furtivePrompt,
  finalUserMessage,
  furtiveFragments
}: {
  userEmail: string,
  systemPrompt: string,
  message: string,
  openAIPayload: any,
  furtivePrompt?: { text: string } | null,
  finalUserMessage: string,
  furtiveFragments?: { fragment1?: string, fragment2?: string } | null
}) {
  if (!userEmail) return;
  
  try {
    // Construa o system prompt completo para o log
    let fullSystemPrompt = "";
    
    // Adicione os fragmentos furtivos se disponíveis
    if (furtiveFragments) {
      if (furtiveFragments.fragment1) {
        fullSystemPrompt += furtiveFragments.fragment1 + "\n\n";
      }
      
      if (furtiveFragments.fragment2) {
        fullSystemPrompt += furtiveFragments.fragment2 + "\n\n";
      }
    }
    
    // Adicione o prompt furtivo específico do tema ou o system prompt padrão
    fullSystemPrompt += furtivePrompt?.text || systemPrompt;
    
    const fullLog = {
      user_email: userEmail,
      system_prompt: fullSystemPrompt, // Guarda o prompt completo com todos os fragmentos
      user_message: message,
      full_payload: {
        ...openAIPayload,
        furtive_prompt: furtivePrompt?.text || null,
        furtive_fragments: furtiveFragments || null,
        original_message: message,
        final_message: finalUserMessage
      }
    };
    
    await supabase
      .from('prompt_logs')
      .insert([fullLog]);
    
    console.log("Prompt log saved for user:", userEmail);
  } catch (logError) {
    console.error("Error saving prompt log:", logError);
  }
}
