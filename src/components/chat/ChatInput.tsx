import { useState, useEffect } from "react"
import { SendHorizontal } from "lucide-react"
import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useAudioTranscription } from "@/hooks/useAudioTranscription"
import LoadingDots from "./LoadingDots"
import { ImageGeneratorButton } from "./ImageGeneratorButton"

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
  const { toast } = useToast()

  const {
    isRecording,
    isLoading: isAudioLoading,
    error: audioError,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
  } = useAudioTranscription()

  useEffect(() => {
    if (transcript) {
      setMessage((prev) => prev ? prev + " " + transcript : transcript)
      resetTranscript()
    }
  }, [transcript])

  useEffect(() => {
    if (audioError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: audioError,
      })
    }
  }, [audioError, toast])

  useEffect(() => {
    if (furtivePromptTitle && message.trim() === "") {
      setFurtivePromptCleared && setFurtivePromptCleared();
    }
  }, [message]);

  const handleSubmit = async () => {
    if (!message.trim() && !furtivePromptTitle) return

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
          className="w-full resize-none rounded-lg border border-pump-gray/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-28"
          rows={1}
          placeholder="Digite sua mensagem..."
          disabled={isLoading || isAudioLoading}
        />
        {isAudioLoading && (
          <span className="absolute flex items-center gap-1 right-28 text-xs text-gray-500">
            <LoadingDots />
            <span className="ml-1">Transcrevendo...</span>
          </span>
        )}
        <button
          type="button"
          className={`absolute right-12 p-1.5 rounded-full text-pump-purple transition-colors ${isRecording ? 'bg-pump-purple/10' : 'hover:bg-pump-purple/10'} disabled:opacity-50`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading || isAudioLoading}
          aria-label={isRecording ? "Parar gravação" : "Gravar áudio"}
        >
          {isRecording
            ? <MicOff className="w-5 h-5 text-red-500 animate-pulse" />
            : <Mic className="w-5 h-5" />}
        </button>
        <ImageGeneratorButton onImageGenerated={handleImageGenerated} />
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
