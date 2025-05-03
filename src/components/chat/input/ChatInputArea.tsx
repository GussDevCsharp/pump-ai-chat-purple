
import { useState, useEffect, useRef } from "react";
import { SendHorizontal, AlertCircle } from "lucide-react";
import { useAudioTranscription } from "@/hooks/useAudioTranscription";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceRecordButton } from "./VoiceRecordButton";
import { RecordingIndicator } from "./RecordingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { useAudioVisualization } from "@/hooks/useAudioVisualization";

interface ChatInputAreaProps {
  suggestedPrompts?: string[];
  onSendMessage: (message: string) => void;
  furtivePromptTitle?: string;
  setFurtivePromptCleared?: () => void;
}

export const ChatInputArea = ({
  suggestedPrompts,
  onSendMessage,
  furtivePromptTitle,
  setFurtivePromptCleared,
}: ChatInputAreaProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

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
  } = useAudioTranscription(handleTranscriptionComplete);

  // Handle cancellation of recording
  const handleCancelRecording = () => {
    // Stop recording without transcribing
    if (isRecording) {
      stopRecording();
      // No callback will be processed since we're just canceling
    }
  };

  // Get audio visualization levels
  const audioLevel = useAudioVisualization(isRecording);

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
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para ajustar a altura do textarea com limite máximo fixo
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    // Definimos o limite máximo de altura
    const maxHeight = 150;
    
    // Resetamos temporariamente a altura para calcular o scrollHeight
    textarea.style.height = 'auto';
    
    // Limitamos a altura ao scrollHeight (conteúdo) ou à maxHeight, o que for menor
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // Habilitamos a barra de rolagem apenas se o conteúdo exceder o tamanho máximo
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  // Atualiza a altura do textarea sempre que a mensagem mudar
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [message]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border-t border-pump-gray/20 bg-white dark:bg-[#1A1F2C]">
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
      
      <SuggestedPrompts 
        prompts={suggestedPrompts}
        onSelectPrompt={setMessage}
      />

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
          style={{ minHeight: '44px', maxHeight: '150px' }}
        />
        
        {/* Área de botões abaixo do input - responsiva para mobile */}
        <div className="flex items-center mt-2 gap-2">
          <div className="flex-1">
            {(isRecording || isAudioLoading) && (
              <RecordingIndicator 
                isRecording={isRecording} 
                isLoading={isAudioLoading}
                isMobile={isMobile}
                audioLevel={audioLevel}
                onCancel={isRecording ? handleCancelRecording : undefined}
              />
            )}
          </div>

          <div className="flex gap-2">
            <VoiceRecordButton
              isRecording={isRecording}
              isLoading={isLoading}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
            />
            
            <button
              type="button"
              className="p-2 text-pump-purple dark:text-white hover:text-pump-purple/80 dark:hover:text-white/80 transition-colors disabled:opacity-50"
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
