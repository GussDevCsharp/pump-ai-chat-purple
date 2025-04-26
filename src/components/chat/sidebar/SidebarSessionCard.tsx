
import { ChatSession } from "@/hooks/useChatSessions"
import {
  MoreVertical,
  MessageSquare,
  Pencil,
  Trash,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  return (
    <div
      onClick={onOpen}
      className={cn(
        "px-3 py-2.5 relative rounded-lg flex items-center cursor-pointer group transition-colors",
        isActive 
          ? "bg-white text-pump-gray-dark shadow-sm"
          : "hover:bg-white/50 text-pump-gray"
      )}
    >
      <div className="mr-3">
        <div className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg bg-white/80 text-pump-purple"
        )}>
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm font-medium truncate max-w-[160px]",
            isActive ? "text-pump-gray-dark" : "text-pump-gray"
          )}>{session.title}</p>
        </div>
        <span className="text-xs text-pump-gray-light">
          {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            onClick={(e) => e.stopPropagation()} 
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity",
              isActive ? "hover:bg-pump-gray-light/30" : "hover:bg-white"
            )}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onThemeChange(); }}>
            <Palette className="mr-2 h-4 w-4" />
            Change Theme
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
  )
}
