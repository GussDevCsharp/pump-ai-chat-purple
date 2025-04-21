import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignupForm } from "@/components/SignupForm";
import { SignupStepper } from "@/components/SignupStepper";
import { SignupPlansStep } from "@/components/SignupPlansStep";
import { SignupCompanyProfileStep } from "@/components/SignupCompanyProfileStep";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Tipos
type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[];
};
type Benefit = string;

// Novas etapas: 1. Dados + Plano, 2. Perfil empresa
const STEPS = [
  "Plano e Cadastro Básico",
  "Perfil da Empresa"
];

export default function Signup() {
  // Estado dos passos
  const [step, setStep] = useState(0);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Dados do usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  // Dados pagamento
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Dados perfil empresa (etapa 2)
  const [companyName, setCompanyName] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [averageRevenue, setAverageRevenue] = useState("");
  const [address, setAddress] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Buscar planos do Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      console.log("Buscando planos...");

      const { data: planData, error: planError } = await supabase
        .from("pricing")
        .select("id, name, description, price, is_paid, chatpump")
        .order("price", { ascending: true });

      if (planError) {
        console.error("Erro ao buscar planos:", planError);
        toast.error("Erro ao buscar planos");
        setLoadingPlans(false);
        return;
      }

      if (planData && planData.length > 0) {
        const filteredPlans = planData.filter(plan => plan.chatpump === true);
        setPlans(filteredPlans.length > 0 ? filteredPlans : planData);
        setSelectedPlan((filteredPlans.length > 0 ? filteredPlans : planData)[0]);
        if (filteredPlans.length === 0) {
          toast.warning("Usando todos os planos disponíveis", { duration: 5000 });
        }
      } else {
        // Modo demonstração
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

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-12 w-full justify-center items-center">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
              alt="Pump.ia"
              className="h-12 mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta grátis
          </h2>
          <p className="mt-2 text-sm text-pump-gray">
            Cadastre-se para acessar todas as funcionalidades
          </p>
        </div>

        <SignupStepper steps={STEPS} current={step} />

        {step === 0 && (
          <div>
            {loadingPlans ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pump-purple border-t-transparent"></div>
                <p className="mt-2 text-pump-purple">Carregando planos...</p>
              </div>
            ) : (
              <>
                <SignupPlansStep
                  plans={plans}
                  selectedPlanId={selectedPlan?.id ?? null}
                  onSelect={plan => setSelectedPlan(plan)}
                  disabled={isLoading}
                />
                <div className="mt-8">
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
                </div>
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
              </>
            )}
          </div>
        )}

        {step === 1 && (
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
        )}

        <div className="text-center pt-4 border-t mt-10">
          <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/login">
            <Button
              variant="outline"
              className="text-pump-purple hover:bg-pump-purple/10"
            >
              Fazer login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
// O arquivo ficou longo! Peça para refatorar se desejar.
