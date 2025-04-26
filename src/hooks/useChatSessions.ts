import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from 'uuid'

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
  const [userId, setUserId] = useState<string | null>(null)
  const [localSessions, setLocalSessions] = useState<ChatSession[]>([])
  const LOCAL_SESSIONS_KEY = 'anonymous_chat_sessions'

  useEffect(() => {
    let ignore = false
    async function getUser() {
      const { data, error } = await supabase.auth.getSession()
      if (error) return
      const uid = data.session?.user?.id ?? null
      if (!ignore) setUserId(uid)
    }
    getUser()
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null)
      }
    )
    return () => {
      authListener.subscription.unsubscribe()
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!userId) {
      try {
        const saved = localStorage.getItem(LOCAL_SESSIONS_KEY)
        if (saved) {
          setLocalSessions(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Error loading local sessions:', err)
      }
    }
  }, [userId])

  const saveLocalSessions = (sessions: ChatSession[]) => {
    try {
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions))
    } catch (err) {
      console.error('Error saving local sessions:', err)
    }
  }

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        setSessions([])
        return
      }
      console.log("Fetching chat sessions for user:", userId)
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
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
      if (!userId) {
        const newSession = {
          id: uuidv4(),
          title,
          created_at: new Date().toISOString(),
          card_theme: theme,
          card_title: cardTitle,
          theme_id: themeId
        }
        
        const updatedSessions = [newSession, ...localSessions]
        setLocalSessions(updatedSessions)
        saveLocalSessions(updatedSessions)
        
        toast({
          description: "Nova conversa criada"
        })
        return newSession
      }
      
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
        .single()

      if (error) {
        console.error("Error creating session:", error)
        throw error
      }

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
      if (!userId) {
        const updatedSessions = localSessions.filter(session => session.id !== sessionId)
        setLocalSessions(updatedSessions)
        saveLocalSessions(updatedSessions)
        
        return true
      }
      
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      if (messagesError) throw messagesError

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(session => session.id !== sessionId))
      return true
    } catch (error) {
      console.error('Erro ao excluir chat session:', error)
      return false
    }
  }

  useEffect(() => {
    if (userId !== undefined) {
      fetchSessions()
    }
  }, [userId])

  const allSessions = userId ? sessions : localSessions

  return { 
    sessions: allSessions, 
    isLoading, 
    createSession, 
    deleteSession, 
    refreshSessions: fetchSessions 
  }
}
