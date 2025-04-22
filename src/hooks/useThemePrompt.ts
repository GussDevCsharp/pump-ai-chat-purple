
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThemePrompt {
  id: string;
  theme_id: string;
  title: string;
  prompt_furtive?: string | null;
  pattern_prompt?: string; // Make pattern_prompt optional since it's not in the database
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
    
    // Convert the Supabase promise chain to a standard Promise
    const fetchPrompt = async () => {
      try {
        const { data, error } = await supabase
          .from("theme_prompts")
          .select("*")
          .eq("theme_id", themeId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching theme prompt:", error);
          setPatternPrompt(null);
        } else if (data) {
          // Map the data to match our interface
          const themePromptData: ThemePrompt = {
            id: data.id,
            theme_id: data.theme_id,
            title: data.title,
            prompt_furtive: data.prompt_furtive,
            // For backwards compatibility - since pattern_prompt doesn't exist in database
            // we use prompt_furtive as a fallback
            pattern_prompt: data.prompt_furtive 
          };
          setPatternPrompt(themePromptData);
        }
      } catch (err) {
        console.error("Error fetching theme prompt:", err);
        setPatternPrompt(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrompt();
  }, [themeId]);

  return { patternPrompt, isLoading };
}
