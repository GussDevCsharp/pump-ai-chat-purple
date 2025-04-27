
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { lazy, Suspense } from "react";

const GoogleIcon = lazy(dynamicIconImports['google']);

export function GoogleButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/themes`
      }
    });

    if (error) {
      console.error('Erro ao fazer login com Google:', error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="w-full border-gray-300 hover:bg-gray-50"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleIcon className="mr-2 h-4 w-4" />
      </Suspense>
      Continuar com Google
    </Button>
  );
}
