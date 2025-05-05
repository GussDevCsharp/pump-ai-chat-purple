
import { useState, useEffect, useCallback } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface ChatTheme {
  id: string
  name: string
  description: string | null
  color: string | null
  prompt: string | null
}

export const useChatThemes = () => {
  const [themes, setThemes] = useState<ChatTheme[]>([])
  const [filteredThemes, setFilteredThemes] = useState<ChatTheme[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchThemes = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Fetching chat themes...")
      
      if (!searchTerm.trim()) {
        // Se não houver termo de pesquisa, busca todos os temas
        const { data, error } = await supabase
          .from('chat_themes')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        console.log("Fetched themes:", data)
        setThemes(data || [])
        setFilteredThemes(data || [])
      } else {
        // Busca temas por nome, descrição e prompt
        const { data: themeData, error: themeError } = await supabase
          .from('chat_themes')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,prompt.ilike.%${searchTerm}%`)
          .order('name', { ascending: true })

        if (themeError) throw themeError
          
        // Busca temas por títulos dos prompts
        const { data: promptThemeData, error: promptError } = await supabase
          .from('theme_prompts')
          .select(`
            theme_id,
            chat_themes (
              id, name, description, color, prompt
            )
          `)
          .ilike('title', `%${searchTerm}%`)

        if (promptError) throw promptError

        // Extrai os temas dos resultados dos prompts
        const themesFromPrompts = promptThemeData
          ? promptThemeData.map(item => item.chat_themes).filter(Boolean)
          : []
        
        // Combina resultados e remove duplicatas
        const allThemes = [...(themeData || []), ...themesFromPrompts]
        const uniqueThemes = Array.from(
          new Map(allThemes.map(theme => [theme.id, theme])).values()
        )

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
  }, [searchTerm, toast])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  useEffect(() => {
    fetchThemes()
  }, [fetchThemes]) // Re-fetch when search term changes via useCallback dependency

  return { 
    themes: filteredThemes, 
    isLoading, 
    refreshThemes: fetchThemes,
    searchTerm,
    handleSearch 
  }
}
