
import { Plus } from "lucide-react";
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
    <button 
      onClick={handleNewChat}
      className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors"
    >
      <Plus className="w-4 h-4 text-pump-gray" />
      <span className="text-sm text-pump-gray font-medium">Nova conversa</span>
    </button>
  );
}
