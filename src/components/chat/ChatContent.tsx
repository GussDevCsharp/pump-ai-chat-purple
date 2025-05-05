
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatPrompts } from "./ChatPrompts"
import { Message } from "@/hooks/useChatSession"
import { ThemePrompt } from "@/hooks/useThemePrompts"

interface ChatContentProps {
  messages: Message[]
  isThinking: boolean
  showThemePrompts: boolean
  themePrompts: ThemePrompt[]
  isThemePromptsLoading: boolean
  onSendMessage: (content: string) => Promise<void>
  furtivePromptTitle?: string
  setFurtivePromptCleared: () => void
  onPromptSelect: (prompt: ThemePrompt) => void
  currentThemePrompt?: string | null
}

export const ChatContent = ({
  messages,
  isThinking,
  showThemePrompts,
  themePrompts,
  isThemePromptsLoading,
  onSendMessage,
  furtivePromptTitle,
  setFurtivePromptCleared,
  onPromptSelect,
  currentThemePrompt
}: ChatContentProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full pt-16">
      {currentThemePrompt && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-prose mx-auto">
            <div className="text-xs text-gray-500 dark:text-gray-400">Contexto do tema:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{currentThemePrompt}</div>
          </div>
        </div>
      )}
      
      <ChatMessages messages={messages} isThinking={isThinking} />
      
      {showThemePrompts && (
        <ChatPrompts
          prompts={themePrompts}
          isLoading={isThemePromptsLoading}
          onSelect={onPromptSelect}
        />
      )}
      
      <ChatInput 
        onSendMessage={onSendMessage} 
        furtivePromptTitle={furtivePromptTitle}
        setFurtivePromptCleared={setFurtivePromptCleared}
      />
    </div>
  )
}
