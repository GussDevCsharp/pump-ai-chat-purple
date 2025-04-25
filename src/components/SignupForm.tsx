
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
  
  // Dados da empresa
  const [companyName, setCompanyName] = useState("");
  const [mainProducts, setMainProducts] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [address, setAddress] = useState("");

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
        // Aqui seria feito o processamento real do pagamento
      }
      
      // Criar perfil da empresa
      if (data.user) {
        const { error: profileError } = await supabase
          .from('company_profiles')
          .insert({
            user_id: data.user.id,
            company_name: companyName,
            main_products: mainProducts,
            employees_count: employeesCount ? parseInt(employeesCount) : null,
            address
          });
          
        if (profileError) {
          console.error("Erro ao salvar perfil da empresa:", profileError);
        }
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
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="client-data" className="rounded-none" disabled={isLoading}>
            <div className="flex items-center gap-2">
              <div className={`rounded-full h-6 w-6 flex items-center justify-center ${
                activeTab === "client-data" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <User className="h-4 w-4" />
              </div>
              <span>Dados do Cliente</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="plan-selection" className="rounded-none" disabled={isLoading}>
            <div className="flex items-center gap-2">
              <div className={`rounded-full h-6 w-6 flex items-center justify-center ${
                activeTab === "plan-selection" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <Check className="h-4 w-4" />
              </div>
              <span>Escolha do Plano</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="payment-method" className="rounded-none" disabled={isLoading}>
            <div className="flex items-center gap-2">
              <div className={`rounded-full h-6 w-6 flex items-center justify-center ${
                activeTab === "payment-method" ? "bg-pump-purple text-white" : "bg-gray-200"
              }`}>
                <CreditCard className="h-4 w-4" />
              </div>
              <span>Pagamento</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="client-data" className="p-6">
          <ClientDataForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={setLastName}
            setLastName={setLastName}
            cpf={cpf}
            setCpf={setCpf}
            companyName={companyName}
            setCompanyName={setCompanyName}
            mainProducts={mainProducts}
            setMainProducts={setMainProducts}
            employeesCount={employeesCount}
            setEmployeesCount={setEmployeesCount}
            address={address}
            setAddress={setAddress}
            isLoading={isLoading}
          />
          <div className="flex justify-end mt-6">
            <Button 
              className="bg-pump-purple text-white"
              onClick={handleNextTab}
              disabled={isLoading}
            >
              Próximo: Escolha do Plano
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="plan-selection" className="p-6">
          <PlanSelectionForm 
            selectedPlanId={selectedPlanId} 
            setSelectedPlanId={setSelectedPlanId}
            isLoading={isLoading}
          />
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              className="text-pump-purple"
              onClick={handlePreviousTab}
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button 
              className="bg-pump-purple text-white"
              onClick={handleNextTab}
              disabled={isLoading || !selectedPlanId}
            >
              {selectedPlanId === 'free-plan' ? 'Finalizar Cadastro' : 'Próximo: Pagamento'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payment-method" className="p-6">
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
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              className="text-pump-purple"
              onClick={handlePreviousTab}
              disabled={isLoading}
            >
              Voltar
            </Button>
            <Button 
              className="bg-pump-purple text-white"
              onClick={handleSubmit}
              disabled={isLoading || (!cardNumber && selectedPlanId !== 'free-plan')}
            >
              Finalizar Cadastro
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center p-4 border-t">
        <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
        <Link to="/login">
          <Button
            variant="outline"
            className="text-pump-purple hover:bg-pump-purple/10"
            disabled={isLoading}
          >
            Fazer login
          </Button>
        </Link>
      </div>
    </Card>
  );
}
