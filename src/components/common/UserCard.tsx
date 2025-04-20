
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useChatAuth } from "@/hooks/useChatAuth";
import { UserRound, LogIn } from "lucide-react";

export function UserCard() {
  const { authStatus, user, isLoading } = useChatAuth();

  if (isLoading) {
    return (
      <div className="flex gap-4 items-center rounded-lg bg-gray-50 px-4 py-2 mb-6 max-w-xs">
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
      <div className="flex gap-4 items-center rounded-lg bg-gray-50 px-4 py-2 mb-6 max-w-xs border border-pump-gray/10 shadow-sm">
        <Avatar>
          <AvatarImage src={user.avatar_url ?? ""} />
          <AvatarFallback>
            <UserRound className="w-6 h-6 text-pump-purple" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-sm text-gray-900">{user.email}</div>
          <span className="text-xs text-pump-gray">Usuário logado</span>
        </div>
      </div>
    );
  }

  // Anonymous
  return (
    <div className="flex gap-4 items-center rounded-lg bg-gray-50 px-4 py-2 mb-6 max-w-xs border border-gray-200">
      <Avatar>
        <AvatarFallback>
          <LogIn className="w-6 h-6 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-sm text-gray-700">Visitante</div>
        <span className="text-xs text-pump-gray">Faça login para usar todos os recursos</span>
      </div>
    </div>
  );
}
