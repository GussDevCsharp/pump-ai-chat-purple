
import { supabase } from "@/integrations/supabase/client";
import { ChatSession } from "@/types/chat";

export const fetchUserSessions = async (userId: string): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createSupabaseSession = async (
  userId: string, 
  title: string, 
  theme?: string, 
  cardTitle?: string, 
  themeId?: string
): Promise<ChatSession> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{
      title,
      user_id: userId,
      card_theme: theme,
      card_title: cardTitle,
      theme_id: themeId
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSupabaseSession = async (sessionId: string): Promise<void> => {
  // Delete messages first
  const { error: messagesError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId);

  if (messagesError) throw messagesError;

  // Then delete the session
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
};

