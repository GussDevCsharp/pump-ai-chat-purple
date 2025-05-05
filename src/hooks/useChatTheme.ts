
import { useState, useEffect } from "react"
import { useThemePrompt } from "./useThemePrompt"
import { useThemePrompts } from "./useThemePrompts"
import { supabase } from "@/integrations/supabase/client"

export function useChatTheme(themeFromUrl: string | null) {
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null)
  const [currentThemeName, setCurrentThemeName] = useState<string | null>(null)
  const [currentThemePrompt, setCurrentThemePrompt] = useState<string | null>(null)

  useEffect(() => {
    if (themeFromUrl) {
      setCurrentThemeId(themeFromUrl)
      console.log("Theme set from URL:", themeFromUrl)
      
      // Buscar o nome do tema atual e o prompt
      const fetchThemeInfo = async () => {
        try {
          const { data, error } = await supabase
            .from('chat_themes')
            .select('name, prompt')
            .eq('id', themeFromUrl)
            .single()
            
          if (error) {
            console.error("Erro ao buscar informações do tema:", error)
          } else if (data) {
            setCurrentThemeName(data.name)
            setCurrentThemePrompt(data.prompt)
            console.log("Theme info fetched:", data.name, "Prompt:", data.prompt ? "Present" : "None")
          }
        } catch (err) {
          console.error("Erro ao buscar informações do tema:", err)
        }
      }
      
      fetchThemeInfo()
    }
  }, [themeFromUrl])

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined)
  const { prompts: themePrompts, isLoading: isThemePromptsLoading } = useThemePrompts(currentThemeId ?? undefined)

  useEffect(() => {
    console.log("Current theme ID:", currentThemeId)
    console.log("Current theme name:", currentThemeName)
    console.log("Current theme prompt:", currentThemePrompt)
    console.log("Theme prompts:", themePrompts)
    console.log("Theme prompts loading:", isThemePromptsLoading)
  }, [currentThemeId, currentThemeName, currentThemePrompt, themePrompts, isThemePromptsLoading])

  return {
    currentThemeId,
    currentThemeName,
    currentThemePrompt,
    patternPrompt,
    themePrompts,
    isThemePromptsLoading
  }
}
