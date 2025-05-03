
import { useState } from "react"
import { useChatAuth } from "./useChatAuth"
import { useChatSessions } from "./useChatSessions"
import { Message } from "./useChatSession"
import { supabase } from "@/integrations/supabase/client"
import { useSearchParams, useLocation } from "react-router-dom"

interface UseChatSendMessageProps {
  sessionId: string | null
  currentThemeId: string | null
  currentThemeName: string | null
  furtivePrompt: { text: string; title: string } | null
  setFurtivePrompt: (prompt: { text: string; title: string } | null) => void
  messages: Message[]
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
  setIsThinking: (isThinking: boolean) => void
  saveLocalMessages: (sessionId: string, messages: Message[]) => void
  interpolatePatternPrompt: (pattern: string, userQuery: string, business: Record<string, string>, themeTitle?: string) => string
  substitutePromptTags: (prompt: string, business: Record<string, string>, themeTitle?: string) => string
  patternPrompt: { pattern_prompt?: string } | null
}

export const useChatSendMessage = ({
  sessionId,
  currentThemeId,
  currentThemeName,
  furtivePrompt,
  setFurtivePrompt,
  messages,
  setMessages,
  setIsThinking,
  saveLocalMessages,
  interpolatePatternPrompt,
  substitutePromptTags,
  patternPrompt
}: UseChatSendMessageProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { sessions, createSession, refreshSessions } = useChatSessions()
  const { authStatus, recordInteraction, user } = useChatAuth()
  const location = useLocation();
  const isChatRoute = location.pathname === "/chat";
  
  const businessData = {
    company_name: "Minha Empresa",
    industry: "Tecnologia",
    years: "5",
    focus: "Soluções inovadoras",
  }

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
          aiMessageToSend = substitutePromptTags(furtivePromptSnapshot.text, businessData, currentThemeName)
        } else {
          aiMessageToSend =
            substitutePromptTags(furtivePromptSnapshot.text, businessData, currentThemeName) +
            " " +
            content
        }
      } else if (patternPrompt?.pattern_prompt) {
        aiMessageToSend = interpolatePatternPrompt(
          patternPrompt.pattern_prompt,
          content,
          businessData,
          currentThemeName
        )
      }

      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: aiMessageToSend,
          themeId: currentThemeId,
          userEmail: user?.email,
          sessionId: currentSessionId
        }),
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

    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsThinking(false)
    }
  }

  return { handleSendMessage, businessData }
}
