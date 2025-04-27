
import { useState, useEffect } from "react"
import { useThemePrompt } from "./useThemePrompt"
import { useThemePrompts } from "./useThemePrompts"

export function useChatTheme(themeFromUrl: string | null) {
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null)

  useEffect(() => {
    if (themeFromUrl) {
      setCurrentThemeId(themeFromUrl)
      console.log("Theme set from URL:", themeFromUrl)
    }
  }, [themeFromUrl])

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined)
  const { prompts: themePrompts, isLoading: isThemePromptsLoading } = useThemePrompts(currentThemeId ?? undefined)

  useEffect(() => {
    console.log("Current theme ID:", currentThemeId)
    console.log("Theme prompts:", themePrompts)
    console.log("Theme prompts loading:", isThemePromptsLoading)
  }, [currentThemeId, themePrompts, isThemePromptsLoading])

  return {
    currentThemeId,
    patternPrompt,
    themePrompts,
    isThemePromptsLoading
  }
}
