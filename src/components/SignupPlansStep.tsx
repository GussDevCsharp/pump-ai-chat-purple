
import React from "react";
import { ArrowRight, User, Database, Smartphone, Upload, Clock, FileText, Shield, Users, Folder, Key, Activity, AlertTriangle, LogIn, Crown, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

// Mapeamento de ícones
const iconMap: { [key: string]: React.ReactNode } = {
  "usuário": <User className="w-4 h-4" />,
  "chat": <FileText className="w-4 h-4" />,
  "conversas": <Users className="w-4 h-4" />,
  "análises": <Activity className="w-4 h-4" />,
  "suporte": <AlertTriangle className="w-4 h-4" />,
  "integrações": <Key className="w-4 h-4" />,
  "premium": <Crown className="w-4 h-4" />,
  "ilimitadas": <Zap className="w-4 h-4" />,
  "prioritário": <Star className="w-4 h-4" />,
  "personalizadas": <Folder className="w-4 h-4" />,
};

interface Plan {
  id: string;
  name: string;
  description?: string;
  chatpump?: boolean;
  benefits?: string[];
}

interface SignupPlansStepProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelect: (plan: Plan) => void;
  disabled?: boolean;
}

function getBenefitIcon(benefit: string) {
  const lower = benefit.toLowerCase();
  const entry = Object.entries(iconMap).find(([key]) =>
    lower.includes(key.toLowerCase())
  );
  return entry ? entry[1] : <FileText className="w-4 h-4" />;
}

export function SignupPlansStep({ plans, selectedPlanId, onSelect, disabled }: SignupPlansStepProps) {
  const { createCheckout, isLoading } = useSubscription();

  // Define os planos pagos
  const premiumPlans = [
    {
      id: "plan-monthly",
      name: "Plano Mensal",
      price: "R$ 69,00",
      period: "por mês",
      description: "Acesso completo com cobrança mensal",
      planType: "monthly" as const,
      popular: false,
      benefits: [
        "Chat especializado premium",
        "Conversas ilimitadas",
        "Análises avançadas",
        "Suporte prioritário",
        "Histórico completo",
        "Perfil empresarial completo"
      ]
    },
    {
      id: "plan-quarterly",
      name: "Plano Trimestral",
      price: "R$ 59,00",
      period: "por mês",
      description: "Acesso completo com cobrança trimestral",
      planType: "quarterly" as const,
      popular: true,
      benefits: [
        "Chat especializado premium",
        "Conversas ilimitadas",
        "Análises avançadas",
        "Suporte prioritário",
        "Integrações personalizadas",
        "Histórico completo",
        "Perfil empresarial completo"
      ]
    },
    {
      id: "plan-annual",
      name: "Plano Anual",
      price: "R$ 49,00",
      period: "por mês",
      description: "Acesso completo com cobrança anual",
      planType: "annual" as const,
      popular: false,
      benefits: [
        "Chat especializado premium",
        "Conversas ilimitadas",
        "Análises avançadas",
        "Suporte prioritário",
        "Integrações personalizadas",
        "API personalizada",
        "Histórico completo",
        "Perfil empresarial completo"
      ]
    }
  ];

  const handlePremiumPlanSelect = async (planType: 'monthly' | 'quarterly' | 'annual') => {
    if (isLoading || disabled) return;
    await createCheckout(planType);
  };

  // Show free plans if available, otherwise show premium plans
  const showFreePlans = plans.length > 0;

  if (showFreePlans) {
    return (
      <div>
        <h3 className="font-semibold text-xl mb-6 text-gray-900 text-center">Acesso à Plataforma</h3>
        <div className="flex flex-col gap-8 justify-center items-start w-full max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {plans.map((plan) => {
              const selected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col min-h-[500px] bg-white border rounded-2xl shadow-md
                    transition-all duration-200
                    ${selected
                      ? "border-pump-purple ring-2 ring-pump-purple/30 bg-pump-purple/5 shadow-xl scale-105"
                      : "border-gray-200 hover:shadow-lg"}
                    `}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-1 text-xs text-gray-500">Versão Beta</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">{plan.name}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">Gratuito</span>
                    </div>
                    <div className="my-2 mb-4 text-lg font-semibold text-gray-900">
                      Acesso total
                    </div>
                    <Button
                      variant={selected ? "default" : "outline"}
                      className={`w-full mb-4 flex justify-between items-center transition
                      ${selected ? "bg-pump-purple text-white hover:bg-pump-purple/90" : "border-pump-purple text-pump-purple hover:bg-pump-purple/10"}
                      `}
                      onClick={() => !disabled && onSelect(plan)}
                      disabled={disabled}
                    >
                      Selecionar plano
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <p className="text-sm text-gray-700 mb-4">{plan.description}</p>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm mb-3 text-gray-900">Benefícios incluídos:</h4>
                      <ul className="flex flex-col gap-3">
                        {plan.benefits && plan.benefits.length > 0 ? (
                          plan.benefits.map((benefit, idxb) => (
                            <li key={idxb} className="flex gap-2 text-[15px] items-center text-gray-900">
                              <span className="text-pump-purple">{getBenefitIcon(benefit)}</span>
                              <span className="leading-tight">{benefit}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic text-[15px]">Sem benefícios informados</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-xl mb-6 text-gray-900 text-center">Escolha seu Plano</h3>
      <div className="flex flex-col gap-8 justify-center items-start w-full max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {premiumPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col min-h-[600px] bg-white border rounded-2xl shadow-md
                transition-all duration-200 hover:shadow-lg
                ${plan.popular ? "border-pump-purple ring-2 ring-pump-purple/30 scale-105" : "border-gray-200"}
                `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pump-purple text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-2 text-xs text-gray-500">Plano Premium</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{plan.name}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-pump-purple">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                
                <Button
                  className={`w-full mb-4 flex justify-between items-center transition
                  ${plan.popular 
                    ? "bg-pump-purple text-white hover:bg-pump-purple/90" 
                    : "border-pump-purple text-pump-purple hover:bg-pump-purple/10"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePremiumPlanSelect(plan.planType)}
                  disabled={isLoading || disabled}
                >
                  {isLoading ? "Processando..." : "Assinar Agora"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                
                <p className="text-sm text-gray-700 mb-4">{plan.description}</p>
                
                <div className="flex-grow">
                  <h4 className="font-semibold text-sm mb-3 text-gray-900">Benefícios incluídos:</h4>
                  <ul className="flex flex-col gap-3">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-[15px] items-center text-gray-900">
                        <span className="text-pump-purple">{getBenefitIcon(benefit)}</span>
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
