
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, User } from "lucide-react";
import { toast } from "sonner";
import { SignupProvider, useSignup } from "@/contexts/SignupContext";
import { ClientDataForm } from "./signup/ClientDataForm";
import { PlanSelectionForm } from "./signup/PlanSelectionForm";
import { PaymentMethodForm } from "./signup/PaymentMethodForm";
import { FormNavigation } from "./signup/FormNavigation";
import { useSignupSubmit } from "@/hooks/useSignupSubmit";

function SignupFormContent() {
  const [activeTab, setActiveTab] = useState("client-data");
  const { handleSubmit } = useSignupSubmit();
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    cpf,
    selectedPlanId,
    isLoading
  } = useSignup();

  const handleNextTab = () => {
    if (activeTab === "client-data") {
      if (!email || !password || !confirmPassword || !firstName || !lastName || !cpf) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      
      setActiveTab("plan-selection");
    } else if (activeTab === "plan-selection" && selectedPlanId !== 'free-plan') {
      if (!selectedPlanId) {
        toast.error("Por favor, selecione um plano");
        return;
      }
      
      setActiveTab("payment-method");
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
    <Card className="w-full h-[90vh] max-w-4xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-white/20">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 p-1 bg-pump-gray-light rounded-t-2xl">
          <TabsTrigger 
            value="client-data" 
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 py-2">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "client-data" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <User className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">Dados do Cliente</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="plan-selection"
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 py-2">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "plan-selection" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <Check className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">Escolha do Plano</span>
            </div>
          </TabsTrigger>
          
          <TabsTrigger 
            value="payment-method"
            className="data-[state=active]:bg-white data-[state=active]:text-pump-purple data-[state=active]:shadow-md transition-all duration-300 rounded-xl"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 py-2">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-300 ${
                activeTab === "payment-method" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="hidden md:inline">Pagamento</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="flex-grow overflow-auto p-6">
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

        <div className="text-center p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/login">
            <Button
              variant="outline"
              className="border-pump-purple text-pump-purple hover:bg-pump-purple/10 transition-all duration-300"
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

