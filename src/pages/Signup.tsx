
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";
import { Header } from "@/components/common/Header";

// Etapas do cadastro
const STEPS = [
  "Dados Pessoais",
  "Escolha do Plano",
  "Pagamento"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = React.useState(0);

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <div className="flex flex-col justify-center items-center px-4 w-full min-h-[calc(100vh-80px)]">
        <div className="max-w-3xl w-full mx-auto">
          <SignupLayout steps={STEPS} current={currentStep}>
            <SignupStepperFlow onStepChange={setCurrentStep} />
          </SignupLayout>
        </div>
      </div>
    </div>
  );
}
