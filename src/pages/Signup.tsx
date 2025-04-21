
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
    supabase
      .from("pricing")
      .select("id, name, description, price, is_paid")
      .eq("chatpump", true)
      .order("price", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Erro ao buscar planos");
        } else if (data) {
          setPlans(data as Plan[]);
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
              <div className="text-center py-10 text-pump-purple">Carregando planos...</div>
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
              hidePayment // Esconda pagamento desta etapa
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

        {/* Etapa PAGAMENTO somente se plano pago */}
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
                // Aqui submeteria o cadastro definitivo
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
