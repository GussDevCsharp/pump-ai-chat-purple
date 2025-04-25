
import { useSearchParams } from "react-router-dom"
import { useChatSessions } from "./useChatSessions"
import { useSessionDialog } from "./useSessionDialog"
import { useSessionOperations } from "./useSessionOperations"

export const useSessionManagement = () => {
  const { sessions, isLoading, refreshSessions } = useChatSessions()
  const [searchParams] = useSearchParams()
  const currentSessionId = searchParams.get('session')
  
  const {
    editingId,
    newTitle,
    sessionToDelete,
    isDeletingSession,
    setNewTitle,
    setEditingId,
    setSessionToDelete,
    setIsDeletingSession,
    startEditing,
    resetDialogStates
  } = useSessionDialog()

  const {
    handleOpenSession,
    handleRename,
    handleDeleteConfirm
  } = useSessionOperations()

  const handleCloseDeleteDialog = () => {
    resetDialogStates()
  }

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRename(id, newTitle, () => setEditingId(null))
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
    handleRename: (id: string) => handleRename(id, newTitle, () => setEditingId(null)),
    handleDeleteConfirm: async () => {
      setIsDeletingSession(true)
      const success = await handleDeleteConfirm(sessionToDelete, currentSessionId)
      if (success) {
        handleCloseDeleteDialog()
      }
      setIsDeletingSession(false)
    },
    handleCloseDeleteDialog,
    handleKeyPress,
    refreshSessions
  }
}
