
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  suggestedPrompts?: string[]
}

export const ChatInput = ({ suggestedPrompts }: ChatInputProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 border-t border-pump-gray/20">
      {suggestedPrompts && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="secondary"
              className="text-sm"
              onClick={() => console.log("Selected prompt:", prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
      
      <div className="relative flex items-center">
        <textarea
          className="w-full resize-none rounded-lg border border-pump-gray/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-12"
          rows={1}
          placeholder="Digite sua mensagem..."
        />
        <button className="absolute right-3 p-1 text-pump-purple hover:text-pump-purple/80 transition-colors">
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
