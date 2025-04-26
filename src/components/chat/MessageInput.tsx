
import { SendHorizontal, Image } from "lucide-react"
import { ImageGeneratorButton } from "./ImageGeneratorButton"
import { AudioRecordingButton } from "./AudioRecordingButton"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface MessageInputProps {
  message: string
  isLoading: boolean
  onMessageChange: (message: string) => void
  onSubmit: () => void
  onImageGenerated: (imageUrl: string) => void
}

export const MessageInput = ({
  message,
  isLoading,
  onMessageChange,
  onSubmit,
  onImageGenerated
}: MessageInputProps) => {
  const [isImageMode, setIsImageMode] = useState(false)

  const handleSubmit = () => {
    if (isImageMode) {
      // Se estiver no modo imagem, adiciona o prefixo para gerar imagem
      const imagePrompt = `Gere uma imagem de: ${message}`
      onMessageChange(imagePrompt)
    }
    onSubmit()
  }

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-2 px-2">
        <Button
          variant={isImageMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsImageMode(!isImageMode)}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          {isImageMode ? "Modo Imagem Ativo" : "Gerar Imagem"}
        </Button>
      </div>

      <div className="relative flex items-center">
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full resize-none rounded-lg border border-pump-gray/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-28"
          rows={1}
          placeholder={isImageMode ? "Descreva a imagem que deseja gerar..." : "Digite sua mensagem..."}
          disabled={isLoading}
        />
        <AudioRecordingButton 
          isLoading={isLoading}
          onTranscriptGenerated={(transcript) => onMessageChange(message ? message + " " + transcript : transcript)}
        />
        <button
          type="button"
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
