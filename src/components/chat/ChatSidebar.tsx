
import { MessageCircle, Plus, User, Settings, Pencil } from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export const ChatSidebar = () => {
  const { sessions, createSession, refreshSessions } = useChatSessions()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const { toast } = useToast()

  const handleNewChat = async () => {
    const session = await createSession("Nova conversa")
    if (session) {
      navigate(`/chat?session=${session.id}`)
    }
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setNewTitle(currentTitle)
  }

  const handleRename = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle })
        .eq('id', id)

      if (error) throw error

      setEditingId(null)
      refreshSessions()
      
      toast({
        description: "Conversa renomeada com sucesso",
      })
    } catch (error) {
      console.error('Error renaming session:', error)
      toast({
        variant: "destructive",
        description: "Erro ao renomear a conversa",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRename(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-pump-gray/20 p-4 flex flex-col">
      <button 
        onClick={handleNewChat}
        className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors"
      >
        <Plus className="w-4 h-4 text-pump-gray" />
        <span className="text-sm text-pump-gray font-medium">Nova conversa</span>
      </button>
      
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <div key={session.id} className="group relative">
              {editingId === session.id ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-pump-gray-light">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, session.id)}
                    onBlur={() => handleRename(session.id)}
                    autoFocus
                    className="text-sm"
                  />
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/chat?session=${session.id}`)}
                  className="flex items-center gap-2 p-3 w-full hover:bg-pump-gray-light rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-pump-gray" />
                  <span className="text-sm text-pump-gray font-medium truncate flex-1 text-left">
                    {session.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(session.id, session.title)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
                  </button>
                </button>
              )}
            </div>
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
