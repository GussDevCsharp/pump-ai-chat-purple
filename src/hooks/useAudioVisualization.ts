
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

  useEffect(() => {
    // Clean up function that stops the animation frame
    const stopAnalyzer = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setAudioLevel(0);
    };

    if (isRecording && navigator.mediaDevices) {
      // Access the microphone stream
      navigator.mediaDevices.getUserMedia({ audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } })
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
        analyser.fftSize = 256;
        
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
            
            // Calculate average volume level (0-1)
            const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / 
                          (dataArrayRef.current.length * 255);
            
            setAudioLevel(average);
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
