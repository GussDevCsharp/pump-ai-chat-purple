
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupPaymentFields } from "./SignupPaymentFields";
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
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
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
      case "pagamento":
        onStepChange(2);
        break;
      default:
        onStepChange(0);
    }
  }, [activeTab, onStepChange]);

  // Validation helpers
  const canGoToPlans = email && password && confirmPassword && password === confirmPassword && firstName && lastName && cpf;
  const canGoToPayment = selectedPlan !== null;
  const canSubmit = selectedPlan && (!selectedPlan.is_paid || (cardNumber && cardExpiry && cardCvc));

  return (
    <div className="mt-6 bg-white shadow-md rounded-lg p-6">
      <Tabs defaultValue="dados" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dados" disabled={isLoading}>Dados Pessoais</TabsTrigger>
          <TabsTrigger value="planos" disabled={!canGoToPlans || isLoading}>Planos</TabsTrigger>
          <TabsTrigger value="pagamento" disabled={!canGoToPayment || !canGoToPlans || isLoading}>Pagamento</TabsTrigger>
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
                Próxima: Escolher Plano
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
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Escolha um Plano</h3>
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
                  disabled={!canGoToPayment || isLoading}
                  onClick={() => setActiveTab("pagamento")}
                >
                  {selectedPlan?.is_paid ? "Próxima: Pagamento" : "Finalizar Cadastro"}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pagamento">
          <form onSubmit={(e) => { e.preventDefault(); handleSignup(selectedPlan); }} className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Dados de Pagamento</h3>
            
            {selectedPlan?.is_paid ? (
              <SignupPaymentFields
                cardNumber={cardNumber}
                cardExpiry={cardExpiry}
                cardCvc={cardCvc}
                disabled={isLoading}
                setCardNumber={setCardNumber}
                setCardExpiry={setCardExpiry}
                setCardCvc={setCardCvc}
              />
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                <p className="font-medium">Plano Gratuito Selecionado</p>
                <p className="text-sm mt-1">Não é necessário informar dados de pagamento para este plano.</p>
              </div>
            )}
            
            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-900">Resumo do plano selecionado</h4>
                {selectedPlan && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p><span className="font-medium">Plano:</span> {selectedPlan.name}</p>
                    <p><span className="font-medium">Valor:</span> {selectedPlan.price > 0 ? `R$ ${selectedPlan.price.toFixed(2)}/mês` : "Gratuito"}</p>
                    {selectedPlan.description && <p className="mt-1 text-xs text-gray-500">{selectedPlan.description}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="text-pump-purple border-pump-purple hover:bg-pump-purple/10" 
                onClick={() => setActiveTab("planos")}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                className="bg-pump-purple text-white hover:bg-pump-purple/90" 
                disabled={!canSubmit || isLoading}
              >
                {isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
