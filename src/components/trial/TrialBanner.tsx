
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Crown, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrialManagement } from "@/hooks/useTrialManagement";

export const TrialBanner = () => {
  const { trialStatus, isLoading } = useTrialManagement();

  if (isLoading) return null;

  // Se não está em trial ou trial expirado, não mostrar banner
  if (!trialStatus.isTrialActive && !trialStatus.isTrialExpired) return null;

  if (trialStatus.isTrialExpired) {
    return (
      <Alert className="border-red-200 bg-red-50 mb-4">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-red-800 font-medium">
              Seu trial expirou. Assine um plano para continuar usando a plataforma.
            </span>
          </div>
          <Link to="/subscription">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <Crown className="w-4 h-4 mr-1" />
              Assinar Agora
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  if (trialStatus.isTrialActive) {
    const isUrgent = trialStatus.daysRemaining <= 3;
    
    return (
      <Alert className={`${isUrgent ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'} mb-4`}>
        <Clock className={`h-4 w-4 ${isUrgent ? 'text-orange-600' : 'text-blue-600'}`} />
        <AlertDescription className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Badge variant={isUrgent ? "destructive" : "secondary"}>
              Trial
            </Badge>
            <span className={`${isUrgent ? 'text-orange-800' : 'text-blue-800'} font-medium`}>
              {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'dia restante' : 'dias restantes'} no seu trial gratuito
            </span>
          </div>
          <Link to="/subscription">
            <Button size="sm" variant={isUrgent ? "default" : "outline"}>
              <Crown className="w-4 h-4 mr-1" />
              Ver Planos
            </Button>
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
