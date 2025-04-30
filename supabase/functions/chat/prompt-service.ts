
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ThemePromptResponse {
  prompt_furtive: string | null;
}

export async function getSystemPrompts(supabase: any, themeId: string | null) {
  // 1. Get layout/formatting prompt
  const { data: layoutPrompt, error: layoutError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'LAYOUT')
    .maybeSingle();

  if (layoutError) {
    console.error("Error fetching layout prompt:", layoutError);
  }

  // 2. Get rules prompt
  const { data: rulesPrompt, error: rulesError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'regras')
    .maybeSingle();

  if (rulesError) {
    console.error("Error fetching rules prompt:", rulesError);
  }

  // 3. Get tags prompt
  const { data: tagsPrompt, error: tagsError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'tags')
    .maybeSingle();

  if (tagsError) {
    console.error("Error fetching tags prompt:", tagsError);
  }

  // 4. Get theme prompt if themeId exists
  let themePromptContent = null;
  if (themeId) {
    const { data: themePrompt, error: themeError } = await supabase
      .from('theme_prompts')
      .select('prompt_furtive')
      .eq('theme_id', themeId)
      .maybeSingle();

    if (themeError) {
      console.error("Error fetching theme prompt:", themeError);
    } else if (themePrompt) {
      themePromptContent = themePrompt.prompt_furtive;
    }
  }

  const systemPrompts = [
    layoutPrompt?.content,
    rulesPrompt?.content,
    tagsPrompt?.content,
    themePromptContent
  ].filter(Boolean);

  return {
    systemPrompt: systemPrompts.join('\n\n'),
    components: {
      layout: layoutPrompt?.content || null,
      rules: rulesPrompt?.content || null,
      tags: tagsPrompt?.content || null,
      theme: themePromptContent || null
    }
  };
}
