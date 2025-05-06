
import { Plus } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

interface NewChatButtonProps {
  onClick: () => void
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  const { isDark } = useTheme();
  
  return (
    <button 
      onClick={onClick}
      className={`p-2 card-glassmorphism ${isDark 
        ? 'text-white' 
        : 'text-pump-gray'} rounded-full transition-all duration-200`}
    >
      <Plus className="w-5 h-5" />
    </button>
  )
}
