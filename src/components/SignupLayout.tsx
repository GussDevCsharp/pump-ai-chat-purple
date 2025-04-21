
import React from "react";
import { Link } from "react-router-dom";
import { SignupStepper } from "./SignupStepper";
import { Button } from "@/components/ui/button";

interface SignupLayoutProps {
  children: React.ReactNode;
  steps: string[];
  current: number;
}

export function SignupLayout({ children, steps, current }: SignupLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-12 w-full justify-center items-center">
      <div className="max-w-5xl w-full mx-auto">
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
        <SignupStepper steps={steps} current={current} />
        <div>{children}</div>
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
