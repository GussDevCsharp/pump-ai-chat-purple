
import { Button } from "@/components/ui/button"

interface SuggestedPromptsProps {
  prompts?: string[]
  onSelect: (prompt: string) => void
}

export const SuggestedPrompts = ({ prompts, onSelect }: SuggestedPromptsProps) => {
  if (!prompts || prompts.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {prompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="text-sm text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
}
