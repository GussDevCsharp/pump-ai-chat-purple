
import React from "react";
import LoadingDots from "../LoadingDots";
import { History } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
  isLoading: boolean;
  isMobile: boolean;
}

export const RecordingIndicator = ({ 
  isRecording, 
  isLoading,
  isMobile 
}: RecordingIndicatorProps) => {
  if (!isRecording && !isLoading) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {isRecording && (
        <div className="flex items-center gap-2 text-pump-purple animate-pulse">
          <History className="w-4 h-4" />
          <div className="h-1 w-16 bg-pump-purple/30 rounded-full overflow-hidden">
            <div className="h-full bg-pump-purple animate-pulse rounded-full" style={{
              width: '60%',
              animation: 'recording-progress 2s ease-in-out infinite'
            }}/>
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
