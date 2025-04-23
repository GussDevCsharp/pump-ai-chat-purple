import { MessageCircle, Plus, Pencil, Trash2, UserRound, Settings } from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { Button } from "@/components/ui/button"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ThemeSelect } from "@/components/chat/ThemeSelect"
import { useChatThemes, ChatTheme } from "@/hooks/useChatThemes"

export const ChatSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { sessions, createSession, refreshSessions, deleteSession, isLoading } = useChatSessions()
  const { themes } = useChatThemes()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentSessionId = searchParams.get('session')
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

  return (
    <>
      <div className="w-64 max-w-full h-full md:h-screen bg-offwhite border-r border-pump-gray/20 p-4 flex flex-col">
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

        <button 
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-pump-gray" />
          <span className="text-sm text-pump-gray font-medium">Nova conversa</span>
        </button>
        
        <div className="mt-4 flex-1 overflow-y-auto">
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
                <div key={groupKey} className="space-y-2">
                  <h3 className="flex items-center text-xs font-medium text-pump-gray px-3">
                      {themeObj && themeObj.color && (
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2 border border-pump-gray/30"
                          style={{ backgroundColor: themeObj.color }}
                        />
                      )}
                      <span style={themeObj?.color ? { color: themeObj.color } : {}}>
                        {themeObj ? themeObj.name : "Sem tema"}
                      </span>
                    </h3>
                  {themeSessions.map((session) => (
                    <div key={session.id} className="group relative">
                      <button
                        onClick={() => {
                          navigate(`/chat?session=${session.id}`)
                          if (onClose) onClose()
                        }}
                        className={`
                          relative flex items-center justify-between gap-3 px-4 py-3 w-full
                          bg-white border-2 border-pump-gray/10 rounded-2xl shadow-md
                          transition-all duration-200
                          hover:scale-105 hover:shadow-xl 
                          group/card min-h-[80px]
                        `}
                        style={{
                          borderColor: themeObj?.color || "#e9e3fc",
                          boxShadow: "0 8px 18px 0 rgba(54,40,90,0.06)"
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="flex items-center justify-center w-10 h-10 rounded-full"
                            style={{
                              background: themeObj?.color ? `${themeObj.color}20` : "#f4ebfd"
                            }}
                          >
                            <MessageCircle
                              className="w-6 h-6"
                              style={{ color: themeObj?.color || "#7E1CC6" }}
                            />
                          </span>
                          <span className="text-sm text-pump-gray font-medium truncate">
                            {session.title}
                          </span>
                        </div>
                        
                        <div className="
                          absolute bottom-2 right-2
                          opacity-0 group-hover/card:opacity-100 
                          transition-opacity 
                          flex items-center gap-1
                        ">
                          <ThemeSelect 
                            sessionId={session.id} 
                            currentTheme={session.theme_id}
                            onThemeChange={refreshSessions}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditing(session.id, session.title)
                            }}
                            className="rounded hover:bg-pump-gray-light p-1"
                          >
                            <Pencil className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSessionToDelete(session.id)
                            }}
                            className="rounded hover:bg-red-50 p-1"
                          >
                            <Trash2 className="w-4 h-4 text-pump-gray hover:text-red-500" />
                          </button>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-pump-gray/20 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pump-purple/10 flex items-center justify-center">
                <UserRound className="w-4 h-4 text-pump-purple" />
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

      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
