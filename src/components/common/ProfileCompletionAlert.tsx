
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProfileNavigation } from '@/hooks/useProfileNavigation';

export const ProfileCompletionAlert = () => {
  const navigate = useNavigate();
  const { isProfileComplete, isLoading } = useProfileNavigation();

  if (isLoading || isProfileComplete !== false) {
    return null;
  }

  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-700">Perfil incompleto</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-amber-600">
          Complete seu perfil para obter respostas mais personalizadas.
        </span>
        <Button 
          onClick={() => navigate('/profile-complete')}
          variant="outline"
          className="border-amber-500 hover:bg-amber-100 text-amber-700"
        >
          Completar perfil
        </Button>
      </AlertDescription>
    </Alert>
  );
};
