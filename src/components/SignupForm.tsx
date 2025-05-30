
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
  hidePayment?: boolean;
  // These props are optional when hidePayment is true
  firstName?: string;
  setFirstName?: (val: string) => void;
  lastName?: string;
  setLastName?: (val: string) => void;
  cpf?: string;
  setCpf?: (val: string) => void;
  cardNumber?: string;
  setCardNumber?: (val: string) => void;
  cardExpiry?: string;
  setCardExpiry?: (val: string) => void;
  cardCvc?: string;
  setCardCvc?: (val: string) => void;
}

export function SignupForm(props: SignupFormProps) {
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    // Modified validation to account for optional fields
    const needsProfileFields = !props.hidePayment;
    const needsPaymentFields = !props.hidePayment;

    if (!props.email || !props.password || !props.confirmPassword) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (needsProfileFields && (!props.firstName || !props.lastName || !props.cpf)) {
      toast.error("Preencha todos os campos de perfil");
      return;
    }

    if (needsPaymentFields && (!props.cardNumber || !props.cardExpiry || !props.cardCvc)) {
      toast.error("Preencha todos os campos de pagamento");
      return;
    }

    if (props.password !== props.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    props.setIsLoading(true);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: props.email,
      password: props.password,
      options: {
        data: {
          first_name: props.firstName || "",
          last_name: props.lastName || "",
          cpf: props.cpf || "",
        },
      },
    });

    props.setIsLoading(false);

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

    toast.success("Cadastro realizado! Verifique seu email.");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <form className="space-y-5 bg-white rounded shadow px-6 py-8">
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
      {!props.hidePayment && props.firstName !== undefined && props.lastName !== undefined && props.cpf !== undefined && (
        <SignupProfileFields
          firstName={props.firstName}
          lastName={props.lastName}
          cpf={props.cpf}
          setFirstName={props.setFirstName!}
          setLastName={props.setLastName!}
          setCpf={props.setCpf!}
          disabled={props.isLoading}
        />
      )}
      {!props.hidePayment && props.cardNumber !== undefined && props.cardExpiry !== undefined && props.cardCvc !== undefined && (
        <SignupPaymentFields
          cardNumber={props.cardNumber}
          cardExpiry={props.cardExpiry}
          cardCvc={props.cardCvc}
          setCardNumber={props.setCardNumber!}
          setCardExpiry={props.setCardExpiry!}
          setCardCvc={props.setCardCvc!}
          disabled={props.isLoading}
        />
      )}
    </form>
  );
}
