
import { SidebarSessionCard } from "./SidebarSessionCard";

export interface SidebarSessionGroupProps {
  groupId: string;
  themeObj: any;
  sessions: any[];
  currentSessionId: string | null;
  onOpen: (sessionId: string) => void;
  onEdit: (sessionId: string, title: string) => void;
  onDelete: (sessionId: string) => void;
  onThemeChange: () => void;
}

export function SidebarSessionGroup({
  groupId,
  themeObj,
  sessions,
  currentSessionId,
  onOpen,
  onEdit,
  onDelete,
  onThemeChange
}: SidebarSessionGroupProps) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center text-xs font-medium text-pump-gray px-3">
        {themeObj && themeObj.color && (
          <span
            className="inline-block w-3 h-3 rounded-full mr-2 border border-pump-gray/30"
            style={{ backgroundColor: themeObj.color }}
          />
        )}
        <span style={themeObj?.color ? { color: themeObj.color } : {}}>
          {themeObj ? themeObj.name : "Sem tema"}
        </span>
      </h3>
      {sessions.map(session => (
        <SidebarSessionCard
          key={session.id}
          session={session}
          themeObj={themeObj}
          isActive={session.id === currentSessionId}
          onOpen={() => onOpen(session.id)}
          onEdit={() => onEdit(session.id, session.title)}
          onDelete={() => onDelete(session.id)}
          onThemeChange={onThemeChange}
        />
      ))}
    </div>
  );
}
