
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  benefits?: string[];
}

interface PlanSelectionFormProps {
  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
  isLoading: boolean;
}

export function PlanSelectionForm({
  selectedPlanId,
  setSelectedPlanId,
  isLoading
}: PlanSelectionFormProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);

      try {
        // Buscar planos do Supabase
        const { data: planData, error: planError } = await supabase
          .from("pricing")
          .select("id, name, description, price, is_paid");

        if (planError) {
          throw planError;
        }

        if (planData && planData.length > 0) {
          const plansWithBenefits: Plan[] = [];

          for (const plan of planData) {
            // Buscar benefícios associados ao plano
            const { data: benefitMappings, error: benefitError } = await supabase
              .from("plan_benefit_mappings")
              .select("benefit_id")
              .eq("plan_id", plan.id);

            if (benefitError) {
              console.error(`Erro ao buscar benefícios para o plano ${plan.id}:`, benefitError);
              continue;
            }

            let benefitDescriptions: string[] = [];
            if (benefitMappings && benefitMappings.length > 0) {
              const benefitIds = benefitMappings.map(mapping => mapping.benefit_id);

              const { data: benefits, error: descriptionsError } = await supabase
                .from("benefits")
                .select("description")
                .in("id", benefitIds);

              if (descriptionsError) {
                console.error("Erro ao buscar descrições dos benefícios:", descriptionsError);
              } else if (benefits) {
                benefitDescriptions = benefits.map(benefit => benefit.description);
              }
            }

            plansWithBenefits.push({
              ...plan,
              benefits: benefitDescriptions
            });
          }

          setPlans(plansWithBenefits);
          
          // Selecionar o primeiro plano por padrão se não houver um plano selecionado
          if (!selectedPlanId && plansWithBenefits.length > 0) {
            setSelectedPlanId(plansWithBenefits[0].id);
          }
        } else {
          // Planos de demonstração caso não haja planos no banco de dados
          const demoPlans = [
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
          
          setPlans(demoPlans);
          
          // Selecionar o primeiro plano por padrão
          if (!selectedPlanId) {
            setSelectedPlanId(demoPlans[0].id);
          }
          
          toast.warning("Usando planos de demonstração - Configure no Supabase", { 
            duration: 5000 
          });
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        toast.error("Erro ao carregar os planos disponíveis");
        
        // Carregar planos de demonstração em caso de erro
        const fallbackPlans = [
          {
            id: "free-plan",
            name: "Plano Gratuito",
            description: "Acesso básico às funcionalidades",
            price: 0,
            is_paid: false,
            benefits: ["Chat básico", "Limite de interações: 10/dia"]
          }
        ];
        
        setPlans(fallbackPlans);
        if (!selectedPlanId) {
          setSelectedPlanId(fallbackPlans[0].id);
        }
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [selectedPlanId, setSelectedPlanId]);

  if (loadingPlans) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pump-purple"></div>
      </div>
    );
  }

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
