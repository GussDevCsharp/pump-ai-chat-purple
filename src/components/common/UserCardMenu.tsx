
import { useChatAuth } from "@/hooks/useChatAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserCardMenu() {
  const { authStatus, user, isLoading } = useChatAuth();

  // Handler de logout provisório
  const handleLogout = () => {
    // É esperado que haja integração com Supabase, mas pode ser ajustado conforme necessidade
    if (window.confirm("Tem certeza que deseja sair?")) {
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 items-center bg-gray-50 rounded-lg px-3 py-2 border border-pump-gray/10 min-w-[180px] justify-end">
        <Avatar>
          <AvatarFallback>
            <UserRound className="w-6 h-6 text-pump-purple" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-pump-gray">Carregando...</span>
      </div>
    );
  }

  return (
    // Removido o fixed e posicionamento absoluto para ficar no fluxo normal
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 focus-visible:ring-0 bg-white hover:bg-gray-100 rounded-full h-auto flex items-center gap-2"
        >
          <Avatar className="h-9 w-9">
            {user && user.avatar_url ? (
              <AvatarImage src={user.avatar_url} />
            ) : (
              <AvatarFallback>
                <UserRound className="w-5 h-5 text-pump-purple" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="hidden md:flex flex-col text-left max-w-[125px]">
            <span className="text-xs font-semibold text-gray-900 truncate">
              {user?.email || "Visitante"}
            </span>
            <span className="text-[10px] text-pump-gray">
              {authStatus === "authenticated" ? "Usuário logado" : "Visitante"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
