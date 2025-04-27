
import { PromptSuggestionCards } from "./PromptSuggestionCards"
import { ThemePrompt } from "@/hooks/useThemePrompts"

interface ChatPromptsProps {
  prompts: ThemePrompt[]
  isLoading: boolean
  onSelect: (prompt: ThemePrompt) => void
}

export const ChatPrompts = ({ prompts, isLoading, onSelect }: ChatPromptsProps) => {
  return (
    <div className="px-4">
      <PromptSuggestionCards
        prompts={prompts || []}
        onSelect={onSelect}
        loading={isLoading}
      />
    </div>
  )
}
