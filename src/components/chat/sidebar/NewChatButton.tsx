
import { Plus } from "lucide-react"

interface NewChatButtonProps {
  onClick: () => void
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="p-2 hover:bg-pump-purple/10 rounded-full"
    >
      <Plus className="w-5 h-5 text-pump-purple" />
    </button>
  )
}
