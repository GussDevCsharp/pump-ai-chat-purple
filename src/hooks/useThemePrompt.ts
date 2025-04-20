
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
    
    // Convert the Supabase promise chain to a standard Promise
    const fetchPrompt = async () => {
      try {
        const { data, error } = await supabase
          .from("theme_prompts")
          .select("*")
          .eq("theme_id", themeId)
          .maybeSingle();
          
        if (error) {
          setPatternPrompt(null);
        } else if (data) {
          setPatternPrompt(data);
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
