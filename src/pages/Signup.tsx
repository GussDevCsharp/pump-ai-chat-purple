
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupForm } from "@/components/SignupForm";
import { SignupStepper } from "@/components/SignupStepper";
import { SignupPlansStep } from "@/components/SignupPlansStep";
import { SignupPaymentFields } from "@/components/SignupPaymentFields";
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

const STEPS = [
  "Plano",
  "Cadastro",
  "Cobrança"
];

export default function Signup() {
  // Formulário geral
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

  const [isLoading, setIsLoading] = useState(false);

  // Buscar planos do Supabase
  useEffect(() => {
    setLoadingPlans(true);
    console.log("Buscando planos...");

    // Busca planos
    supabase
      .from("pricing")
      .select("id, name, description, price, is_paid, chatpump")
      .order("price", { ascending: true })
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar planos:", error);
          toast.error("Erro ao buscar planos");
          setLoadingPlans(false);
          return;
        }
        console.log("Todos os planos recebidos:", data);

        if (data && data.length > 0) {
          // Para cada plano, buscar os benefícios associados via o novo relacionamento muitos-para-muitos
          const planIds = data.map(plan => plan.id);

          // Obter todos os mapeamentos plan_benefit_mappings para esses planos, incluindo benefícios associados
          // Fazendo join direto: benefit_id -> benefits.description
          const { data: mappings, error: mappingsError } = await supabase
            .from("plan_benefit_mappings")
            .select("plan_id, benefit:benefit_id (description)")
            .in("plan_id", planIds);

          if (mappingsError) {
            console.error("Erro ao buscar os mapeamentos de benefícios:", mappingsError);
            toast.error("Erro ao buscar benefícios");
          }

          // Estratégia: montar benefits por plan_id
          const benefitsMap: Record<string, string[]> = {};
          if (mappings) {
            for (const mapping of mappings) {
              if (!benefitsMap[mapping.plan_id]) benefitsMap[mapping.plan_id] = [];
              // mapping.benefit?.description pode ser nulo se relacionamento quebrar
              if (mapping.benefit && mapping.benefit.description) {
                benefitsMap[mapping.plan_id].push(mapping.benefit.description);
              }
            }
          }

          // Junta benefícios aos planos
          const enrichedPlans = data.map(plan => ({
            ...plan,
            benefits: benefitsMap[plan.id] || [],
          }));

          // Mantém o filtro do chatpump se houver
          const filteredPlans = enrichedPlans.filter(plan => plan.chatpump === true);

          if (filteredPlans.length > 0) {
            setPlans(filteredPlans as Plan[]);
            setSelectedPlan(filteredPlans[0] as Plan);
          } else {
            setPlans(enrichedPlans as Plan[]);
            setSelectedPlan(enrichedPlans[0] as Plan);
            toast.warning("Usando todos os planos disponíveis", {
              duration: 5000
            });
          }
        } else {
          console.log("Nenhum plano encontrado na tabela pricing");
          const demoPlans = [
            {
              id: "free-plan",
              name: "Plano Gratuito",
              description: "Acesso básico às funcionalidades",
              price: 0,
              is_paid: false,
              benefits: ["Acesso limitado", "Suporte básico"]
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
          toast.warning("Usando planos de demonstração - Configure no Supabase", {
            duration: 5000
          });
        }
        setLoadingPlans(false);
      });
  }, []);

  // Passar para próximo/voltar
  function nextStep() {
    setStep(prev => prev + 1);
  }
  
  function prevStep() {
    setStep(prev => prev - 1);
  }

  // Render fluxo
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-12 w-full justify-center items-center">
      <div className="max-w-md w-full mx-auto">
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
                <Button
                  className="bg-pump-purple text-white w-full mt-6"
                  disabled={!selectedPlan}
                  onClick={nextStep}
                >
                  {selectedPlan?.is_paid ? "Prosseguir para cadastro" : "Prosseguir"}
                </Button>
              </>
            )}
          </div>
        )}

        {step === 1 && selectedPlan && (
          <div>
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
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1 text-pump-purple"
                onClick={prevStep}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-pump-purple text-white"
                onClick={nextStep}
                disabled={isLoading}
                type="button"
              >
                {selectedPlan.is_paid ? "Próxima etapa" : "Finalizar cadastro"}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && selectedPlan?.is_paid && (
          <div>
            <SignupPaymentFields
              cardNumber={cardNumber}
              cardExpiry={cardExpiry}
              cardCvc={cardCvc}
              setCardNumber={setCardNumber}
              setCardExpiry={setCardExpiry}
              setCardCvc={setCardCvc}
              disabled={isLoading}
            />
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1 text-pump-purple"
                onClick={prevStep}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                className="flex-1 bg-pump-purple text-white"
                onClick={() => toast.info("Fluxo visual concluído! (sem integração de pagamento)")}
                disabled={isLoading}
              >
                Finalizar cadastro
              </Button>
            </div>
          </div>
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
