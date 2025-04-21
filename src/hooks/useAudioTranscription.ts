
import { useCallback, useRef, useState } from "react";

interface UseAudioTranscriptionResult {
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  transcript: string;
  resetTranscript: () => void;
}

export function useAudioTranscription(): UseAudioTranscriptionResult {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");

  const resetTranscript = () => setTranscript("");

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const arrayBuffer = await audioBlob.arrayBuffer();
          // Converte o áudio gravado em base64 para enviar ao Edge Function
          const uint8Array = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < uint8Array.byteLength; i++) {
            binary += String.fromCharCode(uint8Array[i]);
          }
          const base64Audio = btoa(binary);

          const response = await fetch("/functions/v1/voice-to-text", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              audio: base64Audio,
            }),
          });

          const data = await response.json();
          if (response.ok && data.text) {
            setTranscript(data.text);
          } else {
            setError(data.error || "Falha na transcrição do áudio.");
          }
        } catch (err: any) {
          setError("Erro ao processar o áudio.");
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      setError("Permissão de microfone negada ou não suportado.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  return {
    isRecording,
    isLoading,
    error,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
  };
}
