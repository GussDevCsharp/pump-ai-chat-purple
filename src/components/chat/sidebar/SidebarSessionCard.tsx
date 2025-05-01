
import { ChatSession } from "@/hooks/useChatSessions"
import {
  MoreVertical,
  MessageSquare,
  Pencil,
  Trash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeSelect } from "@/components/chat/ThemeSelect"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

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
        {isEditing ? (
          <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text" 
              value={editTitle} 
              onChange={handleTitleChange}
              onClick={(e) => e.stopPropagation()}
              className="text-sm px-2 py-1 w-full rounded border border-pump-gray/20 mr-1 bg-offwhite dark:bg-[#222222] dark:text-white dark:border-gray-700"
              autoFocus
            />
            <div className="flex space-x-1">
              <button 
                onClick={handleSaveEdit} 
                className="text-xs text-pump-purple hover:text-pump-purple/80 p-1"
              >
                ✓
              </button>
              <button 
                onClick={handleCancelEdit} 
                className="text-xs text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-sm font-medium truncate max-w-[120px] sm:max-w-[160px]",
              isActive 
                ? "text-pump-gray-dark dark:text-white" 
                : "text-pump-gray dark:text-gray-300"
            )}>{session.title}</p>
          </div>
        )}
        
        <span className="text-xs text-pump-gray-light dark:text-gray-400">
          {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

      {showDeleteConfirmation ? (
        <div 
          className="flex items-center space-x-2 ml-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={handleConfirmDelete}
            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors dark:bg-red-600 dark:hover:bg-red-700"
          >
            Sim
          </button>
          <button 
            onClick={handleCancelDelete}
            className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Não
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-1 sm:space-x-2">
          {!isMobile && (
            <ThemeSelect 
              sessionId={session.id}
              currentTheme={session.theme_id}
              onThemeChange={onThemeChange}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                onClick={(e) => e.stopPropagation()} 
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity",
                  isActive 
                    ? "hover:bg-pump-gray-light/30 dark:hover:bg-white/5" 
                    : "hover:bg-offwhite dark:hover:bg-white/5"
                )}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-offwhite dark:bg-[#222222] border-gray-200 dark:border-gray-700">
              {isMobile && (
                <DropdownMenuItem 
                  onClick={(e) => { 
                    e.stopPropagation();
                    const themeSelectButton = document.querySelector(`[data-session-id="${session.id}"] .theme-select-button`);
                    if (themeSelectButton) {
                      (themeSelectButton as HTMLButtonElement).click();
                    }
                  }}
                  className="dark:text-gray-200 dark:hover:bg-white/5"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Definir tema
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleEditClick(e); }}
                className="dark:text-gray-200 dark:hover:bg-white/5"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:border-gray-700" />
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(e); }}
                className="text-red-500 hover:text-red-500 focus:text-red-500 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}
