
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscription = async () => {
    setIsLoading(true);
    console.log("Checking subscription status...");

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error("Error checking subscription:", error);
        toast.error("Erro ao verificar status da assinatura");
        return;
      }

      console.log("Subscription data received:", data);
      setSubscriptionData(data);
    } catch (error) {
      console.error("Error in subscription check:", error);
      toast.error("Erro ao verificar assinatura");
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (planType: 'monthly' | 'quarterly' | 'annual') => {
    setIsLoading(true);
    console.log("Creating checkout session for plan:", planType);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) {
        console.error("Error creating checkout:", error);
        toast.error("Erro ao criar sessão de pagamento");
        return;
      }

      console.log("Checkout session created:", data);
      
      // Open Stripe checkout in new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error in checkout creation:", error);
      toast.error("Erro ao iniciar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    setIsLoading(true);
    console.log("Opening customer portal...");

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error("Error opening portal:", error);
        toast.error("Erro ao abrir portal do cliente");
        return;
      }

      console.log("Customer portal session created:", data);
      
      // Open customer portal in new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Erro ao abrir portal");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscriptionData,
    isLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
