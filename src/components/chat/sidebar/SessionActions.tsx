
import { Plus, Search } from "lucide-react";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useNavigate } from "react-router-dom";

interface SessionActionsProps {
  onClose?: () => void;
}

export function SessionActions({ onClose }: SessionActionsProps) {
  const { createSession } = useChatSessions();
  const navigate = useNavigate();

  const handleNewChat = async () => {
    const session = await createSession("Nova conversa");
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
      <button 
        onClick={handleNewChat}
        className="p-2 hover:bg-pump-gray-light rounded-lg transition-colors"
        aria-label="Nova conversa"
      >
        <Plus className="w-5 h-5 text-pump-gray" />
      </button>
    </div>
  );
}
