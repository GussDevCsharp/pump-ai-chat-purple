
import React from "react";
import { SignupForm } from "@/components/SignupForm";
import NeuralBackground from "@/components/effects/NeuralBackground";

export default function Signup() {
  return (
    <div className="min-h-screen flex">
      {/* Form Column */}
      <div className="w-1/2 bg-offwhite flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8 animate-fade-in">
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

      {/* Gradient Separator */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] flex items-center">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-[#7E1CC6]/30 to-transparent" />
      </div>

      {/* Effect Column */}
      <div className="w-1/2 bg-offwhite relative overflow-hidden">
        <NeuralBackground />
        <div className="relative z-[5] flex items-center justify-center h-full">
          <h1 className="text-5xl font-bold text-pump-purple text-center leading-tight max-w-lg">
            A Nova inteligência da sua empresa
          </h1>
        </div>
      </div>
    </div>
  );
}
