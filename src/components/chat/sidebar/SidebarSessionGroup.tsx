
import { ReactNode, useState } from "react";
import { SidebarSessionCard } from "./SidebarSessionCard";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ChatSession } from "@/hooks/useChatSessions";

export interface SidebarSessionGroupProps {
  groupId: string;
  themeObj: any;
  sessions: ChatSession[];
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
  children?: ReactNode;
  title: string;
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
  children,
  title
}: SidebarSessionGroupProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="space-y-1 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center w-full px-3 py-1 text-sm font-medium text-pump-gray hover:text-pump-gray-dark dark:text-gray-300 dark:hover:text-white">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 mr-1.5" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1.5" />
          )}
          {themeObj && themeObj.color && (
            <span
              className="inline-block w-3 h-3 rounded-full mr-2 border border-pump-gray/30 dark:border-white/30"
              style={{ backgroundColor: themeObj.color }}
            />
          )}
          {themeObj?.name || title || "Sem tema"}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pl-2 mt-2 space-y-2">
          {children || (
            sessions.map(session => (
              <div key={session.id} className="relative" data-session-id={session.id}>
                {editingId === session.id ? (
                  <div className="bg-offwhite p-3 rounded-xl border-2 border-pump-purple shadow-md dark:bg-[#1A1F2C] dark:border-pump-purple/70">
                    <Input
                      value={newTitle}
                      onChange={onTitleChange}
                      onKeyDown={(e) => onKeyPress && onKeyPress(e, session.id)}
                      autoFocus
                      className="mb-2 dark:bg-[#222222] dark:border-gray-700 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={onCancelEdit} 
                        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => onSaveEdit && onSaveEdit(session.id)} 
                        className="text-xs text-pump-purple hover:text-pump-purple/80 dark:text-pump-purple/90 dark:hover:text-pump-purple/70"
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
