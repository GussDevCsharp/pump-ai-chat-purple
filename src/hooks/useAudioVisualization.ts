
import { useEffect, useState, useRef } from 'react';

// Define a type for the AudioContext to handle browser prefixes
interface WindowWithAudioContext extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export function useAudioVisualization(isRecording: boolean): number {
  const [audioLevel, setAudioLevel] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const smoothedLevelRef = useRef<number>(0);

  useEffect(() => {
    // Clean up function that stops the animation frame
    const stopAnalyzer = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setAudioLevel(0);
      smoothedLevelRef.current = 0;
    };

    if (isRecording && navigator.mediaDevices) {
      // Access the microphone stream
      navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      .then(stream => {
        // Create audio context and analyzer with proper type handling
        const windowWithAudio = window as WindowWithAudioContext;
        const AudioContextClass = window.AudioContext || windowWithAudio.webkitAudioContext;
        
        if (!AudioContextClass) {
          console.error("AudioContext is not supported in this browser");
          return;
        }
        
        const audioContext = new AudioContextClass();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512; // Higher resolution for better visualization
        analyser.smoothingTimeConstant = 0.8; // More smoothing for natural movement
        
        // Connect the microphone stream to the analyzer
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Function to update the visualization
        const updateVisualization = () => {
          if (!isRecording) {
            stopAnalyzer();
            return;
          }
          
          if (analyserRef.current && dataArrayRef.current) {
            // Get frequency data
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            
            // Calculate average volume level focusing on the human voice range (approximately 300Hz-3400Hz)
            // This gives us a better representation of speech
            const voiceRangeStart = Math.floor(300 * bufferLength / (audioContext.sampleRate / 2));
            const voiceRangeEnd = Math.min(
              Math.floor(3400 * bufferLength / (audioContext.sampleRate / 2)),
              bufferLength
            );
            
            let sum = 0;
            let count = 0;
            
            for (let i = voiceRangeStart; i < voiceRangeEnd; i++) {
              sum += dataArrayRef.current[i];
              count++;
            }
            
            // Get the current raw level (0-1)
            const currentLevel = count > 0 ? sum / (count * 255) : 0;
            
            // Apply smoothing for more natural transitions
            smoothedLevelRef.current = smoothedLevelRef.current * 0.85 + currentLevel * 0.15;
            
            // Apply non-linear scaling to better visualize quiet and loud sounds
            // This makes the visualization more dynamic
            const scaledLevel = Math.pow(smoothedLevelRef.current, 0.7);
            
            setAudioLevel(scaledLevel);
          }
          
          // Continue the loop
          animationRef.current = requestAnimationFrame(updateVisualization);
        };
        
        // Start the visualization loop
        updateVisualization();
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
    } else {
      stopAnalyzer();
    }
    
    // Cleanup on unmount or when recording stops
    return stopAnalyzer;
  }, [isRecording]);
  
  return audioLevel;
}
