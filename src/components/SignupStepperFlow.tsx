
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignupForm } from "./SignupForm";
import { SignupPlansStep } from "./SignupPlansStep";
import { SignupPaymentFields } from "./SignupPaymentFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[];
};

interface SignupStepperFlowProps {
  onStepChange: (step: number) => void;
}

export function SignupStepperFlow({ onStepChange }: SignupStepperFlowProps) {
  const [activeTab, setActiveTab] = useState("dados");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Efeito para buscar os planos no Supabase
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      console.log("Buscando planos...");

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

        const filteredPlans = plansWithBenefits.filter(plan => plan.chatpump === true);
        const finalPlans = filteredPlans.length > 0 ? filteredPlans : plansWithBenefits;

        setPlans(finalPlans);
        setSelectedPlan(finalPlans[0]);

        if (filteredPlans.length === 0 && plansWithBenefits.length > 0) {
          toast.warning("Usando todos os planos disponíveis", { duration: 5000 });
        }
      } else {
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

  // Efeito para atualizar o estado do passo baseado na aba ativa
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (!email || !password || !confirmPassword || !firstName || !lastName || !cpf) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    // Se for um plano pago, valida os campos de pagamento
    if (selectedPlan?.is_paid && (!cardNumber || !cardExpiry || !cardCvc)) {
      toast.error("Dados de pagamento são obrigatórios para planos pagos");
      setIsLoading(false);
      return;
    }

    try {
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            cpf: cpf,
            selected_plan: selectedPlan?.id
          },
        },
      });

      if (signupError) {
        if (signupError.message && signupError.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error(signupError.message || "Erro ao criar conta");
        }
        setIsLoading(false);
        return;
      }

      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica se os dados obrigatórios estão preenchidos para avançar
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
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha *
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nome *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Sobrenome *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                  CPF *
                </label>
                <input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                  disabled={isLoading}
                  required
                  maxLength={14}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-4">Dados de Pagamento</h3>
            
            {selectedPlan?.is_paid ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Número do Cartão *
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                    disabled={isLoading}
                    required
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                      Data de Validade *
                    </label>
                    <input
                      id="cardExpiry"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                      disabled={isLoading}
                      required
                      maxLength={5}
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
                      CVC *
                    </label>
                    <input
                      id="cardCvc"
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pump-purple focus:outline-none focus:ring-1 focus:ring-pump-purple"
                      disabled={isLoading}
                      required
                      maxLength={4}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
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
