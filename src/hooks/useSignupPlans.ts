
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plan } from "@/types/signup";

export const useSignupPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      console.log("Buscando planos...");

      const { data: planData, error: planError } = await supabase
        .from("pricing")
        .select("id, name, description, chatpump");

      if (planError) {
        console.error("Erro ao buscar planos:", planError);
        toast.error("Erro ao buscar planos");
        setLoadingPlans(false);
        return;
      }

      if (planData && planData.length > 0) {
        const plansWithBenefits: Plan[] = [];
        for (const plan of planData) {
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

        const filteredPlans = plansWithBenefits.filter(plan => plan.chatpump === true);
        const finalPlans = filteredPlans.length > 0 ? filteredPlans : plansWithBenefits;

        setPlans(finalPlans);
        setSelectedPlan(finalPlans[0]);
      } else {
        const demoPlans = [
          {
            id: "free-plan",
            name: "Plano Beta",
            description: "Acesso completo à plataforma",
            benefits: [
              "Chat especializado para empresa",
              "Agrupamento das conversas por tema empresarial",
              "Criação do perfil da sua empresa",
              "Criação do perfil do empresário",
              "Acesso a todos os temas empresariais",
              "Histórico completo de conversas"
            ]
          }
        ];
        setPlans(demoPlans);
        setSelectedPlan(demoPlans[0]);
        toast.warning("Usando planos de demonstração - Configure no Supabase", { duration: 5000 });
      }
      setLoadingPlans(false);
    };

    fetchPlans();
  }, []);

  return { plans, loadingPlans, selectedPlan, setSelectedPlan };
};
