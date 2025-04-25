
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, User, Check } from "lucide-react";
import { toast } from "sonner";
import { SignupProvider, useSignup } from "@/contexts/SignupContext";
import { ClientDataForm } from "./signup/ClientDataForm";
import { PlanSelectionForm } from "./signup/PlanSelectionForm";
import { PaymentMethodForm } from "./signup/PaymentMethodForm";
import { FormNavigation } from "./signup/FormNavigation";
import { useSignupSubmit } from "@/hooks/useSignupSubmit";
import { useIsMobile } from "@/hooks/use-mobile";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function SignupFormContent() {
  const [activeTab, setActiveTab] = useState("client-data");
  const { handleSubmit } = useSignupSubmit();
  const isMobile = useIsMobile();
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    cpf,
    selectedPlanId,
    isLoading,
    cardNumber,
    cardExpiry,
    cardCvc
  } = useSignup();

  const isClientDataValid = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !cpf) {
      return false;
    }
    if (!isValidEmail(email)) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    return true;
  };

  const isPlanSelectionValid = () => {
    return !!selectedPlanId;
  };

  const isPaymentValid = () => {
    if (selectedPlanId === 'free-plan') return true;
    return cardNumber.length >= 16 && cardExpiry.length === 5 && cardCvc.length === 3;
  };

  const canAccessTab = (tab: string) => {
    switch (tab) {
      case "client-data":
        return true;
      case "plan-selection":
        return isClientDataValid();
      case "payment-method":
        return isClientDataValid() && isPlanSelectionValid();
      default:
        return false;
    }
  };

  const handleTabChange = (tab: string) => {
    if (!canAccessTab(tab)) {
      if (tab === "plan-selection") {
        toast.error("Por favor, preencha todos os dados do cliente corretamente");
      } else if (tab === "payment-method") {
        toast.error("Por favor, selecione um plano antes de prosseguir");
      }
      return;
    }
    setActiveTab(tab);
  };

  const handleNextTab = () => {
    if (activeTab === "client-data" && isClientDataValid()) {
      setActiveTab("plan-selection");
    } else if (activeTab === "plan-selection" && isPlanSelectionValid()) {
      if (selectedPlanId !== 'free-plan') {
        setActiveTab("payment-method");
      }
    }
  };

  const handlePreviousTab = () => {
    if (activeTab === "plan-selection") {
      setActiveTab("client-data");
    } else if (activeTab === "payment-method") {
      setActiveTab("plan-selection");
    }
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-white/20">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 p-1 bg-pump-gray-light rounded-t-2xl">
          <TabsTrigger 
            value="client-data" 
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 py-1 sm:py-2">
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "client-data" ? "bg-pump-purple text-white" : isClientDataValid() ? "bg-green-500" : "bg-gray-200"
              }`}>
                {isClientDataValid() ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <User className="h-3 w-3 sm:h-4 sm:w-4" />}
              </div>
              <span className="text-xs sm:text-sm">
                {isMobile ? "Dados" : "Dados do Cliente"}
              </span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="plan-selection"
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={!canAccessTab("plan-selection") || isLoading}
          >
            <div className="flex items-center gap-2 py-1 sm:py-2">
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "plan-selection" ? "bg-pump-purple text-white" : isPlanSelectionValid() ? "bg-green-500" : "bg-gray-200"
              }`}>
                {isPlanSelectionValid() ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Check className="h-3 w-3 sm:h-4 sm:w-4" />}
              </div>
              <span className="text-xs sm:text-sm">
                {isMobile ? "Plano" : "Escolha do Plano"}
              </span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="payment-method"
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={!canAccessTab("payment-method") || isLoading}
          >
            <div className="flex items-center gap-2 py-1 sm:py-2">
              <div className={`rounded-full h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "payment-method" ? "bg-pump-purple text-white" : isPaymentValid() ? "bg-green-500" : "bg-gray-200"
              }`}>
                {isPaymentValid() ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />}
              </div>
              <span className="text-xs sm:text-sm">
                {isMobile ? "Pagamento" : "Pagamento"}
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <TabsContent value="client-data" className="h-full">
            <ClientDataForm />
            <FormNavigation
              activeTab={activeTab}
              onNext={handleNextTab}
              isLoading={isLoading}
              selectedPlanId={selectedPlanId}
            />
          </TabsContent>

          <TabsContent value="plan-selection" className="h-full">
            <PlanSelectionForm />
            <FormNavigation
              activeTab={activeTab}
              onPrevious={handlePreviousTab}
              onNext={handleNextTab}
              onSubmit={handleSubmit}
              isLastStep={selectedPlanId === 'free-plan'}
              isLoading={isLoading}
              selectedPlanId={selectedPlanId}
            />
          </TabsContent>

          <TabsContent value="payment-method" className="h-full">
            <PaymentMethodForm />
            <FormNavigation
              activeTab={activeTab}
              onPrevious={handlePreviousTab}
              onSubmit={handleSubmit}
              isLastStep={true}
              isLoading={isLoading}
              selectedPlanId={selectedPlanId}
            />
          </TabsContent>
        </div>

        <div className="text-center p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/login">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-pump-purple text-pump-purple hover:bg-pump-purple/10 transition-all duration-300"
              disabled={isLoading}
            >
              Fazer login
            </Button>
          </Link>
        </div>
      </Tabs>
    </Card>
  );
}

export function SignupForm() {
  return (
    <SignupProvider>
      <SignupFormContent />
    </SignupProvider>
  );
}

export default SignupForm;
