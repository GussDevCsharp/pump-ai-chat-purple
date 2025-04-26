import { useState } from "react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ChevronLeft, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarSessionGroup } from "@/components/chat/sidebar/SidebarSessionGroup"
import { SidebarFooter } from "@/components/chat/sidebar/SidebarFooter"

export const ChatSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { sessions, createSession, refreshSessions, isLoading } = useChatSessions()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentSessionId = searchParams.get('session')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const { themes } = useChatThemes()
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Sessions in ChatSidebar:", sessions)
    console.log("Available themes:", themes)
  }, [sessions, themes])

  const handleNewChat = async () => {
    const session = await createSession("Nova conversa")
    if (session) {
      navigate(`/chat?session=${session.id}`)
      if (onClose) onClose()
    }
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setNewTitle(currentTitle)
  }

  const handleRename = async (id: string) => {
    try {
      if (!newTitle.trim()) {
        setEditingId(null)
        return
      }
      
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
      setEditingId(null)
    }
  }

  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      const isDeleted = await deleteSession(sessionToDelete)
      
      if (isDeleted && sessionToDelete === currentSessionId) {
        navigate('/chat')
      }
      
      setSessionToDelete(null)
      if (onClose) onClose()
    }
  }

  const getThemeObject = (themeId: string | null) => {
    if (!themeId) return null;
    return themes.find(t => t.id === themeId) || null;
  }

  const groupedSessions: Record<string, { themeObj: ChatTheme | null, sessions: typeof sessions }> = {};
  sessions.forEach(session => {
    const themeObj = getThemeObject(session.theme_id);
    const groupKey = themeObj ? themeObj.id : 'no-theme';
    if (!groupedSessions[groupKey]) {
      groupedSessions[groupKey] = { themeObj, sessions: [] };
    }
    groupedSessions[groupKey].sessions.push(session);
  });

  const handleCancelEdit = () => {
    setEditingId(null);
  }

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRename(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  }

  return (
    <div className={`w-64 max-w-full h-full md:h-screen bg-offwhite border-r border-pump-gray/20 transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
      {onClose && (
        <button
          type="button"
          className="md:hidden self-end mb-2 p-2 rounded hover:bg-pump-gray-light transition"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <span className="text-pump-purple text-2xl font-bold">&times;</span>
        </button>
      )}

      <div className="flex items-center gap-2 p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-pump-gray hover:text-pump-purple hover:bg-pump-gray-light"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          <span className="sr-only">Colapsar menu</span>
        </Button>
        
        <div className={`flex gap-2 ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-pump-gray hover:text-pump-purple hover:bg-pump-gray-light"
          >
            <Search className="w-5 h-5" />
            <span className="sr-only">Pesquisar conversas</span>
          </Button>

          <Button
            onClick={handleNewChat}
            variant="ghost"
            size="icon"
            className="text-pump-gray hover:text-pump-purple hover:bg-pump-gray-light"
          >
            <Plus className="w-5 h-5" />
            <span className="sr-only">Nova conversa</span>
          </Button>
        </div>
      </div>
      
      <div className={`mt-4 flex-1 overflow-y-auto ${isSidebarCollapsed ? 'hidden' : ''}`}>
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="text-sm text-pump-gray">Carregando conversas...</div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex justify-center items-center h-20">
            <div className="text-sm text-pump-gray">Nenhuma conversa encontrada</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(groupedSessions).map(([groupKey, { themeObj, sessions: themeSessions }]) => (
              <SidebarSessionGroup
                key={groupKey}
                groupId={groupKey}
                themeObj={themeObj}
                sessions={themeSessions}
                currentSessionId={currentSessionId}
                onOpen={(sessionId) => {
                  navigate(`/chat?session=${sessionId}`)
                  if (onClose) onClose()
                }}
                onEdit={startEditing}
                onDelete={setSessionToDelete}
                onThemeChange={refreshSessions}
                editingId={editingId}
                newTitle={newTitle}
                onTitleChange={(e) => setNewTitle(e.target.value)}
                onSaveEdit={handleRename}
                onCancelEdit={handleCancelEdit}
                onKeyPress={handleKeyPress}
              />
            ))}
          </div>
        )}
      </div>

      <div className={isSidebarCollapsed ? 'hidden' : ''}>
        <SidebarFooter />
      </div>
    </div>
  )
}
