
import { useEffect } from "react"
import { SessionActions } from "./sidebar/SessionActions"
import { DeleteSessionDialog } from "./sidebar/DeleteSessionDialog"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { SessionsList } from "./sidebar/SessionsList"
import { useSessionManagement } from "@/hooks/useSessionManagement"

export const ChatSidebar = ({ onClose }: { onClose?: () => void }) => {
  const {
    sessions,
    isLoading,
    editingId,
    newTitle,
    sessionToDelete,
    currentSessionId,
    isDeletingSession,
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
  } = useSessionManagement()

  useEffect(() => {
    return () => {
      setEditingId(null);
    };
  }, [setEditingId]);

  const handleCloseWithReset = () => {
    setEditingId(null);
    onClose?.();
  };

  return (
    <>
      <div className="w-64 max-w-full h-full md:h-screen bg-offwhite border-r border-pump-gray/20 p-4 flex flex-col">
        {onClose && (
          <button
            type="button"
            className="md:hidden self-end mb-2 p-2 rounded hover:bg-pump-gray-light transition"
            onClick={handleCloseWithReset}
            aria-label="Fechar menu"
          >
            <span className="text-pump-purple text-2xl font-bold">&times;</span>
          </button>
        )}

        <SessionActions onClose={onClose} />
        
        <div className="mt-4 flex-1 overflow-y-auto">
          <SessionsList
            isLoading={isLoading}
            sessions={sessions}
            currentSessionId={currentSessionId}
            editingId={editingId}
            newTitle={newTitle}
            onOpen={(sessionId) => {
              handleOpenSession(sessionId)
              if (onClose) onClose()
            }}
            onEdit={startEditing}
            onDelete={setSessionToDelete}
            onThemeChange={refreshSessions}
            onTitleChange={(e) => setNewTitle(e.target.value)}
            onSaveEdit={handleRename}
            onCancelEdit={() => setEditingId(null)}
            onKeyPress={handleKeyPress}
          />
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
