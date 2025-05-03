
import React from "react"
import {
  MoreVertical,
  MessageSquare,
  Pencil,
  Trash,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SessionCardMenuProps {
  sessionId: string
  isMobile: boolean
  isActive?: boolean
  onEditClick: (e: React.MouseEvent) => void
  onDeleteClick: (e: React.MouseEvent) => void
  onThemeSelect: (e: React.MouseEvent) => void
}

export function SessionCardMenu({
  sessionId,
  isMobile,
  isActive = false,
  onEditClick,
  onDeleteClick,
  onThemeSelect
}: SessionCardMenuProps) {
  return (
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
              onThemeSelect(e);
            }}
            className="dark:text-gray-200 dark:hover:bg-white/5"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Definir tema
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={(e) => { 
            e.stopPropagation(); 
            onEditClick(e); 
          }}
          className="dark:text-gray-200 dark:hover:bg-white/5"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator className="dark:border-gray-700" />
        <DropdownMenuItem 
          onClick={(e) => { 
            e.stopPropagation(); 
            onDeleteClick(e); 
          }}
          className="text-red-500 hover:text-red-500 focus:text-red-500 dark:text-red-400 dark:hover:text-red-300"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
