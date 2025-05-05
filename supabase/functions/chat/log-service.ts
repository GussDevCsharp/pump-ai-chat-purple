
export async function savePromptLog(supabase: any, {
  userEmail,
  systemPrompt,
  message,
  openAIPayload,
  furtivePrompt,
  finalUserMessage,
  furtiveFragments,
  themePrompt
}: {
  userEmail: string,
  systemPrompt: string,
  message: string,
  openAIPayload: any,
  furtivePrompt?: { text: string } | null,
  finalUserMessage: string,
  furtiveFragments?: { fragment1?: string, fragment2?: string } | null,
  themePrompt?: string | null
}) {
  if (!userEmail) return;
  
  try {
    console.log("Saving prompt log with system prompt length:", systemPrompt.length);
    
    const fullLog = {
      user_email: userEmail,
      system_prompt: systemPrompt, // Já contém o prompt completo com todos os componentes
      user_message: message,
      full_payload: {
        ...openAIPayload,
        furtive_prompt: furtivePrompt?.text || null,
        furtive_fragments: furtiveFragments || null,
        theme_prompt: themePrompt || null,
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
