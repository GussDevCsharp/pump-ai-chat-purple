
import { useState, useRef } from "react";
import { Mic, Check } from "lucide-react";

interface VoiceRecordButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const VoiceRecordButton = ({
  isRecording,
  isLoading,
  onStartRecording,
  onStopRecording
}: VoiceRecordButtonProps) => {
  const [isPressHolding, setIsPressHolding] = useState(false);
  const pressTimer = useRef<number | null>(null);

  // Função para iniciar gravação ao pressionar e segurar
  const handlePressStart = () => {
    // Não inicia nova gravação se já estiver gravando
    if (isRecording) return;
    
    // Se o usuário simplesmente clicar rápido, vamos tratar como toggle normal
    pressTimer.current = window.setTimeout(() => {
      setIsPressHolding(true);
      onStartRecording();
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
      onStopRecording();
      setIsPressHolding(false);
    }
  };

  // Função para toggle normal do botão (click rápido)
  const handleVoiceButtonClick = () => {
    // Se o usuário simplesmente clicou (não é um press & hold), fazemos o toggle normal
    if (!isPressHolding) {
      if (isRecording) {
        onStopRecording();
      } else {
        onStartRecording();
      }
    }
  };

  return (
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
  );
};
