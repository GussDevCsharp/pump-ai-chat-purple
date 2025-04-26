
import { ReactNode } from "react";
import { SidebarSessionCard } from "./SidebarSessionCard";
import { Input } from "@/components/ui/input";

export interface SidebarSessionGroupProps {
  groupId: string;
  themeObj: any;
  sessions: any[];
  currentSessionId: string | null;
  onOpen: (sessionId: string) => void;
  onEdit: (sessionId: string, title: string) => void;
  onDelete: (sessionId: string) => void;
  onThemeChange: () => void;
  editingId?: string | null;
  newTitle?: string;
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit?: (id: string) => void;
  onCancelEdit?: () => void;
  onKeyPress?: (e: React.KeyboardEvent, id: string) => void;
  children?: ReactNode; // Added children property
  title: string; // This is the group title
}

export function SidebarSessionGroup({
  groupId,
  themeObj,
  sessions,
  currentSessionId,
  onOpen,
  onEdit,
  onDelete,
  onThemeChange,
  editingId,
  newTitle,
  onTitleChange,
  onSaveEdit,
  onCancelEdit,
  onKeyPress,
  children, // Added children parameter
  title // Added title parameter
}: SidebarSessionGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center text-xs font-medium text-pump-gray px-3 mb-2">
        {themeObj && themeObj.color && (
          <span
            className="inline-block w-3 h-3 rounded-full mr-2 border border-pump-gray/30"
            style={{ backgroundColor: themeObj.color }}
          />
        )}
        {themeObj?.name || title || "Sem tema"}
      </h3>
      {children || (
        sessions.map(session => (
          <div key={session.id} className="relative">
            {editingId === session.id ? (
              <div className="bg-white p-3 rounded-xl border-2 border-pump-purple shadow-md">
                <Input
                  value={newTitle}
                  onChange={onTitleChange}
                  onKeyDown={(e) => onKeyPress && onKeyPress(e, session.id)}
                  autoFocus
                  className="mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={onCancelEdit} 
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => onSaveEdit && onSaveEdit(session.id)} 
                    className="text-xs text-pump-purple hover:text-pump-purple/80"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <SidebarSessionCard
                session={session}
                themeObj={themeObj}
                isActive={session.id === currentSessionId}
                onOpen={() => onOpen(session.id)}
                onEdit={() => onEdit(session.id, session.title)}
                onDelete={() => onDelete(session.id)}
                onThemeChange={onThemeChange}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
