
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChatAuth } from '@/hooks/useChatAuth';
import { useToast } from '@/hooks/use-toast';

export const useMotivationalQuote = () => {
  const [quote, setQuote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { authStatus } = useChatAuth();
  const { toast } = useToast();

  const fetchQuote = useCallback(async () => {
    try {
      console.log("Fetching new motivational quote...");
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-quote');
      
      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }
      
      console.log("Quote data received:", data);
      
      if (data.quote) {
        setQuote(data.quote);
      } else {
        throw new Error('No quote received from API');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote("Transforme desafios em oportunidades de crescimento.");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a frase motivacional"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Generate a new quote whenever the auth status changes to 'authenticated'
    if (authStatus === 'authenticated') {
      fetchQuote();
    }
  }, [authStatus, fetchQuote]);

  return { quote, isLoading, refreshQuote: fetchQuote };
};
