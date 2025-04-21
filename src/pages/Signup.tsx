
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";
import { useState } from "react";

// Etapas do cadastro
const STEPS = [
  "Escolha do Plano",
  "Cadastro Básico",
  "Perfil da Empresa",
  "Perfil do Usuário"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <SignupLayout steps={STEPS} current={currentStep}>
      <SignupStepperFlow />
    </SignupLayout>
  );
}
