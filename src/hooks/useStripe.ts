
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useStripe() {
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.functions.invoke('get-stripe-key', {
          body: { keyType: 'publishable' }
        });

        if (error) throw error;
        
        setStripePublishableKey(data.key);
      } catch (err) {
        console.error('Erro ao buscar chave do Stripe:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStripeKey();
  }, []);

  return { stripePublishableKey, isLoading, error };
}
