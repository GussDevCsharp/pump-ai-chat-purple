
import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeSelect } from "@/components/chat/ThemeSelect"
import { useIsMobile } from "@/hooks/use-mobile"
import { ChatSession } from "@/hooks/useChatSessions"
import { SessionCardMenu } from "./components/SessionCardMenu"
import { EditableTitle } from "./components/EditableTitle"
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog"

interface SidebarSessionCardProps {
  session: ChatSession
  themeObj?: any
  isActive?: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onThemeChange: () => void
}

export function SidebarSessionCard({
  session,
  themeObj,
  isActive = false,
  onOpen,
  onEdit,
  onDelete,
  onThemeChange
}: SidebarSessionCardProps) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  }
  
  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      setIsEditing(false);
      onEdit();
    }
  }
  
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(session.title);
  }
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  }
  
  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setShowDeleteConfirmation(false);
  }
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(false);
  }
  
  const handleThemeSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const themeSelectButton = document.querySelector(`[data-session-id="${session.id}"] .theme-select-button`);
    if (themeSelectButton) {
      (themeSelectButton as HTMLButtonElement).click();
    }
  }
  
  return (
    <div
      onClick={onOpen}
      className={cn(
        "px-2 sm:px-3 py-2 relative rounded-lg flex items-center cursor-pointer group transition-colors",
        isActive 
          ? "bg-offwhite text-pump-gray-dark dark:bg-[#222222] dark:text-white"
          : "hover:bg-offwhite/50 text-pump-gray dark:hover:bg-white/5 dark:text-gray-300"
      )}
    >
      <div className="mr-2 sm:mr-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg",
          isActive 
            ? "bg-offwhite/80 text-pump-purple dark:bg-[#333333] dark:text-white"
            : "bg-offwhite/80 text-pump-purple dark:bg-[#333333] dark:text-gray-300"
        )}>
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <EditableTitle 
          isEditing={isEditing}
          editTitle={editTitle}
          handleTitleChange={handleTitleChange}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          title={session.title}
          isActive={isActive}
        />
        
        <span className="text-xs text-pump-gray-light dark:text-gray-400">
          {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <div className="flex items-center space-x-1 sm:space-x-2">
        {!isMobile && (
          <ThemeSelect 
            sessionId={session.id}
            currentTheme={session.theme_id}
            onThemeChange={onThemeChange}
          />
        )}

        <SessionCardMenu
          sessionId={session.id}
          isMobile={isMobile}
          isActive={isActive}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onThemeSelect={handleThemeSelect}
        />
      </div>
    </div>
  )
}
