
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
  
  return (
    <div
      onClick={onOpen}
      className={cn(
        "px-2 sm:px-3 py-2 relative rounded-lg flex items-center cursor-pointer group transition-colors",
        isActive 
          ? "bg-white text-pump-gray-dark dark:bg-[#222222] dark:text-white"
          : "hover:bg-white/50 text-pump-gray dark:hover:bg-white/5 dark:text-gray-300"
      )}
    >
      <div className="mr-2 sm:mr-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg",
          isActive 
            ? "bg-white/80 text-pump-purple dark:bg-[#333333] dark:text-white"
            : "bg-white/80 text-pump-purple dark:bg-[#333333] dark:text-gray-300"
        )}>
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm font-medium truncate max-w-[120px] sm:max-w-[160px]",
            isActive 
              ? "text-pump-gray-dark dark:text-white" 
              : "text-pump-gray dark:text-gray-300"
          )}>{session.title}</p>
        </div>
        <span className="text-xs text-pump-gray-light dark:text-gray-400">
          {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

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
                  : "hover:bg-white dark:hover:bg-white/5"
              )}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#222222] border-gray-200 dark:border-gray-700">
            {isMobile && (
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation();
                  const themeSelectButton = document.querySelector(`[data-session-id="${session.id}"] .theme-select-button`);
                  if (themeSelectButton) {
                    (themeSelectButton as HTMLButtonElement).click();
                  }
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Definir tema
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-500 hover:text-red-500 focus:text-red-500"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
