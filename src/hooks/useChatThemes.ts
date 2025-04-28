
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
  const [filteredThemes, setFilteredThemes] = useState<ChatTheme[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchThemes = async () => {
    try {
      setIsLoading(true)
      console.log("Fetching chat themes...")
      
      if (!searchTerm.trim()) {
        const { data, error } = await supabase
          .from('chat_themes')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        console.log("Fetched themes:", data)
        setThemes(data || [])
        setFilteredThemes(data || [])
      } else {
        // Search in chat_themes and their related theme_prompts
        const { data: themesWithPrompts, error } = await supabase
          .from('chat_themes')
          .select(`
            *,
            theme_prompts (
              title,
              prompt_furtive
            )
          `)
          .or(`
            name.ilike.%${searchTerm}%,
            description.ilike.%${searchTerm}%,
            theme_prompts.title.ilike.%${searchTerm}%
          `)
          .order('name', { ascending: true })

        if (error) throw error
        
        // Remove duplicates and format the response
        const uniqueThemes = Array.from(new Set(themesWithPrompts?.map(theme => theme.id)))
          .map(id => themesWithPrompts?.find(theme => theme.id === id))
          .filter(theme => theme !== undefined)
          .map(({ theme_prompts, ...theme }) => theme)

        console.log("Fetched filtered themes:", uniqueThemes)
        setThemes(uniqueThemes || [])
        setFilteredThemes(uniqueThemes || [])
      }
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

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  useEffect(() => {
    fetchThemes()
  }, [searchTerm]) // Re-fetch when search term changes

  return { 
    themes: filteredThemes, 
    isLoading, 
    refreshThemes: fetchThemes,
    searchTerm,
    handleSearch 
  }
}
