
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { ThemeSelect } from "@/components/chat/ThemeSelect";

export interface SidebarSessionCardProps {
  session: any;
  themeObj: any;
  isActive: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onThemeChange: () => void;
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
          relative flex items-center justify-between gap-3 px-4 py-3 w-full
          bg-white border-2 border-pump-gray/10 rounded-2xl shadow-md
          transition-all duration-200
          hover:scale-105 hover:shadow-xl 
          group/card min-h-[80px]
          ${isActive ? "ring-2 ring-pump-purple" : ""}
        `}
        style={{
          borderColor: themeObj?.color || "#e9e3fc",
          boxShadow: "0 8px 18px 0 rgba(54,40,90,0.06)"
        }}
      >
        <div className="flex items-center gap-3">
          <span 
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: themeObj?.color ? `${themeObj.color}20` : "#f4ebfd"
            }}
          >
            <MessageCircle
              className="w-6 h-6"
              style={{ color: themeObj?.color || "#7E1CC6" }}
            />
          </span>
          <span className="text-sm text-pump-gray font-medium truncate">
            {session.title}
          </span>
        </div>
        
        <div className="
          absolute bottom-2 right-2
          opacity-0 group-hover/card:opacity-100 
          transition-opacity 
          flex items-center gap-1
        ">
          <ThemeSelect 
            sessionId={session.id} 
            currentTheme={session.theme_id}
            onThemeChange={onThemeChange}
          />
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              onEdit(); 
            }}
            className="rounded hover:bg-pump-gray-light p-1"
            aria-label="Editar conversa"
          >
            <Pencil className="w-4 h-4 text-pump-gray hover:text-pump-purple" />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              e.preventDefault();
              onDelete(); 
            }}
            className="rounded hover:bg-red-50 p-1"
            aria-label="Excluir conversa"
          >
            <Trash2 className="w-4 h-4 text-pump-gray hover:text-red-500" />
          </button>
        </div>
      </button>
    </div>
  );
}
