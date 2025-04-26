
import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"

export interface Message {
  role: 'assistant' | 'user'
  content: string
}

export interface LocalMessage extends Message {
  session_id: string
  created_at: string
}

const LOCAL_MESSAGES_KEY = 'anonymous_chat_messages'

export const useChatSession = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const { toast } = useToast()
  const { refreshSessions } = useChatSessions()
  const { authStatus } = useChatAuth()

  const getLocalMessages = (chatSessionId: string): Message[] => {
    try {
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]')
      return allMessages
        .filter((msg: LocalMessage) => msg.session_id === chatSessionId)
        .sort((a: LocalMessage, b: LocalMessage) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((msg: LocalMessage) => ({
          role: msg.role,
          content: msg.content
        }))
    } catch (error) {
      console.error('Error loading local messages:', error)
      return []
    }
  }

  const saveLocalMessages = (sessionId: string, newMessages: Message[]) => {
    try {
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]')
      const otherSessionsMessages = allMessages.filter(
        (msg: LocalMessage) => msg.session_id !== sessionId
      )
      const updatedMessages = [
        ...otherSessionsMessages,
        ...newMessages.map((msg) => ({
          ...msg,
          session_id: sessionId,
          created_at: new Date().toISOString()
        }))
      ]
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(updatedMessages))
    } catch (error) {
      console.error('Error saving local messages:', error)
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          role: msg.role as 'assistant' | 'user',
          content: msg.content
        }))
        setMessages(formattedMessages)
      } else {
        setMessages([{
          role: 'assistant',
          content: 'Olá! Como posso ajudar você hoje?'
        }])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat messages"
      })
    }
  }

  useEffect(() => {
    if (sessionId) {
      if (authStatus === 'anonymous') {
        const localMessages = getLocalMessages(sessionId)
        if (localMessages.length > 0) {
          setMessages(localMessages)
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Olá! Como posso ajudar você hoje?'
          }])
        }
      } else {
        loadMessages(sessionId)
      }
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Olá! Como posso ajudar você hoje?'
      }])
    }
  }, [sessionId, authStatus])

  return {
    messages,
    setMessages,
    isThinking,
    setIsThinking,
    saveLocalMessages
  }
}
