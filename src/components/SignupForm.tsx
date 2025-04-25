
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Check, CreditCard, User } from "lucide-react";
import { ClientDataForm } from "./signup/ClientDataForm";
import { PlanSelectionForm } from "./signup/PlanSelectionForm";
import { PaymentMethodForm } from "./signup/PaymentMethodForm";
import { supabase } from "@/integrations/supabase/client";

export function SignupForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("client-data");
  const [isLoading, setIsLoading] = useState(false);

  // Dados do cliente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  // Dados do plano
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Dados de pagamento
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleNextTab = () => {
    if (activeTab === "client-data") {
      // Validação de dados do cliente
      if (!email || !password || !confirmPassword || !firstName || !lastName || !cpf) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem");
        return;
      }
      
      setActiveTab("plan-selection");
    } else if (activeTab === "plan-selection") {
      // Validação de seleção de plano
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlanId || (!cardNumber && selectedPlanId !== 'free-plan')) {
      toast.error("Por favor, complete todos os campos obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Registro no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            cpf
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Se tivermos um plano pago e dados de cartão, simulamos processamento do pagamento
      if (selectedPlanId !== 'free-plan' && cardNumber) {
        // Simulação de processamento de pagamento (em produção seria integrado com Stripe, etc)
      }
      
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Ocorreu um erro durante o cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden border border-white/20 transition-all duration-300">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

        <div className="p-6 space-y-6">
          <TabsContent value="client-data" className="mt-0 space-y-6">
            <ClientDataForm 
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
            />
            <div className="flex justify-end">
              <Button 
                className="bg-pump-purple hover:bg-pump-purple/90 text-white transition-all duration-300"
                onClick={handleNextTab}
                disabled={isLoading}
              >
                Próximo: Escolha do Plano
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="plan-selection" className="mt-0 space-y-6">
            <PlanSelectionForm 
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
              isLoading={isLoading}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                className="border-pump-purple text-pump-purple hover:bg-pump-purple/10 transition-all duration-300"
                onClick={handlePreviousTab}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                className="bg-pump-purple hover:bg-pump-purple/90 text-white transition-all duration-300"
                onClick={handleNextTab}
                disabled={isLoading || !selectedPlanId}
              >
                {selectedPlanId === 'free-plan' ? 'Finalizar Cadastro' : 'Próximo: Pagamento'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="payment-method" className="mt-0 space-y-6">
            <PaymentMethodForm 
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvc={cardCvc}
              setCardCvc={setCardCvc}
              isLoading={isLoading}
              selectedPlanId={selectedPlanId}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline"
                className="border-pump-purple text-pump-purple hover:bg-pump-purple/10 transition-all duration-300"
                onClick={handlePreviousTab}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                className="bg-pump-purple hover:bg-pump-purple/90 text-white transition-all duration-300"
                onClick={handleSubmit}
                disabled={isLoading || (!cardNumber && selectedPlanId !== 'free-plan')}
              >
                Finalizar Cadastro
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="text-center p-6 border-t border-gray-100 bg-gray-50">
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
    </Card>
  );
}
