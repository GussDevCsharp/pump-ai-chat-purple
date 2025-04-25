
import React from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function PlanSelectionForm() {
  const { selectedPlanId, setSelectedPlanId, isLoading } = useSignup();

  const plans = [
    {
      id: "free-plan",
      name: "Plano Gratuito",
      description: "Acesso básico às funcionalidades",
      price: 0,
      is_paid: false,
      benefits: [
        "Chat especializado para empresa",
        "Limite de interações diárias: 10",
        "Agrupamento das conversas por tema empresarial",
        "Criação do perfil da sua empresa",
        "Criação do perfil do empresário"
      ]
    },
    {
      id: "premium-plan",
      name: "Plano Premium",
      description: "Acesso completo a todas as funcionalidades",
      price: 29.90,
      is_paid: true,
      benefits: [
        "Todas as funções do plano gratuito",
        "Interações ilimitadas",
        "Suporte prioritário",
        "Análise de dados avançada",
        "Integração com outras plataformas"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Escolha seu Plano</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all border-2 p-6 hover:shadow-md ${
              selectedPlanId === plan.id 
                ? "border-pump-purple bg-pump-purple/5" 
                : "border-gray-200"
            }`}
            onClick={() => !isLoading && setSelectedPlanId(plan.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
              </div>
              {selectedPlanId === plan.id && (
                <div className="h-6 w-6 bg-pump-purple rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="mt-4 mb-6">
              <p className="text-2xl font-bold text-gray-900">
                {plan.price === 0 
                  ? "Grátis" 
                  : `R$ ${plan.price.toFixed(2)}`
                }
                {plan.price > 0 && <span className="text-sm font-normal">/mês</span>}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Benefícios:</p>
              <ul className="space-y-2">
                {plan.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-pump-purple mr-2">
                      <Check className="h-4 w-4" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
