import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupCompanyProfileStep } from "./SignupCompanyProfileStep";
import { SignupProfileFields } from "./SignupProfileFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  "Planos",
  "Cadastro Básico",
  "Perfil da Empresa",
  "Perfil do Usuário"
];

export function SignupStepperFlow() {
  const [step, setStep] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

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

        if (filteredPlans.length === 0 && plansWithBenefits.length > 0) {
          toast.warning("Usando todos os planos disponíveis", { duration: 5000 });
        }
      } else {
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

  return (
    <>
      {step === 0 && (
        <div className="mt-10">
          {loadingPlans ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pump-purple border-t-transparent"></div>
              <p className="mt-2 text-pump-purple">Carregando planos...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 justify-center items-start w-full max-w-[1200px] mx-auto px-4">
              <div className="w-full">
                <SignupPlansStep
                  plans={plans}
                  selectedPlanId={selectedPlan?.id ?? null}
                  onSelect={plan => setSelectedPlan(plan)}
                  disabled={isLoading}
                />
                <Button
                  className="bg-pump-purple text-white w-full mt-6"
                  disabled={!selectedPlan || isLoading}
                  onClick={() => setStep(prev => prev + 1)}
                >
                  Próxima etapa: Cadastro Básico
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="mt-10 max-w-xl mx-auto">
          <SignupForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            hidePayment
          />
          <div className="flex gap-2 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 text-pump-purple" 
              onClick={() => setStep(prev => prev - 1)} 
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button
              className="flex-1 bg-pump-purple text-white"
              onClick={() => setStep(prev => prev + 1)}
              disabled={
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                isLoading
              }
            >
              Próxima etapa: Perfil da Empresa
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
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
          onPrev={() => setStep(prev => prev - 1)}
          onFinish={() => setStep(prev => prev + 1)}
        />
      )}

      {step === 3 && (
        <div className="mt-10 max-w-xl mx-auto bg-white rounded shadow p-8">
          <h3 className="font-semibold text-lg mb-6 text-center text-gray-900">
            Perfil do Usuário
          </h3>
          <form
            onSubmit={e => {
              e.preventDefault();
              toast.info("Cadastro concluído! (fluxo visual, sem integração)");
            }}
            className="space-y-5"
          >
            <SignupProfileFields
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              cpf={cpf}
              setCpf={setCpf}
              disabled={isLoading}
            />

            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1 text-pump-purple" 
                onClick={() => setStep(prev => prev - 1)}
                type="button" 
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-pump-purple text-white"
                disabled={!firstName || !lastName || !cpf || isLoading}
              >
                Finalizar cadastro
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
