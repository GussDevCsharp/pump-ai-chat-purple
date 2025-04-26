
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useChatAuth } from "@/hooks/useChatAuth";
import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function UserCard() {
  const { authStatus, user, isLoading } = useChatAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 items-center rounded-lg bg-white p-3">
        <Avatar>
          <AvatarFallback>
            <UserRound className="w-6 h-6 text-pump-purple" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm text-gray-700">Carregando...</div>
        </div>
      </div>
    );
  }

  if (authStatus === "authenticated" && user) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg bg-white p-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar>
            <AvatarImage src={user.avatar_url ?? ""} />
            <AvatarFallback>
              <UserRound className="w-6 h-6 text-pump-purple" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">
              {user.email}
            </div>
            <span className="text-xs text-pump-gray">Usuário logado</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Anonymous
  return (
    <div className="flex gap-3 items-center rounded-lg bg-white p-3">
      <Avatar>
        <AvatarFallback>
          <LogOut className="w-6 h-6 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-sm text-gray-700">Visitante</div>
        <span className="text-xs text-pump-gray">Faça login para usar todos os recursos</span>
      </div>
    </div>
  );
}
