
import React from "react";
import { SignupLayout } from "@/components/SignupLayout";
import { SignupStepperFlow } from "@/components/SignupStepperFlow";

// Etapas do cadastro
const STEPS = [
  "Plano e Cadastro Básico",
  "Perfil da Empresa"
];

export default function Signup() {
  // Por simplicidade, o controle do stepper agora é feito dentro do SignupStepperFlow
  // A prop current recebe "0" apenas para manter o passo visual correto no SignupLayout (pode ser adaptado)
  return (
    <SignupLayout steps={STEPS} current={0}>
      <SignupStepperFlow />
    </SignupLayout>
  );
}
