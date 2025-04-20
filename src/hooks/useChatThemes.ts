
import { useState, useEffect } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface ChatTheme {
  id: string
  name: string
  description: string | null
  color: string | null
}

export const useChatThemes = () => {
  const [themes, setThemes] = useState<ChatTheme[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchThemes = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching chat themes...")
      const { data, error } = await supabase
        .from('chat_themes')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      console.log("Fetched themes:", data)
      setThemes(data || [])
    } catch (error) {
      console.error('Error fetching themes:', error)
      toast({
        variant: "destructive",
        description: "Falha ao carregar temas"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  return { themes, isLoading, refreshThemes: fetchThemes }
}
