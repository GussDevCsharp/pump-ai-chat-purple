
import React from "react";
import { SignupForm } from "@/components/SignupForm";
import NeuralBackground from "@/components/effects/NeuralBackground";

export default function Signup() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="w-full max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-4 sm:mb-8 animate-fade-in">
            <img
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png"
              alt="Pump.ia"
              className="h-8 sm:h-12 mx-auto"
            />
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
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
