
import { useState } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface ChatInputProps {
  suggestedPrompts?: string[]
  onSendMessage: (message: string) => void
}

export const ChatInput = ({ suggestedPrompts, onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!message.trim()) return
    
    try {
      setIsLoading(true)
      onSendMessage(message)
      setMessage("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border-t border-pump-gray/20 bg-white">
      {suggestedPrompts && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => setMessage(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
      
      <div className="relative flex items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full resize-none rounded-lg border border-pump-gray/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-12"
          rows={1}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
        />
        <button 
          className="absolute right-3 p-1 text-pump-purple hover:text-pump-purple/80 transition-colors disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
