
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";
import { Header } from "@/components/common/Header";

const STEPS = [
  "Dados Pessoais",
  "Escolha do Plano",
  "Pagamento"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite to-pump-gray-light">
      <Header />
      <div className="flex flex-col justify-center items-center px-4 py-8 w-full min-h-[calc(100vh-80px)]">
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
