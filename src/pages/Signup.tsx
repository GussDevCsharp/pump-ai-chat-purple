
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";
import NeuralBackground from "@/components/effects/NeuralBackground";
import { GoogleButton } from "@/components/auth/GoogleButton";

const STEPS = [
  "Dados Pessoais",
  "Finalizar"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="relative min-h-screen bg-white">
      <NeuralBackground />
      <div className="relative z-10 flex flex-col justify-center items-center px-4 py-6 md:py-8 w-full min-h-screen">
        <div className="max-w-3xl w-full mx-auto">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-pump-purple mb-3 animate-fade-in">
              Crie sua conta gratuitamente
            </h1>
            <p className="text-pump-gray text-base md:text-lg animate-fade-in delay-100">
              Acesso completo à plataforma em versão Beta
            </p>
          </div>

          <div className="max-w-md mx-auto mb-6 md:mb-8 animate-fade-in delay-150">
            <GoogleButton />
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  ou preencha o formulário abaixo
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 animate-fade-in delay-200">
            <SignupLayout steps={STEPS} current={currentStep}>
              <SignupStepperFlow onStepChange={setCurrentStep} />
            </SignupLayout>
          </div>
        </div>
      </div>
    </div>
  )
}
