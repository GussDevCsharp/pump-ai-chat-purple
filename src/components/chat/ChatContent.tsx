
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
  onPromptSelect
}: ChatContentProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full pt-16">
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
