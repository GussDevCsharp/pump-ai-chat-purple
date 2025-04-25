
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { ChatSession } from "@/types/chat";
import { loadLocalSessions, saveLocalSessions, deleteLocalSession } from "@/services/chatMessages/localStorageService";
import { fetchUserSessions, createSupabaseSession, deleteSupabaseSession } from "@/services/chatMessages/supabaseService";

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [localSessions, setLocalSessions] = useState<ChatSession[]>([]);

  // Get and set the authenticated user's ID
  useEffect(() => {
    let ignore = false;
    async function getUser() {
      const { data, error } = await supabase.auth.getSession();
      if (error) return;
      const uid = data.session?.user?.id ?? null;
      if (!ignore) setUserId(uid);
    }
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
      ignore = true;
    }
  }, []);

  // Load local sessions for anonymous users
  useEffect(() => {
    if (!userId) {
      const savedSessions = loadLocalSessions();
      setLocalSessions(savedSessions);
    }
  }, [userId]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      if (!userId) {
        setSessions([]);
        return;
      }
      console.log("Fetching chat sessions for user:", userId);
      const data = await fetchUserSessions(userId);
      setSessions(data);
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar histórico de conversas"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (title: string, theme?: string, cardTitle?: string, themeId?: string) => {
    try {
      if (!userId) {
        // Create local session for anonymous users
        const newSession = {
          id: uuidv4(),
          title,
          created_at: new Date().toISOString(),
          card_theme: theme,
          card_title: cardTitle,
          theme_id: themeId
        };
        
        const updatedSessions = [newSession, ...localSessions];
        setLocalSessions(updatedSessions);
        saveLocalSessions(updatedSessions);
        
        toast({
          description: "Nova conversa criada"
        });
        return newSession;
      }
      
      // Create session in database for logged-in users
      const data = await createSupabaseSession(userId, title, theme, cardTitle, themeId);
      setSessions(prev => data ? [data, ...prev] : prev);
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao criar conversa"
      });
      return null;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      if (!userId) {
        const updatedSessions = deleteLocalSession(sessionId, localSessions);
        setLocalSessions(updatedSessions);
        toast({
          description: "Chat excluído com sucesso"
        });
        return true;
      }
      
      await deleteSupabaseSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      toast({
        description: "Chat excluído com sucesso"
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir chat session:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir o chat"
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId !== undefined) {
      fetchSessions();
    }
  }, [userId]);

  // Combine local and database sessions
  const allSessions = userId ? sessions : localSessions;

  return { 
    sessions: allSessions, 
    isLoading, 
    createSession, 
    deleteSession, 
    refreshSessions: fetchSessions 
  };
};

