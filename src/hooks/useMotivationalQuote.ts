
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('generate-quote');
      
      if (error) throw error;
      
      setQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote("Transforme desafios em oportunidades de crescimento.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return { quote, isLoading };
};
