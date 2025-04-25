
import React from 'react'
import { SidebarSessionGroup } from './SidebarSessionGroup'

interface SessionsListProps {
  isLoading: boolean
  sessions: any[]
  currentSessionId: string | null
  editingId: string | null
  newTitle: string
  onOpen: (sessionId: string) => void
  onEdit: (sessionId: string, title: string) => void
  onDelete: (sessionId: string) => void
  onThemeChange: () => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  onKeyPress: (e: React.KeyboardEvent, id: string) => void
}

export function SessionsList({
  isLoading,
  sessions,
  currentSessionId,
  editingId,
  newTitle,
  onOpen,
  onEdit,
  onDelete,
  onThemeChange,
  onTitleChange,
  onSaveEdit,
  onCancelEdit,
  onKeyPress
}: SessionsListProps) {
  // Group sessions by theme for display
  const groupedSessions = sessions.reduce((acc: Record<string, any[]>, session) => {
    const themeId = session.theme_id || 'default';
    if (!acc[themeId]) {
      acc[themeId] = [];
    }
    acc[themeId].push(session);
    return acc;
  }, {} as Record<string, any[]>);  // Fix: properly type the initial value

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="text-sm text-pump-gray">Carregando conversas...</div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="text-sm text-pump-gray">Nenhuma conversa encontrada</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupedSessions).map(([themeId, themeSessions]) => {
        const themeObj = themeSessions[0]?.theme_id ? {
          id: themeSessions[0]?.theme_id,
          name: themeSessions[0]?.card_theme || 'Sem tema',
          color: themeSessions[0]?.card_theme ? '#7E1CC6' : null
        } : {
          id: 'default',
          name: 'Sem tema',
          color: null
        };
        
        return (
          <SidebarSessionGroup
            key={themeId}
            groupId={themeId}
            themeObj={themeObj}
            sessions={themeSessions}
            currentSessionId={currentSessionId}
            onOpen={onOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onThemeChange={onThemeChange}
            editingId={editingId}
            newTitle={newTitle}
            onTitleChange={onTitleChange}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onKeyPress={onKeyPress}
          />
        );
      })}
    </div>
  );
}
