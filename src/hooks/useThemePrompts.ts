
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThemePrompt {
  id: string;
  theme_id: string;
  title: string;
  prompt_furtive?: string | null;
}

export function useThemePrompts(themeId?: string) {
  const [prompts, setPrompts] = useState<ThemePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!themeId) {
      setPrompts([]);
      return;
    }
    
    const fetchPrompts = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching theme prompts for theme ID:", themeId);
        
        // Removida a limitação de 6 prompts para buscar todos
        const { data, error } = await supabase
          .from("theme_prompts")
          .select("*")
          .eq("theme_id", themeId);
          
        if (error) {
          console.error("Error fetching theme prompts:", error);
          setPrompts([]);
        } else {
          console.log("Fetched theme prompts:", data);
          setPrompts(data || []);
        }
      } catch (err) {
        console.error("Error fetching theme prompts:", err);
        setPrompts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrompts();
  }, [themeId]);

  return { prompts, isLoading };
}
