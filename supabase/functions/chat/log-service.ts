
export async function savePromptLog(supabase: any, {
  userEmail,
  systemPrompt,
  message,
  openAIPayload,
  furtivePrompt,
  finalUserMessage
}: {
  userEmail: string,
  systemPrompt: string,
  message: string,
  openAIPayload: any,
  furtivePrompt?: { text: string } | null,
  finalUserMessage: string
}) {
  if (!userEmail) return;
  
  try {
    const fullLog = {
      user_email: userEmail,
      system_prompt: furtivePrompt?.text || systemPrompt,
      user_message: message,
      full_payload: {
        ...openAIPayload,
        furtive_prompt: furtivePrompt?.text || null,
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
