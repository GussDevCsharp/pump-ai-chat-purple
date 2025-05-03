
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
              className="flex items-center justify-center w-5 h-5 bg-white dark:bg-gray-800 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700"
              onClick={onCancel}
              title="Cancelar gravação"
              aria-label="Cancelar gravação"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
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
