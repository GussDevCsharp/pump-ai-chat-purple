
import React from "react";
import LoadingDots from "../LoadingDots";
import { History, X } from "lucide-react";

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
              className="flex items-center justify-center w-6 h-6 bg-white dark:bg-gray-800 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700"
              onClick={onCancel}
              title="Cancelar gravação"
              aria-label="Cancelar gravação"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          <div className="h-4 w-24 bg-pump-purple/10 rounded-full overflow-hidden flex items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div 
                key={i}
                className="h-full w-2 mx-px bg-pump-purple rounded-full"
                style={{
                  height: `${Math.min(100, Math.max(30, 30 + audioLevel * 70))}%`,
                  transform: `scaleY(${Math.min(1, Math.max(0.3, 0.3 + (Math.sin(i + Date.now() / 200) + 1) * 0.35 * (audioLevel || 0.4)))})`,
                  transition: 'transform 0.1s ease-in-out'
                }}
              />
            ))}
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
