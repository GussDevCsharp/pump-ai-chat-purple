
import React, { useEffect, useState } from "react";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupCompanyProfileStep } from "./SignupCompanyProfileStep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[];
};

const STEPS = [
  "Plano e Cadastro Básico",
  "Perfil da Empresa"
];

export function SignupStepperFlow() {
  const [step, setStep] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // User data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  // Payment data
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Company profile data (step 2)
  const [companyName, setCompanyName] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [averageRevenue, setAverageRevenue] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      console.log("Buscando planos...");

      // First, fetch all plans from the pricing table
      const { data: planData, error: planError } = await supabase
        .from("pricing")
        .select("id, name, description, price, is_paid, chatpump");
      
      if (planError) {
        console.error("Erro ao buscar planos:", planError);
        toast.error("Erro ao buscar planos");
        setLoadingPlans(false);
        return;
      }

      if (planData && planData.length > 0) {
        // Create an array to hold the plans with their benefits
        const plansWithBenefits: Plan[] = [];
        
        // For each plan, fetch its benefits through the mapping table
        for (const plan of planData) {
          // Get benefit descriptions for this plan through the mapping table
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
            // Extract benefit IDs
            const benefitIds = benefitMappings.map(mapping => mapping.benefit_id);
            
            // Fetch the actual benefit descriptions
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
          
          // Add the plan with its benefits to our array
          plansWithBenefits.push({
            ...plan,
            benefits: benefitDescriptions
          });
        }
        
        // Filter plans that have chatpump=true if any exist
        const filteredPlans = plansWithBenefits.filter(plan => plan.chatpump === true);
        
        // Use filtered plans if available, otherwise use all plans
        const finalPlans = filteredPlans.length > 0 ? filteredPlans : plansWithBenefits;
        
        setPlans(finalPlans);
        setSelectedPlan(finalPlans[0]);
        
        if (filteredPlans.length === 0 && plansWithBenefits.length > 0) {
          toast.warning("Usando todos os planos disponíveis", { duration: 5000 });
        }
      } else {
        // No plans found, use demo plans
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
            benefits: ["Todas as funções", "Suporte prioritário"]
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

  function nextStep() {
    setStep(prev => prev + 1);
  }

  function prevStep() {
    setStep(prev => prev - 1);
  }

  // Step 0: 2 columns: form + plans
  if (step === 0) {
    return (
      <div className="mt-10">
        {loadingPlans ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pump-purple border-t-transparent"></div>
            <p className="mt-2 text-pump-purple">Carregando planos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="order-2 md:order-1">
              <SignupForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                cpf={cpf}
                setCpf={setCpf}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                hidePayment
              />
              <Button
                className="bg-pump-purple text-white w-full mt-6"
                disabled={
                  !selectedPlan ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !firstName ||
                  !lastName ||
                  !cpf ||
                  isLoading
                }
                onClick={nextStep}
              >
                Próxima etapa
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <SignupPlansStep
                plans={plans}
                selectedPlanId={selectedPlan?.id ?? null}
                onSelect={plan => setSelectedPlan(plan)}
                disabled={isLoading}
                forceColumn
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 1: Company profile
  if (step === 1) {
    return (
      <SignupCompanyProfileStep
        companyName={companyName}
        setCompanyName={setCompanyName}
        mainProducts={mainProducts}
        setMainProducts={setMainProducts}
        employeesCount={employeesCount}
        setEmployeesCount={setEmployeesCount}
        averageRevenue={averageRevenue}
        setAverageRevenue={setAverageRevenue}
        address={address}
        setAddress={setAddress}
        isLoading={isLoading}
        onPrev={prevStep}
        onFinish={() => toast.info("Cadastro concluído! (fluxo visual, sem integração)")}
      />
    );
  }

  return null;
}
