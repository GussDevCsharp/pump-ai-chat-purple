
import { Plus, Search } from "lucide-react";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SessionActionsProps {
  onClose?: () => void;
}

export function SessionActions({ onClose }: SessionActionsProps) {
  const { createSession } = useChatSessions();
  const navigate = useNavigate();

  const handleNewChat = async (title: string) => {
    const session = await createSession(title);
    if (session) {
      navigate(`/chat?session=${session.id}`);
      if (onClose) onClose();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button 
        onClick={() => {}} // Search functionality to be implemented
        className="p-2 hover:bg-pump-gray-light rounded-lg transition-colors"
        aria-label="Buscar conversas"
      >
        <Search className="w-5 h-5 text-pump-gray" />
      </button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="p-2 hover:bg-pump-gray-light rounded-lg transition-colors"
            aria-label="Nova conversa"
          >
            <Plus className="w-5 h-5 text-pump-gray" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => handleNewChat("Nova conversa")}>
            Nova conversa
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleNewChat("Brainstorm")}>
            Brainstorm
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleNewChat("Planejamento")}>
            Planejamento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
