
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';

interface Plan {
  id: string;
  name: string;
  description: string;
  chatpump: boolean;
  benefits: string[];
}

export default function Subscription() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { data: subscription, isLoading: subLoading, refetch } = useSubscription();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data: plansData, error: plansError } = await supabase
          .from('pricing')
          .select(`
            id,
            name,
            description,
            chatpump,
            plan_benefit_mappings!inner(
              benefits!inner(
                description
              )
            )
          `)
          .eq('chatpump', true);

        if (plansError) throw plansError;

        const formattedPlans = plansData?.map(plan => ({
          id: plan.id,
          name: plan.name,
          description: plan.description,
          chatpump: plan.chatpump,
          benefits: plan.plan_benefit_mappings.map((mapping: any) => 
            mapping.benefits.description
          )
        })) || [];

        setPlans(formattedPlans);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
        toast.error('Erro ao carregar planos de assinatura');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planType: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error('Você precisa estar logado para assinar');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planType }
      });

      if (error) throw error;

      // Abrir checkout do Stripe em nova aba
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error('Erro ao processar pagamento');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      // Abrir portal do cliente em nova aba
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Erro ao acessar portal:', error);
      toast.error('Erro ao acessar portal do cliente');
    }
  };

  const refreshSubscription = async () => {
    try {
      await supabase.functions.invoke('check-subscription');
      await refetch();
      toast.success('Status da assinatura atualizado');
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      toast.error('Erro ao atualizar status da assinatura');
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes('Anual')) return <Crown className="h-6 w-6" />;
    if (planName.includes('Trimestral')) return <Star className="h-6 w-6" />;
    return <Zap className="h-6 w-6" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.includes('Anual')) return 'border-yellow-400 bg-yellow-50';
    if (planName.includes('Trimestral')) return 'border-purple-400 bg-purple-50';
    return 'border-blue-400 bg-blue-50';
  };

  if (isLoading || subLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tenha acesso completo à plataforma ChatPump e potencialize seu negócio
          </p>
        </div>

        {/* Status da Assinatura */}
        {subscription && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800">Status da Assinatura</CardTitle>
                    <CardDescription className="text-green-600">
                      {subscription.subscribed ? 'Assinatura Ativa' : 'Sem Assinatura Ativa'}
                    </CardDescription>
                  </div>
                  <Badge variant={subscription.subscribed ? "default" : "secondary"}>
                    {subscription.subscription_tier || 'Gratuito'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button onClick={refreshSubscription} variant="outline">
                    Atualizar Status
                  </Button>
                  {subscription.subscribed && (
                    <Button onClick={handleManageSubscription}>
                      Gerenciar Assinatura
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = subscription?.subscription_tier?.includes(plan.name.split(' ')[1]);
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${getPlanColor(plan.name)} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Seu Plano</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {plan.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (plan.name.includes('Mensal')) handleSubscribe('monthly');
                        else if (plan.name.includes('Trimestral')) handleSubscribe('quarterly');
                        else if (plan.name.includes('Anual')) handleSubscribe('annual');
                      }}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Plano Atual' : 'Assinar Agora'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Pagamento seguro processado pelo Stripe • Cancele a qualquer momento
          </p>
        </div>
      </div>
    </div>
  );
}
