
import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface ChatSession {
  id: string
  title: string
  created_at: string
  card_theme?: string | null
  card_title?: string | null
}

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat history"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createSession = async (title: string, theme?: string, cardTitle?: string) => {
    try {
      const dummyUserId = '00000000-0000-0000-0000-000000000000'
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title,
          user_id: dummyUserId,
          card_theme: theme,
          card_title: cardTitle
        })
        .select()
        .single()

      if (error) throw error
      setSessions(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error creating chat session:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new chat"
      })
      return null
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  return { sessions, isLoading, createSession, refreshSessions: fetchSessions }
}
