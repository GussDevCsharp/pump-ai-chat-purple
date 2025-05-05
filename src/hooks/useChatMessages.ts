
import { useState } from "react"
import { ThemePrompt } from "./useThemePrompts"

export interface BusinessData {
  company_name: string
  industry: string
  years: string
  focus: string
}

export function useChatMessages(
  businessData: BusinessData,
  onMessageSend: (content: string) => Promise<void>
) {
  const [furtivePrompt, setFurtivePrompt] = useState<{ text: string; title: string } | null>(null)

  const interpolatePatternPrompt = (
    pattern: string,
    userQuery: string,
    business: Record<string, string>,
    themeTitle?: string,
    themePrompt?: string | null
  ) => {
    let filled = pattern
    
    // Adicionar contexto do tema base se disponível
    if (themePrompt) {
      filled = `Contexto do tema: ${themePrompt}\n\n${filled}`
    }
    
    for (const key in business) {
      filled = filled.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key])
    }
    filled = filled.replace(/{{\s*user_query\s*}}/g, userQuery)
    
    // Substituir [subtema] pelo título do tema se disponível
    if (themeTitle) {
      filled = filled.replace(/\[subtema\]/g, themeTitle)
    }
    
    return filled
  }

  const substitutePromptTags = (
    prompt: string, 
    business: Record<string, string>,
    themeTitle?: string,
    themePrompt?: string | null
  ) => {
    let result = prompt
    
    // Adicionar contexto do tema base se disponível
    if (themePrompt) {
      result = `Contexto do tema: ${themePrompt}\n\n${result}`
    }
    
    for (const key in business) {
      result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key])
    }
    
    // Substituir [subtema] pelo título do tema se disponível
    if (themeTitle) {
      result = result.replace(/\[subtema\]/g, themeTitle)
    }
    
    return result
  }

  const handlePromptCardSelect = async (prompt: ThemePrompt) => {
    // Store the furtive prompt for later use and persistence
    setFurtivePrompt({
      text: prompt.prompt_furtive ?? prompt.title,
      title: prompt.title
    })
    
    // Set the prompt title in the text area but don't send it yet
    const textArea = document.querySelector('textarea')
    if (textArea) {
      textArea.value = prompt.title
      textArea.dispatchEvent(new Event('input', { bubbles: true }))
      textArea.focus()
    }
  }

  return {
    furtivePrompt,
    setFurtivePrompt,
    handlePromptCardSelect,
    interpolatePatternPrompt,
    substitutePromptTags
  }
}
