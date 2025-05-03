
import { useState, useEffect, useRef } from "react"
import { SendHorizontal } from "lucide-react"
import { Mic, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAudioTranscription } from "@/hooks/useAudioTranscription"
import LoadingDots from "./LoadingDots"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const [isPressHolding, setIsPressHolding] = useState(false)
  const pressTimer = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Adiciona um callback para colocar o texto transcrito no input sem envio automático
  const handleTranscriptionComplete = (text: string) => {
    if (text && text.trim() !== "") {
      setMessage(text);
      // Ajustar a altura do textarea após definir a mensagem
      setTimeout(() => {
        if (textareaRef.current) {
          autoResizeTextarea(textareaRef.current);
        }
      }, 10);
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

  const handleSubmit = async (overrideMessage?: string) => {
    const textToSend = overrideMessage || message;
    
    if (!textToSend.trim() && !furtivePromptTitle) return;

    try {
      setIsLoading(true);
      onSendMessage(textToSend);
      setMessage("");
      
      // Resetar altura do textarea após enviar
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para ajustar a altura do textarea conforme o conteúdo
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  // Função para iniciar gravação ao pressionar e segurar
  const handlePressStart = () => {
    // Não inicia nova gravação se já estiver gravando
    if (isRecording) return;
    
    // Se o usuário simplesmente clicar rápido, vamos tratar como toggle normal
    pressTimer.current = window.setTimeout(() => {
      setIsPressHolding(true);
      startRecording();
    }, 300); // Tempo para considerar que é um "press & hold"
  };

  // Função para parar a gravação quando soltar o botão
  const handlePressEnd = () => {
    // Limpar o timer se o botão for solto antes do tempo de segurar
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    // Se estava em modo de pressionar e segurar, para a gravação
    if (isPressHolding) {
      stopRecording();
      setIsPressHolding(false);
    }
  };

  // Função para toggle normal do botão (click rápido)
  const handleVoiceButtonClick = () => {
    // Se o usuário simplesmente clicou (não é um press & hold), fazemos o toggle normal
    if (!isPressHolding) {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  // Limpa o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
      }
    };
  }, []);

  // Atualiza a altura do textarea sempre que a mensagem mudar
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [message]);

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

      <div className="relative flex flex-col">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          className="w-full resize-none rounded-lg border border-pump-gray/20 dark:border-[#333333] bg-white dark:bg-[#222222] dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-4"
          rows={1}
          placeholder="Digite sua mensagem..."
          disabled={isLoading || isAudioLoading}
          style={{ minHeight: '44px', maxHeight: '150px', overflowY: 'auto' }}
        />
        
        {/* Área de botões abaixo do input - responsiva para mobile */}
        <div className="flex justify-end items-center gap-2 mt-2">
          <button
            type="button"
            className={`p-2 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500/10 text-red-500 animate-pulse' 
                : 'text-pump-purple dark:text-white hover:bg-pump-purple/10'
            } disabled:opacity-50`}
            onClick={handleVoiceButtonClick}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={isPressHolding ? handlePressEnd : undefined}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            disabled={isLoading}
            aria-label={isRecording ? "Finalizar gravação" : "Gravar áudio"}
            title={isPressHolding ? "Segurando para gravar" : (isRecording ? "Clique para parar gravação" : "Clique para gravar ou segure para gravar enquanto pressiona")}
          >
            {isRecording
              ? <Check className="w-5 h-5" />
              : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            type="button"
            className="p-2 text-pump-purple dark:text-white hover:text-pump-purple/80 dark:hover:text-white/80 transition-colors disabled:opacity-50"
            onClick={() => handleSubmit()}
            disabled={isLoading}
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </div>
        
        {/* Indicador de gravação abaixo do input */}
        {isRecording && (
          <div className="mt-2 flex items-center gap-2 text-red-500 text-xs animate-pulse">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i}
                  className="animate-audio-wave"
                  style={{
                    width: '2px', 
                    background: 'currentColor',
                    borderRadius: '2px',
                    height: `${5 + Math.sin(i/2) * 10}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <span>{isMobile ? "Gravando..." : "Gravando áudio..."}</span>
          </div>
        )}
        
        {isAudioLoading && (
          <div className="mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
            <LoadingDots />
            <span>{isMobile ? "Processando..." : "Processando áudio..."}</span>
          </div>
        )}
      </div>
    </div>
  )
}
