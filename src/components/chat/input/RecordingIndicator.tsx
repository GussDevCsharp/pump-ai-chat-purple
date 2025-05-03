
import React from "react";
import LoadingDots from "../LoadingDots";

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
        <div className="flex items-center gap-1 text-red-500 animate-pulse">
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
      
      {isLoading && (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <LoadingDots />
          <span>{isMobile ? "Processando..." : "Processando áudio..."}</span>
        </div>
      )}
    </div>
  );
};
