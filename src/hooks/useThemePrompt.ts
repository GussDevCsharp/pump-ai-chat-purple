
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThemePrompt {
  id: string;
  theme_id: string;
  title: string;
  pattern_prompt: string;
}

export function useThemePrompt(themeId?: string) {
  const [patternPrompt, setPatternPrompt] = useState<ThemePrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!themeId) {
      setPatternPrompt(null);
      return;
    }
    setIsLoading(true);
    supabase
      .from("theme_prompts")
      .select("*")
      .eq("theme_id", themeId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setPatternPrompt(null);
        } else if (data) {
          setPatternPrompt(data);
        }
      })
      .finally(() => setIsLoading(false));
  }, [themeId]);

  return { patternPrompt, isLoading };
}
