import React, { useEffect, useState } from "react";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupCompanyProfileStep } from "./SignupCompanyProfileStep";
import { SignupProfileFields } from "./SignupProfileFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Type for plan data
type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[];
};

// NOVAS ETAPAS (usando a ordem desejada)
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

  // User data (básico)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Perfil do usuário
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  // Payment data (deixado mas oculto)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Company profile data
  const [companyName, setCompanyName] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [averageRevenue, setAverageRevenue] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Busca planos (igual antes, mas corrigindo tipagem para garantir compatibilidade)
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      console.log("Buscando planos...");

      // Busca os planos (sem benefits direto)
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
          // busca os benefícios para este plano
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

        // Se existir algum plano com chatpump = true, mostrar só esses
        const filteredPlans = plansWithBenefits.filter(plan => plan.chatpump === true);
        const finalPlans = filteredPlans.length > 0 ? filteredPlans : plansWithBenefits;

        setPlans(finalPlans);
        setSelectedPlan(finalPlans[0]);

        if (filteredPlans.length === 0 && plansWithBenefits.length > 0) {
          toast.warning("Usando todos os planos disponíveis", { duration: 5000 });
        }
      } else {
        // Demo-mode, fallback
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

  // PASSO 0: Planos
  if (step === 0) {
    return (
      <div className="mt-10">
        {loadingPlans ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pump-purple border-t-transparent"></div>
            <p className="mt-2 text-pump-purple">Carregando planos...</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="md:w-2/3 w-full mx-auto">
              <SignupPlansStep
                plans={plans}
                selectedPlanId={selectedPlan?.id ?? null}
                onSelect={plan => setSelectedPlan(plan)}
                disabled={isLoading}
              />
              <Button
                className="bg-pump-purple text-white w-full mt-6"
                disabled={!selectedPlan || isLoading}
                onClick={nextStep}
              >
                Próxima etapa: Cadastro Básico
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PASSO 1: Cadastro Básico
  if (step === 1) {
    return (
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
          hidePayment // pagamentos removido/oculto
        />
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 text-pump-purple" onClick={prevStep} disabled={isLoading}>Voltar</Button>
          <Button
            className="flex-1 bg-pump-purple text-white"
            onClick={nextStep}
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
    );
  }

  // PASSO 2: Perfil da Empresa
  if (step === 2) {
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
        onFinish={nextStep}
      />
    );
  }

  // PASSO 3: Perfil do Usuário
  if (step === 3) {
    return (
      <div className="mt-10 max-w-xl mx-auto bg-white rounded shadow p-8">
        <h3 className="font-semibold text-lg mb-6 text-center text-gray-900">Perfil do Usuário</h3>
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
            <Button variant="outline" className="flex-1 text-pump-purple" onClick={prevStep} type="button" disabled={isLoading}>
              Voltar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-pump-purple text-white"
              disabled={
                !firstName ||
                !lastName ||
                !cpf ||
                isLoading
              }
            >
              Finalizar cadastro
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return null;
}
