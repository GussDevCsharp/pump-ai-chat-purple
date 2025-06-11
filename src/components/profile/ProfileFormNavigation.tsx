
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface ProfileFormNavigationProps {
  activeStep: number;
  isLoading: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

export function ProfileFormNavigation({ 
  activeStep, 
  isLoading, 
  onPrevStep, 
  onNextStep, 
  onSubmit 
}: ProfileFormNavigationProps) {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        {activeStep === 0 
          ? "Você pode salvar seu progresso a qualquer momento e continuar depois"
          : "Finalize seu perfil para ter acesso completo à plataforma"
        }
      </div>
      
      <div className="flex justify-between pt-4">
        {activeStep === 0 ? (
          <>
            <Button 
              type="button"
              variant="outline"
              onClick={onSubmit}
              disabled={isLoading}
              className={isDark 
                ? "text-white dark:border-gray-700" 
                : "text-pump-gray border-gray-300"}
            >
              {isLoading ? "Salvando..." : "Salvar progresso"}
            </Button>
            
            <Button 
              type="button"
              onClick={onNextStep}
              className={isDark 
                ? "bg-pump-purple hover:bg-pump-purple/90 text-white" 
                : "bg-pump-purple hover:bg-pump-purple/90 text-white"}
            >
              Próximo
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="button"
              variant="outline"
              onClick={onPrevStep}
              className={isDark 
                ? "text-white dark:border-gray-700" 
                : "text-pump-gray border-gray-300"}
            >
              Voltar
            </Button>
            
            <Button 
              type="submit"
              className="bg-pump-purple hover:bg-pump-purple/90 text-white"
              disabled={isLoading}
              onClick={onSubmit}
            >
              {isLoading ? "Salvando..." : "Salvar perfil"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
