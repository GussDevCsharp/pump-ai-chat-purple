
import { useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useChatSessions } from "./useChatSessions"
import { useToast } from "./use-toast"
import { supabase } from "@/integrations/supabase/client"

export const useSessionManagement = () => {
  const { sessions, refreshSessions, deleteSession, isLoading } = useChatSessions()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentSessionId = searchParams.get('session')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeletingSession, setIsDeletingSession] = useState(false)
  const { toast } = useToast()

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setNewTitle(currentTitle)
  }

  const handleOpenSession = (sessionId: string) => {
    navigate(`/chat?session=${sessionId}`)
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
      handleCloseDeleteDialog();
    }
  }

  const handleCloseDeleteDialog = () => {
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

  return {
    sessions,
    isLoading,
    editingId,
    newTitle,
    sessionToDelete,
    isDeletingSession,
    currentSessionId,
    setNewTitle,
    setEditingId,
    setSessionToDelete,
    startEditing,
    handleOpenSession,
    handleRename,
    handleDeleteConfirm,
    handleCloseDeleteDialog,
    handleKeyPress,
    refreshSessions
  }
}
