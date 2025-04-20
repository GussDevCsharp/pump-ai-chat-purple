import { MessageCircle, Plus, User, Settings, Pencil, Trash2 } from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
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

export const ChatSidebar = () => {
  const { sessions, createSession, refreshSessions, deleteSession } = useChatSessions()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
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

  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      await deleteSession(sessionToDelete)
      setSessionToDelete(null)
    }
  }

  const groupedSessions = sessions.reduce((groups, session) => {
    const theme = session.card_theme || 'Outras conversas'
    if (!groups[theme]) {
      groups[theme] = []
    }
    groups[theme].push(session)
    return groups
  }, {} as Record<string, typeof sessions>)

  return (
    <>
      <div className="w-64 h-screen bg-white border-r border-pump-gray/20 p-4 flex flex-col">
        <button 
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-pump-gray" />
          <span className="text-sm text-pump-gray font-medium">Nova conversa</span>
        </button>
        
        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {Object.entries(groupedSessions).map(([theme, themeSessions]) => (
              <div key={theme} className="space-y-2">
                <h3 className="text-xs font-medium text-pump-gray px-3">{theme}</h3>
                <div className="flex flex-col gap-2">
                  {themeSessions.map((session) => (
                    <div key={session.id} className="group relative">
                      {editingId === session.id ? (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-pump-gray-light">
                          <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(session.id)
                              if (e.key === 'Escape') setEditingId(null)
                            }}
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
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(session.id, session.title)
                              }}
                            >
                              <Pencil className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSessionToDelete(session.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-pump-gray hover:text-red-500" />
                            </button>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
