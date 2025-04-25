
import { useNavigate } from "react-router-dom"
import { useToast } from "./use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useChatSessions } from "./useChatSessions"

export const useSessionOperations = () => {
  const { refreshSessions, deleteSession } = useChatSessions()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleOpenSession = (sessionId: string) => {
    navigate(`/chat?session=${sessionId}`)
  }

  const handleRename = async (id: string, newTitle: string, onSuccess: () => void) => {
    try {
      if (!newTitle.trim()) {
        onSuccess()
        return
      }
      
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title: newTitle })
        .eq('id', id)

      if (error) throw error

      onSuccess()
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
      onSuccess()
    }
  }

  const handleDeleteConfirm = async (sessionId: string | null, currentSessionId: string | null) => {
    if (!sessionId) return false
    
    try {
      const isCurrentSession = sessionId === currentSessionId
      const isDeleted = await deleteSession(sessionId)
      
      if (isDeleted && isCurrentSession) {
        navigate('/chat', { replace: true })
      }
      
      await refreshSessions()
      
      toast({
        description: "Conversa excluída com sucesso",
      })
      return true
    } catch (error) {
      console.error('Error deleting session:', error)
      toast({
        variant: "destructive",
        description: "Erro ao excluir a conversa",
      })
      return false
    }
  }

  return {
    handleOpenSession,
    handleRename,
    handleDeleteConfirm,
  }
}
