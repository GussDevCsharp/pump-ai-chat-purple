
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TrialStatus {
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  daysRemaining: number;
  isTrialExpired: boolean;
}

export const useTrialManagement = () => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialActive: false,
    trialEndsAt: null,
    daysRemaining: 0,
    isTrialExpired: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateDaysRemaining = (endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const checkTrialStatus = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setTrialStatus({
          isTrialActive: false,
          trialEndsAt: null,
          daysRemaining: 0,
          isTrialExpired: false
        });
        return;
      }

      // Verificar se existe registro na tabela subscribers
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!subscriber) {
        // Se não existe subscriber, criar um com trial de 14 dias
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);

        const { error } = await supabase
          .from('subscribers')
          .insert({
            user_id: session.user.id,
            email: session.user.email || '',
            subscribed: false,
            subscription_tier: 'trial',
            subscription_end: trialEndDate.toISOString()
          });

        if (error) {
          console.error('Erro ao criar trial:', error);
          toast.error('Erro ao ativar trial');
          return;
        }

        setTrialStatus({
          isTrialActive: true,
          trialEndsAt: trialEndDate,
          daysRemaining: 14,
          isTrialExpired: false
        });

        toast.success('Trial de 14 dias ativado com sucesso!');
        return;
      }

      // Se existe subscriber, verificar status
      if (subscriber.subscription_end) {
        const endDate = new Date(subscriber.subscription_end);
        const daysRemaining = calculateDaysRemaining(endDate);
        const isExpired = daysRemaining <= 0;

        setTrialStatus({
          isTrialActive: subscriber.subscription_tier === 'trial' && !isExpired,
          trialEndsAt: endDate,
          daysRemaining,
          isTrialExpired: isExpired && subscriber.subscription_tier === 'trial'
        });

        if (isExpired && subscriber.subscription_tier === 'trial') {
          toast.warning('Seu trial expirou. Assine um plano para continuar usando.');
        }
      }

    } catch (error) {
      console.error('Erro ao verificar trial:', error);
      toast.error('Erro ao verificar status do trial');
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error('Você precisa estar logado para iniciar o trial');
        return false;
      }

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const { error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: session.user.id,
          email: session.user.email || '',
          subscribed: false,
          subscription_tier: 'trial',
          subscription_end: trialEndDate.toISOString()
        });

      if (error) {
        console.error('Erro ao iniciar trial:', error);
        toast.error('Erro ao iniciar trial');
        return false;
      }

      await checkTrialStatus();
      toast.success('Trial de 14 dias iniciado com sucesso!');
      return true;

    } catch (error) {
      console.error('Erro ao iniciar trial:', error);
      toast.error('Erro ao iniciar trial');
      return false;
    }
  };

  useEffect(() => {
    checkTrialStatus();
  }, []);

  return {
    trialStatus,
    isLoading,
    checkTrialStatus,
    startTrial
  };
};
