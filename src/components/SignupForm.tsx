
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SignupProfileFields } from "./SignupProfileFields";
import { SignupPaymentFields } from "./SignupPaymentFields";

interface SignupFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  cpf: string;
  setCpf: (val: string) => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvc: string;
  setCardCvc: (val: string) => void;
}

export function SignupForm(props: SignupFormProps) {
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!props.email || !props.password || !props.confirmPassword) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!props.firstName || !props.lastName || !props.cpf) {
      toast.error("Preencha todos os campos de perfil");
      return;
    }

    if (!props.cardNumber || !props.cardExpiry || !props.cardCvc) {
      toast.error("Dados do cartão são obrigatórios para iniciar o trial");
      return;
    }

    if (props.password !== props.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    props.setIsLoading(true);

    try {
      // Primeiro validar o cartão no Stripe
      const { data: cardValidation, error: cardError } = await supabase.functions.invoke('validate-trial-card', {
        body: { 
          email: props.email,
          cardNumber: props.cardNumber.replace(/\s/g, ''),
          cardExpiry: props.cardExpiry,
          cardCvc: props.cardCvc
        }
      });

      if (cardError || !cardValidation.success) {
        toast.error(cardValidation?.error || "Erro ao validar cartão");
        return;
      }

      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: props.email,
        password: props.password,
        options: {
          data: {
            first_name: props.firstName,
            last_name: props.lastName,
            cpf: props.cpf,
            stripe_customer_id: cardValidation.customer_id
          },
        },
      });

      if (signupError) {
        if (
          signupError.message &&
          signupError.message.includes("already registered")
        ) {
          toast.error("Este e-mail já está cadastrado");
        } else {
          toast.error(signupError.message || "Erro ao criar conta");
        }
        return;
      }

      toast.success("Cadastro realizado! Trial de 14 dias ativado. Verifique seu email.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      props.setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5 bg-white rounded shadow px-6 py-8" onSubmit={handleSignup}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={props.email}
          onChange={e => props.setEmail(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha *
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={props.password}
          onChange={e => props.setPassword(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirmar senha *
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={props.confirmPassword}
          onChange={e => props.setConfirmPassword(e.target.value)}
          className="mt-1"
          disabled={props.isLoading}
        />
      </div>

      <SignupProfileFields
        firstName={props.firstName}
        lastName={props.lastName}
        cpf={props.cpf}
        setFirstName={props.setFirstName}
        setLastName={props.setLastName}
        setCpf={props.setCpf}
        disabled={props.isLoading}
      />

      <SignupPaymentFields
        cardNumber={props.cardNumber}
        cardExpiry={props.cardExpiry}
        cardCvc={props.cardCvc}
        setCardNumber={props.setCardNumber}
        setCardExpiry={props.setCardExpiry}
        setCpf={props.setCardCvc}
        disabled={props.isLoading}
      />

      <Button
        type="submit"
        disabled={props.isLoading}
        className="w-full bg-pump-purple hover:bg-pump-purple/90"
      >
        {props.isLoading ? "Validando cartão..." : "Iniciar Trial Gratuito"}
      </Button>
    </form>
  );
}
