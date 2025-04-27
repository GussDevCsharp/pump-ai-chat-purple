import { useState, useEffect } from "react"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"
import { useThemePrompt } from "@/hooks/useThemePrompt"
import { useThemePrompts } from "@/hooks/useThemePrompts"
import { Watermark } from "../common/Watermark"
import { PromptSuggestionCards } from "./PromptSuggestionCards"
import { AuthBanner } from "./AuthBanner"
import { BackButton } from "./BackButton"
import { useChatSession } from "@/hooks/useChatSession"
import { toast } from "@/hooks/use-toast"

const businessData = {
  company_name: "Minha Empresa",
  industry: "Tecnologia",
  years: "5",
  focus: "Soluções inovadoras",
}

export const ChatContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const themeFromUrl = searchParams.get('theme')
  const { createSession, refreshSessions } = useChatSessions()
  const { authStatus, recordInteraction, remainingInteractions } = useChatAuth()
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null)
  const [furtivePrompt, setFurtivePrompt] = useState<{ text: string; title: string } | null>(null)
  const { messages, setMessages, isThinking, setIsThinking, saveLocalMessages } = useChatSession(sessionId)

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

  const handlePromptCardSelect = async (prompt: any) => {
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
          .single();

        if (error) throw error;

        toast({
          title: "Plano de ação criado",
          description: "Você pode acompanhar seu progresso na seção de planos de ação."
        });
      } catch (error) {
        console.error("Erro ao criar plano de ação:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o plano de ação."
        });
      }
    }

    setFurtivePrompt({
      text: prompt.prompt_furtive ?? prompt.title,
      title: prompt.title
    });
    
    const textArea = document.querySelector('textarea');
    if (textArea) {
      textArea.value = prompt.title;
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
      textArea.focus();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (authStatus === 'anonymous' && !recordInteraction()) {
      return
    }

    try {
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])
      setIsThinking(true)

      let currentSessionId = sessionId
      let isFirstMessage = !currentSessionId

      if (!currentSessionId) {
        const defaultTitle = content.split(' ').slice(0, 5).join(' ') + '...'
        const session = await createSession(defaultTitle, undefined, undefined, currentThemeId || undefined)
        if (!session) throw new Error("Failed to create chat session")

        currentSessionId = session.id
        setSearchParams(prev => {
          prev.set('session', currentSessionId!)
          if (currentThemeId) {
            prev.set('theme', currentThemeId)
          }
          return prev
        })
      }

      let aiMessageToSend = content
      let furtivePromptSnapshot = furtivePrompt

      if (furtivePromptSnapshot) {
        if (!content.trim()) {
          aiMessageToSend = substitutePromptTags(furtivePromptSnapshot.text, businessData)
        } else {
          aiMessageToSend =
            substitutePromptTags(furtivePromptSnapshot.text, businessData) +
            " " +
            content
        }
      } else if (patternPrompt?.pattern_prompt) {
        aiMessageToSend = interpolatePatternPrompt(
          patternPrompt.pattern_prompt,
          content,
          businessData
        )
      }

      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiMessageToSend }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to connect to service')
      }

      const data = await response.json()
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Invalid response format from AI service')
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      }

      if (authStatus === 'anonymous') {
        saveLocalMessages(currentSessionId, [userMessage, assistantMessage])
        setMessages(prev => [...prev, assistantMessage])
        await refreshSessions()
      } else if (isFirstMessage) {
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: currentSessionId,
                role: 'user',
                content: userMessage.content
              },
              {
                session_id: currentSessionId,
                role: 'assistant',
                content: assistantMessage.content
              }
            ])
        } catch (error: any) {
          console.error("Erro ao salvar a primeira conversa:", error)
        }
        setMessages(prev => [...prev, assistantMessage])
        await refreshSessions()
      } else {
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: currentSessionId,
                role: 'user',
                content: userMessage.content
              },
              {
                session_id: currentSessionId,
                role: 'assistant',
                content: assistantMessage.content
              }
            ])
          setMessages(prev => [...prev, assistantMessage])
          await refreshSessions()
        } catch (error: any) {
          console.error("Erro ao salvar mensagens:", error)
        }
      }

      setFurtivePrompt(null)

    } catch (error: any) {
      console.error("Chat error:", error)
    } finally {
      setIsThinking(false)
    }
  }

  const showWelcomeScreen = !sessionId || (messages.length === 1 && messages[0].role === 'assistant' && 
    messages[0].content === 'Olá! Como posso ajudar você hoje?')

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <BackButton />
      <Watermark />
      {authStatus === 'anonymous' && (
        <AuthBanner remainingInteractions={remainingInteractions} />
      )}
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden h-full pt-16">
          <ChatMessages messages={messages} isThinking={isThinking} />
          <div className="px-4">
            <PromptSuggestionCards
              prompts={themePrompts || []}
              onSelect={handlePromptCardSelect}
              loading={isThemePromptsLoading}
            />
          </div>
          <ChatInput 
            onSendMessage={handleSendMessage} 
            furtivePromptTitle={furtivePrompt ? furtivePrompt.title : undefined}
            setFurtivePromptCleared={() => setFurtivePrompt(null)}
          />
        </div>
      )}
    </div>
  )
}
