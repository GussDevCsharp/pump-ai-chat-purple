
import { useState } from 'react'

export const useSessionDialog = () => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeletingSession, setIsDeletingSession] = useState(false)

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id)
    setNewTitle(currentTitle)
  }

  const resetDialogStates = () => {
    setEditingId(null)
    setSessionToDelete(null)
    setIsDeletingSession(false)
  }

  return {
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
  }
}
