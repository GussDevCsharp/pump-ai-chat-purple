
import { useState, useEffect } from "react"
import { SendHorizontal } from "lucide-react"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAudioTranscription } from "@/hooks/useAudioTranscription"
import LoadingDots from "./LoadingDots"

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

  // Adiciona um callback para enviar automaticamente a transcrição
  const handleTranscriptionComplete = (text: string) => {
    if (text && text.trim() !== "") {
      setMessage(text);
      // Pequeno delay para garantir que a UI foi atualizada com o texto
      setTimeout(() => {
        onSendMessage(text);
        setMessage("");
      }, 100);
    }
  };

  const {
    isRecording,
    isLoading: isAudioLoading,
    error: audioError,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
  } = useAudioTranscription(handleTranscriptionComplete);

  // Limpar o título do prompt furtivo quando a mensagem for vazia
  useEffect(() => {
    if (furtivePromptTitle && message.trim() === "") {
      setFurtivePromptCleared && setFurtivePromptCleared();
    }
  }, [message, furtivePromptTitle, setFurtivePromptCleared]);

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

  // Função para ajustar a altura do textarea conforme o conteúdo
  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Ondas de áudio para visualização
  const AudioWaveform = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-0.5 bg-red-500 rounded-full animate-pulse`}
            style={{
              height: `${8 + Math.random() * 12}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${0.7 + Math.random() * 0.3}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border-t border-pump-gray/20 bg-offwhite dark:bg-[#1A1F2C]">
      {furtivePromptTitle && (
        <div className="mb-2 text-xs text-pump-purple dark:text-white font-medium">
          Tópico selecionado: <b>{furtivePromptTitle}</b>
        </div>
      )}
      
      {audioError && (
        <div className="mb-2 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>Erro: {audioError}</span>
        </div>
      )}
      
      {suggestedPrompts && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-sm text-gray-700 dark:text-white bg-white dark:bg-[#222222] border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#333333]"
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
          onChange={(e) => {
            setMessage(e.target.value);
            autoResizeTextarea(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full resize-none rounded-lg border border-pump-gray/20 dark:border-[#333333] bg-white dark:bg-[#222222] dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-20"
          rows={1}
          placeholder="Digite sua mensagem..."
          disabled={isLoading || isAudioLoading}
          style={{ minHeight: '44px', maxHeight: '150px' }}
        />
        {isRecording && (
          <span className="absolute flex items-center gap-1 right-28 text-xs text-red-500">
            <AudioWaveform />
            <span className="ml-1">Gravando...</span>
          </span>
        )}
        {isAudioLoading && (
          <span className="absolute flex items-center gap-1 right-28 text-xs text-gray-500 dark:text-gray-400">
            <LoadingDots />
            <span className="ml-1">Transcrevendo...</span>
          </span>
        )}
        <button
          type="button"
          className={`absolute right-12 p-1.5 rounded-full transition-colors ${
            isRecording 
              ? 'bg-red-500/10 text-red-500 animate-pulse' 
              : 'text-pump-purple dark:text-white hover:bg-pump-purple/10'
          } disabled:opacity-50`}
          onClick={handleVoiceButtonClick}
          disabled={isLoading}
          aria-label={isRecording ? "Parar gravação" : "Gravar áudio"}
          title={audioError ? "Ocorreu um erro na última transcrição" : undefined}
        >
          {isRecording
            ? <MicOff className="w-5 h-5" />
            : <Mic className="w-5 h-5" />}
        </button>
        <button
          type="button"
          className="absolute right-3 p-1 text-pump-purple dark:text-white hover:text-pump-purple/80 dark:hover:text-white/80 transition-colors disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
