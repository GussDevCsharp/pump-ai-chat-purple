
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ThemePromptResponse {
  prompt_furtive: string | null;
}

export async function getSystemPrompts(supabase: any, themeId: string | null) {
  // 1. Get layout/formatting prompt with correct case sensitivity (LAYOUT)
  console.log("Fetching formatting prompt with category='LAYOUT'");
  const { data: layoutPrompt, error: layoutError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'LAYOUT')
    .maybeSingle();

  if (layoutError) {
    console.error("Error fetching layout prompt:", layoutError);
  } else {
    console.log("Layout prompt fetched successfully:", layoutPrompt?.content ? "Found" : "Not found");
    if (layoutPrompt?.content) {
      console.log("Layout prompt content (first 50 chars):", layoutPrompt.content.substring(0, 50) + "...");
    }
  }

  // 2. Get rules prompt
  console.log("Fetching rules prompt with category='regras'");
  const { data: rulesPrompt, error: rulesError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'regras')
    .maybeSingle();

  if (rulesError) {
    console.error("Error fetching rules prompt:", rulesError);
  } else {
    console.log("Rules prompt fetched successfully:", rulesPrompt?.content ? "Found" : "Not found");
  }

  // 3. Get tags prompt
  console.log("Fetching tags prompt with category='tags'");
  const { data: tagsPrompt, error: tagsError } = await supabase
    .from('furtive_prompts')
    .select('content')
    .eq('category', 'tags')
    .maybeSingle();

  if (tagsError) {
    console.error("Error fetching tags prompt:", tagsError);
  } else {
    console.log("Tags prompt fetched successfully:", tagsPrompt?.content ? "Found" : "Not found");
  }

  // 4. Get theme prompt if themeId exists
  let themePromptContent = null;
  if (themeId) {
    console.log(`Fetching theme prompt for theme ID: ${themeId}`);
    const { data: themePrompt, error: themeError } = await supabase
      .from('theme_prompts')
      .select('prompt_furtive')
      .eq('theme_id', themeId)
      .maybeSingle();

    if (themeError) {
      console.error("Error fetching theme prompt:", themeError);
    } else if (themePrompt) {
      themePromptContent = themePrompt.prompt_furtive;
      console.log("Theme prompt fetched successfully:", themePromptContent ? "Found" : "Not found");
    }
  }

  // Create array of valid prompts and filter out null/undefined values
  const systemPrompts = [
    layoutPrompt?.content,
    rulesPrompt?.content,
    tagsPrompt?.content,
    themePromptContent
  ].filter(Boolean);

  // Log the final system prompts for debugging
  console.log(`Final system prompt components: ${systemPrompts.length} found`);
  
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
