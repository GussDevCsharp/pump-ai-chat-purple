
import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { SessionActions } from "./sidebar/SessionActions"
import { DeleteSessionDialog } from "./sidebar/DeleteSessionDialog"
import { SidebarSessionGroup } from "./sidebar/SidebarSessionGroup"
import { SidebarFooter } from "./sidebar/SidebarFooter"

export const ChatSidebar = ({ onClose }: { onClose?: () => void }) => {
  const { sessions, refreshSessions, deleteSession, isLoading } = useChatSessions()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentSessionId = searchParams.get('session')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeletingSession, setIsDeletingSession] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      setEditingId(null);
    };
  }, []);

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setNewTitle(currentTitle)
  }

  const handleOpenSession = (sessionId: string) => {
    navigate(`/chat?session=${sessionId}`)
    if (onClose) onClose()
  }

  const handleThemeChange = () => {
    refreshSessions()
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
    if (!sessionToDelete || isDeletingSession) return;
    
    setIsDeletingSession(true);
    
    try {
      const isCurrentSession = sessionToDelete === currentSessionId;
      const isDeleted = await deleteSession(sessionToDelete);
      
      if (isDeleted && isCurrentSession) {
        // Use replace for smoother navigation without adding to history
        navigate('/chat', { replace: true });
      }
      
      await refreshSessions();
      
      toast({
        description: "Conversa excluída com sucesso",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        variant: "destructive",
        description: "Erro ao excluir a conversa",
      });
    } finally {
      // Clear delete states
      handleCloseDeleteDialog();
    }
  }

  const handleCloseDeleteDialog = () => {
    // Use a small timeout to ensure React has time to process state updates
    setTimeout(() => {
      setSessionToDelete(null);
      setIsDeletingSession(false);
    }, 10);
  }

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRename(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  // Group sessions by theme for display
  const groupedSessions = sessions.reduce((acc: Record<string, any[]>, session) => {
    const themeId = session.theme_id || 'default';
    if (!acc[themeId]) {
      acc[themeId] = [];
    }
    acc[themeId].push(session);
    return acc;
  }, {});

  return (
    <>
      <div className="w-64 max-w-full h-full md:h-screen bg-offwhite border-r border-pump-gray/20 p-4 flex flex-col">
        {onClose && (
          <button
            type="button"
            className="md:hidden self-end mb-2 p-2 rounded hover:bg-pump-gray-light transition"
            onClick={() => {
              setEditingId(null);
              onClose?.();
            }}
            aria-label="Fechar menu"
          >
            <span className="text-pump-purple text-2xl font-bold">&times;</span>
          </button>
        )}

        <SessionActions onClose={onClose} />
        
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
              {Object.entries(groupedSessions).map(([themeId, themeSessions]) => {
                // Find theme object from the first session in the group
                const themeObj = themeSessions[0]?.theme_id ? {
                  id: themeSessions[0]?.theme_id,
                  name: themeSessions[0]?.card_theme || 'Sem tema',
                  color: themeSessions[0]?.card_theme ? '#7E1CC6' : null
                } : {
                  id: 'default',
                  name: 'Sem tema',
                  color: null
                };
                
                return (
                  <SidebarSessionGroup
                    key={themeId}
                    groupId={themeId}
                    themeObj={themeObj}
                    sessions={themeSessions}
                    currentSessionId={currentSessionId}
                    onOpen={handleOpenSession}
                    onEdit={startEditing}
                    onDelete={setSessionToDelete}
                    onThemeChange={handleThemeChange}
                    editingId={editingId}
                    newTitle={newTitle}
                    onTitleChange={(e) => setNewTitle(e.target.value)}
                    onSaveEdit={handleRename}
                    onCancelEdit={() => setEditingId(null)}
                    onKeyPress={handleKeyPress}
                  />
                );
              })}
            </div>
          )}
        </div>

        <SidebarFooter />
      </div>

      <DeleteSessionDialog
        isOpen={!!sessionToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
