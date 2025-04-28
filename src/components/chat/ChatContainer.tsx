import { useState } from "react"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useSearchParams } from "react-router-dom"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"
import { Watermark } from "../common/Watermark"
import { ChatPrompts } from "./ChatPrompts"
import { AuthBanner } from "./AuthBanner"
import { BackButton } from "./BackButton"
import { useChatSession } from "@/hooks/useChatSession"
import { useChatTheme } from "@/hooks/useChatTheme"
import { useChatMessages } from "@/hooks/useChatMessages"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

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
  const { toast } = useToast()
  
  const { createSession, refreshSessions } = useChatSessions()
  const { authStatus, recordInteraction, remainingInteractions, user } = useChatAuth()
  const { currentThemeId, patternPrompt, themePrompts, isThemePromptsLoading } = useChatTheme(themeFromUrl)
  const { messages, setMessages, isThinking, setIsThinking, saveLocalMessages } = useChatSession(sessionId)
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [apiErrorCount, setApiErrorCount] = useState(0)

  const handleSendMessage = async (content: string) => {
    if (authStatus === 'anonymous' && !recordInteraction()) {
      return
    }

    setErrorMessage(null)

    try {
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])
      setIsThinking(true)

      let currentSessionId = sessionId
      const isFirstMessage = !currentSessionId || !isFirstMessageSent

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

      try {
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
            furtivePrompt: furtivePromptSnapshot,
            isFirstMessage
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Falha na conexão com o serviço')
        }

        const data = await response.json()
        if (!data.choices || data.choices.length === 0) {
          throw new Error('Formato de resposta inválido do serviço de IA')
        }

        const assistantMessage = {
          role: 'assistant' as const,
          content: data.choices[0].message.content
        }

        if (isFirstMessage) {
          setIsFirstMessageSent(true)
        }

        setApiErrorCount(0)

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
      } catch (error: any) {
        console.error("Error calling chat function:", error)
        setApiErrorCount(prev => prev + 1)
        
        if (apiErrorCount > 2) {
          setErrorMessage("Problema na comunicação com o serviço de IA. Entre em contato com o suporte.")
        } else {
          setErrorMessage("Não foi possível obter resposta do assistente. Por favor, tente novamente em instantes.")
        }
        
        setMessages(prev => [...prev])
      }

      setFurtivePrompt(null)

    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsThinking(false)
    }
  }
  
  const {
    furtivePrompt,
    setFurtivePrompt,
    handlePromptCardSelect,
    interpolatePatternPrompt,
    substitutePromptTags
  } = useChatMessages(businessData, handleSendMessage)

  const showWelcomeScreen = !sessionId || (messages.length === 1 && messages[0].role === 'assistant' && 
    messages[0].content === 'Olá! Como posso ajudar você hoje?')

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-offwhite">
      <BackButton />
      <Watermark />
      {authStatus === 'anonymous' && (
        <AuthBanner remainingInteractions={remainingInteractions} />
      )}
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden h-full pt-16">
          {errorMessage && (
            <Alert variant="destructive" className="mx-4 my-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <ChatMessages messages={messages} isThinking={isThinking} />
          <ChatPrompts
            prompts={themePrompts}
            isLoading={isThemePromptsLoading}
            onSelect={handlePromptCardSelect}
          />
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
