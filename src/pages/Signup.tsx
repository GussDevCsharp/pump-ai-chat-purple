
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Signup() {
  // Login info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Novos campos básicos de perfil
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");

  // Dados de pagamento
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    // Verificação dos campos obrigatórios
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !cpf ||
      !cardNumber ||
      !cardExpiry ||
      !cardCvc
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    // Cria o usuário no auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          cpf,
        },
      },
    });
    setIsLoading(false);
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
    <div className="min-h-screen bg-white flex flex-col px-4 py-12 w-full justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
              alt="Pump.ia"
              className="h-12 mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crie sua conta grátis
          </h2>
          <p className="mt-2 text-sm text-pump-gray">
            Cadastre-se para acessar todas as funcionalidades
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-5 bg-white rounded shadow px-6 py-8">
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1"
              disabled={isLoading}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1"
              disabled={isLoading}
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
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nome *
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Sobrenome *
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="mt-1"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF *
            </label>
            <Input
              id="cpf"
              name="cpf"
              type="text"
              required
              value={cpf}
              onChange={e => setCpf(e.target.value)}
              className="mt-1"
              disabled={isLoading}
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="pt-2">
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Dados de pagamento</h3>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Número do cartão *
              </label>
              <Input
                id="cardNumber"
                type="text"
                required
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="mt-1"
                disabled={isLoading}
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                  Validade *
                </label>
                <Input
                  id="cardExpiry"
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  disabled={isLoading}
                  maxLength={5}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700">
                  CVC *
                </label>
                <Input
                  id="cardCvc"
                  type="text"
                  required
                  value={cardCvc}
                  onChange={e => setCardCvc(e.target.value)}
                  disabled={isLoading}
                  maxLength={4}
                  placeholder="000"
                  inputMode="numeric"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-pump-purple text-white w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Cadastrar"}
          </Button>
        </form>
        <div className="text-center pt-4 border-t mt-10">
          <p className="text-sm text-gray-600 mb-2">Já tem uma conta?</p>
          <Link to="/login">
            <Button
              variant="outline"
              className="text-pump-purple hover:bg-pump-purple/10"
            >
              Fazer login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
