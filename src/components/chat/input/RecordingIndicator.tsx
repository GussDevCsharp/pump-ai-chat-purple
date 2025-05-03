
import React from "react";
import LoadingDots from "../LoadingDots";
import { History } from "lucide-react";
import { AudioWaveform } from "lucide-react";

interface RecordingIndicatorProps {
  isRecording: boolean;
  isLoading: boolean;
  isMobile: boolean;
  audioLevel?: number;
}

export const RecordingIndicator = ({ 
  isRecording, 
  isLoading,
  isMobile,
  audioLevel = 0
}: RecordingIndicatorProps) => {
  if (!isRecording && !isLoading) return null;
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {isRecording && (
        <div className="flex items-center gap-2 text-pump-purple">
          <AudioWaveform className="w-4 h-4" />
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
