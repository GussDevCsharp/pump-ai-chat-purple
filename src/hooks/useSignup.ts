
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plan } from "@/types/signup";

export const useSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const validateCard = () => {
    // Validação básica do cartão
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      return "Número do cartão inválido";
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      return "Data de validade inválida (MM/AA)";
    }

    if (cardCvc.length < 3 || cardCvc.length > 4) {
      return "CVC inválido";
    }

    return null;
  };

  const handleSignup = async (selectedPlan: Plan | null) => {
    if (!email || !password || !confirmPassword || !firstName || !lastName || !cpf) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Dados do cartão são obrigatórios para iniciar o trial");
      return;
    }

    const cardError = validateCard();
    if (cardError) {
      toast.error(cardError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      // Primeiro validar o cartão no Stripe sem cobrança
      const { data: cardValidation, error: cardError } = await supabase.functions.invoke('validate-trial-card', {
        body: { 
          email,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardExpiry,
          cardCvc
        }
      });

      if (cardError || !cardValidation.success) {
        toast.error(cardValidation?.error || "Erro ao validar cartão");
        return;
      }

      // Criar a conta do usuário
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            cpf: cpf,
            selected_plan: selectedPlan?.id || 'trial',
            trial_start: new Date().toISOString(),
            stripe_customer_id: cardValidation.customer_id
          },
        },
      });

      if (signupError) {
        if (signupError.message && signupError.message.includes("already registered")) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error(signupError.message || "Erro ao criar conta");
        }
        return;
      }

      // Aguardar um pouco para garantir que o usuário foi criado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar registro de trial na tabela subscribers
      if (signupData.user) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 14);

        const { error: subscriberError } = await supabase
          .from('subscribers')
          .insert({
            user_id: signupData.user.id,
            email: email,
            subscribed: false,
            subscription_tier: 'trial',
            subscription_end: trialEndDate.toISOString(),
            stripe_customer_id: cardValidation.customer_id
          });

        if (subscriberError) {
          console.error('Erro ao criar trial:', subscriberError);
          // Não bloquear o cadastro por causa disso
        }
      }

      toast.success("Cadastro realizado com sucesso! Trial de 14 dias ativado. Seu cartão será cobrado apenas após o período de trial. Verifique seu email para confirmar sua conta.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
