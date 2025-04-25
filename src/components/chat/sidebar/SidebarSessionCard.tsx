
import { MessageCircle, Menu, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface SidebarSessionCardProps {
  session: any
  themeObj: any
  isActive: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  onThemeChange: () => void
}

export function SidebarSessionCard({
  session,
  themeObj,
  isActive,
  onOpen,
  onEdit,
  onDelete,
  onThemeChange
}: SidebarSessionCardProps) {
  return (
    <div className="group relative">
      <button
        onClick={onOpen}
        className={`
          relative flex items-center w-full px-2 py-1.5
          rounded-lg transition-all duration-200
          hover:bg-pump-gray-light/50
          ${isActive ? "bg-pump-gray-light/30" : ""}
        `}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2 flex-grow min-w-0">
            <span 
              className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full"
              style={{
                background: themeObj?.color ? `${themeObj.color}20` : "#f4ebfd"
              }}
            >
              <MessageCircle
                className="w-4 h-4"
                style={{ color: themeObj?.color || "#7E1CC6" }}
              />
            </span>
            <span className="text-sm text-pump-gray font-medium truncate">
              {session.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onThemeChange();
              }}
              className="p-1 rounded hover:bg-pump-gray-light"
              aria-label="Mudar tema"
            >
              <span className="w-4 h-4 rounded-full inline-block"
                style={{ background: themeObj?.color || "#7E1CC6" }}
              />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-pump-gray-light"
                  aria-label="Menu de opções"
                >
                  <Menu className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }} className="cursor-pointer">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar conversa
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete();
                  }}
                  className="cursor-pointer text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </button>
    </div>
  );
}
