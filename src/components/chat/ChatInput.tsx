
import { useState } from "react"
import { SuggestedPrompts } from "./SuggestedPrompts"
import { MessageInput } from "./MessageInput"

interface ChatInputProps {
  suggestedPrompts?: string[]
  onSendMessage: (message: string) => void
  furtivePromptTitle?: string
  setFurtivePromptCleared?: () => void
}

export const ChatInput = ({
  suggestedPrompts,
  onSendMessage,
  furtivePromptTitle,
  setFurtivePromptCleared,
}: ChatInputProps) => {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim() && !furtivePromptTitle) return

    try {
      setIsLoading(true)
      onSendMessage(message)
      setMessage("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage)
    if (furtivePromptTitle && newMessage.trim() === "") {
      setFurtivePromptCleared && setFurtivePromptCleared()
    }
  }

  const handleImageGenerated = (imageUrl: string) => {
    setMessage(prev => {
      const newMessage = prev ? `${prev}\n![Generated Image](${imageUrl})` : `![Generated Image](${imageUrl})`
      onSendMessage(newMessage)
      return ''
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border-t border-pump-gray/20 bg-white">
      {furtivePromptTitle && (
        <div className="mb-2 text-xs text-pump-purple font-medium">
          Tópico selecionado: <b>{furtivePromptTitle}</b>
        </div>
      )}
      <SuggestedPrompts 
        prompts={suggestedPrompts} 
        onSelect={handleMessageChange} 
      />
      <MessageInput 
        message={message}
        isLoading={isLoading}
        onMessageChange={handleMessageChange}
        onSubmit={handleSubmit}
        onImageGenerated={handleImageGenerated}
      />
    </div>
  )
}
