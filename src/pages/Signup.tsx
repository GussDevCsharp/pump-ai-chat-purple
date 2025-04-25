
import React from "react";
import { Header } from "@/components/common/Header";
import { SignupForm } from "@/components/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="flex flex-col justify-center items-center px-4 w-full min-h-[calc(100vh-80px)]">
        <div className="max-w-4xl w-full mx-auto py-8">
          <div className="text-center mb-8">
            <img
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
              alt="Pump.ia"
              className="h-12 mx-auto"
            />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Crie sua conta grátis
            </h2>
            <p className="mt-2 text-sm text-pump-gray">
              Cadastre-se para acessar todas as funcionalidades
            </p>
          </div>
          
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
