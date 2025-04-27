
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { ThemePrompt } from "./useThemePrompts"
import { Message } from "./useChatSession"

interface BusinessData {
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
    business: Record<string, string>
  ) => {
    let filled = pattern
    for (const key in business) {
      filled = filled.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key])
    }
    filled = filled.replace(/{{\s*user_query\s*}}/g, userQuery)
    return filled
  }

  const substitutePromptTags = (prompt: string, business: Record<string, string>) => {
    let result = prompt
    for (const key in business) {
      result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key])
    }
    return result
  }

  const handlePromptCardSelect = async (prompt: ThemePrompt) => {
    if (prompt.action_plan) {
      try {
        const { data: actionPlan, error } = await supabase
          .from('action_plans')
          .insert({
            title: prompt.title,
            prompt_id: prompt.id,
            user_id: (await supabase.auth.getSession()).data.session?.user.id
          })
          .select()
          .single()

        if (error) throw error

        toast({
          title: "Plano de ação criado",
          description: "Você pode acompanhar seu progresso na seção de planos de ação."
        })
      } catch (error) {
        console.error("Erro ao criar plano de ação:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o plano de ação."
        })
      }
    }

    setFurtivePrompt({
      text: prompt.prompt_furtive ?? prompt.title,
      title: prompt.title
    })
    
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
