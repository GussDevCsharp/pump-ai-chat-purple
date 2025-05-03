
import { useState, useEffect } from "react"
import { useThemePrompt } from "./useThemePrompt"
import { useThemePrompts } from "./useThemePrompts"
import { supabase } from "@/integrations/supabase/client"

export function useChatTheme(themeFromUrl: string | null) {
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null)
  const [currentThemeName, setCurrentThemeName] = useState<string | null>(null)

  useEffect(() => {
    if (themeFromUrl) {
      setCurrentThemeId(themeFromUrl)
      console.log("Theme set from URL:", themeFromUrl)
      
      // Buscar o nome do tema atual
      const fetchThemeName = async () => {
        try {
          const { data, error } = await supabase
            .from('chat_themes')
            .select('name')
            .eq('id', themeFromUrl)
            .single()
            
          if (error) {
            console.error("Erro ao buscar nome do tema:", error)
          } else if (data) {
            setCurrentThemeName(data.name)
            console.log("Theme name fetched:", data.name)
          }
        } catch (err) {
          console.error("Erro ao buscar nome do tema:", err)
        }
      }
      
      fetchThemeName()
    }
  }, [themeFromUrl])

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined)
  const { prompts: themePrompts, isLoading: isThemePromptsLoading } = useThemePrompts(currentThemeId ?? undefined)

  useEffect(() => {
    console.log("Current theme ID:", currentThemeId)
    console.log("Current theme name:", currentThemeName)
    console.log("Theme prompts:", themePrompts)
    console.log("Theme prompts loading:", isThemePromptsLoading)
  }, [currentThemeId, currentThemeName, themePrompts, isThemePromptsLoading])

  return {
    currentThemeId,
    currentThemeName,
    patternPrompt,
    themePrompts,
    isThemePromptsLoading
  }
}
