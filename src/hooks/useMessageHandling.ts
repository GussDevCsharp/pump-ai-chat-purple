
import { useState } from 'react';
import { Message } from '@/types/chat';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMessageHandling = (sessionId: string | null, authStatus: 'authenticated' | 'anonymous') => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Olá! Como posso ajudar você hoje?'
  }]);
  const { toast } = useToast();
  
  const LOCAL_MESSAGES_KEY = 'anonymous_chat_messages';
  
  const getLocalMessages = (chatSessionId: string): Message[] => {
    try {
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      return allMessages
        .filter((msg: any) => msg.session_id === chatSessionId)
        .sort((a: any, b: any) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }));
    } catch (error) {
      console.error('Error loading local messages:', error);
      return [];
    }
  };
  
  const saveLocalMessages = (sessionId: string, newMessages: Message[]) => {
    try {
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      
      const otherSessionsMessages = allMessages.filter(
        (msg: any) => msg.session_id !== sessionId
      );
      
      const updatedMessages = [
        ...otherSessionsMessages,
        ...newMessages.map((msg) => ({
          ...msg,
          session_id: sessionId,
          created_at: new Date().toISOString()
        }))
      ];
      
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving local messages:', error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      if (authStatus === 'anonymous') {
        const localMessages = getLocalMessages(sessionId);
        if (localMessages.length > 0) {
          setMessages(localMessages);
        }
        return;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          role: msg.role as 'assistant' | 'user',
          content: msg.content
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat messages"
      });
    }
  };

  return {
    messages,
    setMessages,
    loadMessages,
    getLocalMessages,
    saveLocalMessages
  };
};
