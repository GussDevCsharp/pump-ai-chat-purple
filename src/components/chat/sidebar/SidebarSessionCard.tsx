
import { MessageCircle, Menu, Pencil, Trash2, Tag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSelect } from "@/components/chat/ThemeSelect"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface SidebarSessionCardProps {
  session: any;
  themeObj: any;
  isActive: boolean;
  isEditing?: boolean;
  newTitle?: string;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onThemeChange: () => void;
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export function SidebarSessionCard({
  session,
  themeObj,
  isActive,
  isEditing = false,
  newTitle = "",
  onOpen,
  onEdit,
  onDelete,
  onThemeChange,
  onTitleChange,
  onSaveEdit,
  onCancelEdit,
  onKeyPress
}: SidebarSessionCardProps) {
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded-xl border-2 border-pump-purple shadow-md">
        <Input
          value={newTitle}
          onChange={onTitleChange}
          onKeyDown={onKeyPress}
          autoFocus
          className="mb-2"
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onCancelEdit} 
            type="button"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
          <button 
            onClick={onSaveEdit}
            type="button" 
            className="text-xs text-pump-purple hover:text-pump-purple/80"
          >
            Salvar
          </button>
        </div>
      </div>
    );
  }

  const handleThemeButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowThemeSelector(prev => !prev);
  };

  // Evita propagação do clique em elementos específicos
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
            {showThemeSelector ? (
              <div onClick={handleActionClick}>
                <ThemeSelect 
                  sessionId={session.id} 
                  currentTheme={session.theme_id}
                  onThemeChange={() => {
                    onThemeChange();
                    setShowThemeSelector(false);
                  }}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleThemeButtonClick}
                className="p-1 rounded hover:bg-pump-gray-light"
                aria-label="Mudar tema"
              >
                <Tag className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
              </button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleActionClick}>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-pump-gray-light"
                  aria-label="Menu de opções"
                >
                  <Menu className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }} className="cursor-pointer">
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar conversa
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
