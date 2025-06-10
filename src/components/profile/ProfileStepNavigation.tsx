
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface ProfileStepNavigationProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export function ProfileStepNavigation({ activeStep, setActiveStep }: ProfileStepNavigationProps) {
  const { isDark } = useTheme();

  return (
    <div className="flex justify-between mb-8">
      <Button 
        variant={activeStep === 0 ? "default" : "outline"}
        className={activeStep === 0 
          ? "bg-pump-purple text-white dark:hover:bg-pump-purple/90" 
          : `${isDark ? "text-white" : "text-pump-gray border-gray-300"}`}
        onClick={() => setActiveStep(0)}
      >
        Perfil do Empresário
      </Button>
      
      <Button 
        variant={activeStep === 1 ? "default" : "outline"}
        className={activeStep === 1 
          ? "bg-pump-purple text-white dark:hover:bg-pump-purple/90" 
          : `${isDark ? "text-white" : "text-pump-gray border-gray-300"}`}
        onClick={() => setActiveStep(1)}
      >
        Perfil da Empresa
      </Button>
    </div>
  );
}
