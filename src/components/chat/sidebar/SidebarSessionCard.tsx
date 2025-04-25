
import { MessageCircle, Menu, Pencil, Trash2 } from "lucide-react"
import { ThemeSelect } from "@/components/chat/ThemeSelect"
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
          relative flex flex-col px-3 py-2 w-full
          border-2 border-transparent rounded-2xl
          transition-all duration-200
          hover:scale-105 hover:shadow-xl 
          group/card min-h-[80px]
          ${isActive ? "ring-2 ring-pump-purple" : ""}
        `}
        style={{
          boxShadow: isActive ? "0 8px 18px 0 rgba(54,40,90,0.06)" : "none"
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 flex-grow overflow-hidden">
            <span 
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full"
              style={{
                background: themeObj?.color ? `${themeObj.color}20` : "#f4ebfd"
              }}
            >
              <MessageCircle
                className="w-5 h-5"
                style={{ color: themeObj?.color || "#7E1CC6" }}
              />
            </span>
            <span className="text-sm text-pump-gray font-medium truncate">
              {session.title}
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
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
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault();
                onThemeChange();
              }} className="cursor-pointer">
                <span className="w-4 h-4 mr-2 rounded-full inline-block"
                  style={{ background: themeObj?.color || "#7E1CC6" }}
                />
                Mudar tema
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
      </button>
    </div>
  );
}
