
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { AuthStatus } from './useChatAuth';

export const useSessionManagement = (
  sessionId: string | null,
  authStatus: AuthStatus
) => {
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThemeId() {
      if (!sessionId) {
        setCurrentThemeId(null);
        return;
      }
      if (authStatus === 'anonymous') {
        try {
          const localSessions = JSON.parse(localStorage.getItem('anonymous_chat_sessions') || '[]');
          const session = localSessions.find((s: any) => s.id === sessionId);
          setCurrentThemeId(session?.theme_id || null);
        } catch (e) {
          setCurrentThemeId(null);
        }
        return;
      }
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('theme_id')
        .eq('id', sessionId)
        .maybeSingle();
      if (!error && data && data.theme_id) setCurrentThemeId(data.theme_id);
      else setCurrentThemeId(null);
    }
    fetchThemeId();
  }, [sessionId, authStatus]);

  return { currentThemeId };
};
