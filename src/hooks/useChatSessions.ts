
import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface ChatSession {
  id: string
  title: string
  created_at: string
  card_theme?: string | null
  card_title?: string | null
  theme_id?: string | null
}

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching chat sessions...")
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log("Fetched sessions:", data)
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar histórico de conversas"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createSession = async (title: string, theme?: string, cardTitle?: string, themeId?: string) => {
    try {
      const dummyUserId = '00000000-0000-0000-0000-000000000000'
      console.log("Creating new session:", { title, theme, cardTitle, themeId })
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          title,
          user_id: dummyUserId,
          card_theme: theme,
          card_title: cardTitle,
          theme_id: themeId
        }])
        .select()
        .single()

      if (error) {
        console.error("Error creating session:", error)
        throw error
      }

      console.log("Session created successfully:", data)
      setSessions(prev => data ? [data, ...prev] : prev)
      return data
    } catch (error) {
      console.error('Error creating chat session:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao criar conversa"
      })
      return null
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      // Excluir todas as mensagens antes de remover a sessão
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      if (messagesError) throw messagesError

      // Remover a sessão
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(session => session.id !== sessionId))
      toast({
        description: "Chat excluído com sucesso"
      })

      return true
    } catch (error) {
      console.error('Erro ao excluir chat session:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao excluir o chat"
      })
      return false
    }
  }

  useEffect(() => {
    console.log("Initial fetch of chat sessions")
    fetchSessions()
  }, [])

  return { sessions, isLoading, createSession, deleteSession, refreshSessions: fetchSessions }
}
