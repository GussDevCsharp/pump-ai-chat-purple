
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupCredentials } from "./signup/SignupCredentials";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSignup } from "@/hooks/useSignup";
import { useSignupPlans } from "@/hooks/useSignupPlans";

interface SignupStepperFlowProps {
  onStepChange: (step: number) => void;
}

export function SignupStepperFlow({ onStepChange }: SignupStepperFlowProps) {
  const [activeTab, setActiveTab] = React.useState("dados");
  
  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    cpf,
    setCpf,
    handleSignup,
  } = useSignup();

  const { plans, loadingPlans, selectedPlan, setSelectedPlan } = useSignupPlans();

  // Effect to update step based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "dados":
        onStepChange(0);
        break;
      case "planos":
        onStepChange(1);
        break;
      default:
        onStepChange(0);
    }
  }, [activeTab, onStepChange]);

  // Validation helpers
  const canGoToPlans = email && password && confirmPassword && password === confirmPassword && firstName && lastName && cpf;
  const canSubmit = selectedPlan !== null && canGoToPlans;

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="dados" disabled={isLoading}>Dados Pessoais</TabsTrigger>
          <TabsTrigger value="planos" disabled={!canGoToPlans || isLoading}>Finalizar</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <form className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Seus Dados</h3>
            <SignupCredentials
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isLoading={isLoading}
            />
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
              isLoading={isLoading}
              setIsLoading={() => {}}
              hidePayment
            />
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                className="bg-pump-purple text-white hover:bg-pump-purple/90" 
                disabled={!canGoToPlans || isLoading}
                onClick={() => setActiveTab("planos")}
              >
                Próximo: Finalizar Cadastro
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="planos">
          {loadingPlans ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pump-purple border-t-transparent"></div>
              <p className="mt-2 text-pump-purple">Carregando planos...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Finalize seu cadastro</h3>
              <SignupPlansStep
                plans={plans}
                selectedPlanId={selectedPlan?.id ?? null}
                onSelect={plan => setSelectedPlan(plan)}
                disabled={isLoading}
              />
              <div className="flex justify-between mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-pump-purple border-pump-purple hover:bg-pump-purple/10" 
                  onClick={() => setActiveTab("dados")}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
                <Button 
                  type="button" 
                  className="bg-pump-purple text-white hover:bg-pump-purple/90" 
                  disabled={!canSubmit || isLoading}
                  onClick={() => handleSignup(selectedPlan)}
                >
                  {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
