
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ThemeTopic {
  id: string;
  title: string;
  theme_id: string;
  usage_count?: number;
  created_at?: string;
}

export function useThemeTopics() {
  const [latestTopics, setLatestTopics] = useState<ThemeTopic[]>([]);
  const [popularTopics, setPopularTopics] = useState<ThemeTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        // Fetch latest topics
        const { data: latestData, error: latestError } = await supabase
          .from("theme_prompts")
          .select("*")
          .order('created_at', { ascending: false })
          .limit(3);

        // Fetch most used topics
        const { data: popularData, error: popularError } = await supabase
          .from("theme_prompts")
          .select("*")
          .order('usage_count', { ascending: false })
          .limit(3);

        if (latestError || popularError) {
          console.error("Error fetching topics:", latestError || popularError);
        } else {
          setLatestTopics(latestData || []);
          setPopularTopics(popularData || []);
        }
      } catch (err) {
        console.error("Error fetching theme topics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTopics();
  }, []);

  return { latestTopics, popularTopics, isLoading };
}

