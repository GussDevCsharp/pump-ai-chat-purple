
import React from "react";
import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  activeTab: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void; // This expects a function with no parameters
  isLastStep?: boolean;
  isLoading: boolean;
  selectedPlanId: string | null;
}

export function FormNavigation({
  activeTab,
  onPrevious,
  onNext,
  onSubmit,
  isLastStep,
  isLoading,
  selectedPlanId
}: FormNavigationProps) {
  return (
    <div className="flex justify-between">
      {activeTab !== "client-data" && (
        <Button
          variant="outline"
          className="border-pump-purple text-pump-purple hover:bg-pump-purple/10 transition-all duration-300"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Voltar
        </Button>
      )}
      
      {!isLastStep ? (
        <Button
          className="bg-pump-purple hover:bg-pump-purple/90 text-white transition-all duration-300"
          onClick={onNext}
          disabled={isLoading || (activeTab === "plan-selection" && !selectedPlanId)}
        >
          {activeTab === "client-data" && "Próximo: Escolha do Plano"}
          {activeTab === "plan-selection" && selectedPlanId === 'free-plan' && "Finalizar Cadastro"}
          {activeTab === "plan-selection" && selectedPlanId !== 'free-plan' && "Próximo: Pagamento"}
        </Button>
      ) : (
        <Button
          className="bg-pump-purple hover:bg-pump-purple/90 text-white transition-all duration-300"
          onClick={onSubmit}
          disabled={isLoading}
        >
          Finalizar Cadastro
        </Button>
      )}
    </div>
  );
}
