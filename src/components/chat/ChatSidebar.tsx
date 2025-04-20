
import { MessageCircle, Plus } from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const ChatSidebar = () => {
  const { sessions, createSession } = useChatSessions()
  const navigate = useNavigate()

  const handleNewChat = async () => {
    const session = await createSession("New Chat")
    if (session) {
      navigate(`/chat?session=${session.id}`)
    }
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-pump-gray/20 p-4 flex flex-col">
      <button 
        onClick={handleNewChat}
        className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors"
      >
        <Plus className="w-4 h-4 text-pump-gray" />
        <span className="text-sm text-pump-gray font-medium">Novo chat</span>
      </button>
      
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => navigate(`/chat?session=${session.id}`)}
              className="flex items-center gap-2 p-3 hover:bg-pump-gray-light rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-pump-gray" />
              <span className="text-sm text-pump-gray font-medium truncate">
                {session.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User Menu */}
      <div className="border-t border-pump-gray/20 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pump-purple/10 flex items-center justify-center">
              <User className="w-4 h-4 text-pump-purple" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Usuário</span>
              <span className="text-xs text-pump-gray">Empresa</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-pump-gray hover:text-pump-purple">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
