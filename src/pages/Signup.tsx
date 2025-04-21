
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignupForm } from "@/components/SignupForm";

export default function Signup() {
  // State compartilhado
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
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardExpiry={cardExpiry}
          setCardExpiry={setCardExpiry}
          cardCvc={cardCvc}
          setCardCvc={setCardCvc}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
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
