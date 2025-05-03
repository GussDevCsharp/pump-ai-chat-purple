
import React from "react";
import LoadingDots from "../LoadingDots";
import { AudioWaveform, X } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
  isLoading: boolean;
  isMobile: boolean;
  audioLevel?: number;
  onCancel?: () => void;
}

export const RecordingIndicator = ({ 
  isRecording, 
  isLoading,
  isMobile,
  audioLevel = 0,
  onCancel
}: RecordingIndicatorProps) => {
  if (!isRecording && !isLoading) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {isRecording && (
        <div className="flex items-center gap-2 text-pump-purple">
          {onCancel && (
            <button
              className="flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700"
              onClick={onCancel}
              title="Cancelar gravação"
              aria-label="Cancelar gravação"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          <div className="h-7 min-w-32 bg-pump-purple/10 rounded-full overflow-hidden flex items-center justify-center">
            <div className="flex items-end h-full py-1 space-x-0.5">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i}
                  className="h-full w-0.75 bg-pump-purple rounded-full transform-gpu"
                  style={{
                    height: `${Math.min(100, Math.max(20, 20 + (Math.sin(i / 2 + Date.now() / 150) + 1) * 40 * (audioLevel || 0.3)))}%`,
                    transform: `scaleY(${Math.min(1, Math.max(0.15, 0.15 + (Math.sin(i / 2 + Date.now() / 150) + 1) * 0.425 * (audioLevel || 0.3)))})`,
                    animation: `audio-wave-pulse ${1 + i * 0.08}s infinite ${i * 0.03}s`
                  }}
                />
              ))}
            </div>
          </div>
          <span>{isMobile ? "Gravando..." : "Gravando áudio..."}</span>
        </div>
      )}
      
      {isLoading && (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <LoadingDots />
          <span>{isMobile ? "Processando..." : "Processando áudio..."}</span>
        </div>
      )}
    </div>
  );
};
