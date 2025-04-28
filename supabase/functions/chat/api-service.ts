export function createChatPayload(systemPrompt: string, userMessage: string) {
  return {
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      { 
        role: 'user', 
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };
}

export async function callOpenAI(apiKey: string, payload: any) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenAI API error:", response.status, errorData);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  return response.json();
}
