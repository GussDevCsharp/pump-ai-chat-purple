
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";
import NeuralBackground from "@/components/effects/NeuralBackground";

const STEPS = [
  "Dados Pessoais",
  "Escolha do Plano",
  "Pagamento"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="relative min-h-screen bg-offwhite">
      <NeuralBackground />
      <div className="relative z-10 flex flex-col justify-center items-center px-4 py-8 w-full min-h-screen">
        <div className="max-w-3xl w-full mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-pump-purple mb-3 animate-fade-in">
              Crie sua conta
            </h1>
            <p className="text-pump-gray text-lg animate-fade-in delay-100">
              Comece sua jornada conosco
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in delay-200">
            <SignupLayout steps={STEPS} current={currentStep}>
              <SignupStepperFlow onStepChange={setCurrentStep} />
            </SignupLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
