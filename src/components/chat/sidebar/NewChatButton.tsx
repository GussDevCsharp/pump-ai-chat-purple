
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
      className={`p-2 ${isDark 
        ? 'hover:bg-pump-gray/10 text-white' 
        : 'hover:bg-gray-200 text-pump-gray border border-gray-300'} rounded-full transition-colors duration-200`}
    >
      <Plus className="w-5 h-5" />
    </button>
  )
}
