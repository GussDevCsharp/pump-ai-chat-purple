
import { useState } from "react"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useSearchParams } from "react-router-dom"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"
import { Watermark } from "../common/Watermark"
import { AuthBanner } from "./AuthBanner"
import { BackButton } from "./BackButton"
import { useChatSession } from "@/hooks/useChatSession"
import { useChatTheme } from "@/hooks/useChatTheme"
import { useChatMessages } from "@/hooks/useChatMessages"
import { ChatContent } from "./ChatContent"
import { useChatSendMessage } from "@/hooks/useChatSendMessage"
import { useIsMobile } from "@/hooks/use-mobile"

export const ChatContainer = () => {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const themeFromUrl = searchParams.get('theme')
  const isMobile = useIsMobile()
  
  const { sessions } = useChatSessions()
  const { authStatus, remainingInteractions } = useChatAuth()
  const currentSession = sessions.find(s => s.id === sessionId)
  
  const sessionThemeId = currentSession?.theme_id ?? themeFromUrl
  
  const { currentThemeId, patternPrompt, themePrompts, isThemePromptsLoading, currentThemeName, currentThemePrompt } = useChatTheme(sessionThemeId)
  const { messages, setMessages, isThinking, setIsThinking, saveLocalMessages } = useChatSession(sessionId)
  
  const {
    furtivePrompt,
    setFurtivePrompt,
    handlePromptCardSelect,
    interpolatePatternPrompt,
    substitutePromptTags
  } = useChatMessages({
    company_name: "Minha Empresa",
    industry: "Tecnologia",
    years: "5",
    focus: "Soluções inovadoras",
  }, async () => {})
  
  // Corrigido para incluir currentThemePrompt
  const { handleSendMessage } = useChatSendMessage({
    sessionId,
    currentThemeId,
    currentThemeName,
    currentThemePrompt, // Adicionado para resolver o erro
    furtivePrompt,
    setFurtivePrompt,
    messages,
    setMessages,
    setIsThinking,
    saveLocalMessages,
    interpolatePatternPrompt,
    substitutePromptTags,
    patternPrompt
  })

  // Modificado: Agora verificamos se temos tema mas não uma sessão específica
  const showWelcomeScreen = !sessionId

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <BackButton isMobile={isMobile} />
      <Watermark />
      {authStatus === 'anonymous' && (
        <AuthBanner remainingInteractions={remainingInteractions} />
      )}
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <ChatContent
          messages={messages}
          isThinking={isThinking}
          showThemePrompts={!!currentThemeId}
          themePrompts={themePrompts}
          isThemePromptsLoading={isThemePromptsLoading}
          onSendMessage={handleSendMessage}
          furtivePromptTitle={furtivePrompt?.title}
          setFurtivePromptCleared={() => setFurtivePrompt(null)}
          onPromptSelect={handlePromptCardSelect}
          currentThemePrompt={currentThemePrompt}
        />
      )}
    </div>
  )
}
