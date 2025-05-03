
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseAudioTranscriptionResult {
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  startRecording: () => void;
  stopRecording: (cancelMode?: boolean) => void;
  transcript: string;
  resetTranscript: () => void;
}

export function useAudioTranscription(
  onTranscriptionComplete?: (text: string) => void
): UseAudioTranscriptionResult {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const cancelRef = useRef<boolean>(false);

  const resetTranscript = () => setTranscript("");

  const startRecording = useCallback(async () => {
    setError(null);
    cancelRef.current = false;
    
    try {
      console.log("Solicitando acesso ao microfone...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log("Acesso ao microfone concedido, configurando gravador...");
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Verificamos se a gravação foi cancelada usando nossa referência cancelRef
        if (!cancelRef.current) {
          setIsLoading(true);
          try {
            console.log("Gravação parada, processando áudio...");
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            
            // Converte o áudio gravado em base64 para enviar à função
            const arrayBuffer = await audioBlob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            let binary = '';
            
            // Processar em chunks para evitar problemas de memória
            const chunkSize = 1024;
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.slice(i, Math.min(i + chunkSize, uint8Array.length));
              binary += String.fromCharCode.apply(null, Array.from(chunk));
            }
            
            const base64Audio = btoa(binary);
            console.log(`Áudio convertido para base64, tamanho: ${base64Audio.length}`);

            console.log("Enviando áudio para o serviço de transcrição...");
            const response = await supabase.functions.invoke("voice-to-text", {
              body: { audio: base64Audio }
            });

            if (response.error) {
              throw new Error(response.error.message || "Falha na transcrição do áudio.");
            }
            
            const data = response.data;
            if (data && data.text) {
              console.log("Transcrição recebida:", data.text);
              setTranscript(data.text);
              
              // Chamar o callback apenas se existir texto transcrito e for válido
              if (onTranscriptionComplete && data.text.trim() !== "") {
                console.log("Chamando callback de transcrição completa com texto:", data.text);
                onTranscriptionComplete(data.text);
              } else {
                console.log("Nenhum callback de transcrição chamado: ", 
                  onTranscriptionComplete ? "texto vazio" : "callback não definido");
              }
            } else if (data && data.error) {
              throw new Error(data.error);
            } else {
              throw new Error("Resposta do serviço de transcrição inválida.");
            }
          } catch (err: any) {
            console.error("Erro ao processar áudio:", err);
            let errorMessage = err.message || "Erro ao processar o áudio.";
            
            // Verificar se é um erro relacionado à chave da API
            if (
              errorMessage.includes("OpenAI") && 
              (errorMessage.includes("chave") || errorMessage.includes("API key") || 
               errorMessage.includes("table") || errorMessage.includes("tabela"))
            ) {
              errorMessage = "Chave da API do OpenAI não encontrada ou inválida. Verifique a configuração.";
            }
            
            setError(errorMessage);
          } finally {
            setIsLoading(false);
          }
        } else {
          console.log("Gravação cancelada pelo usuário, áudio descartado.");
          // Resetamos a flag de cancelamento para futuras gravações
          cancelRef.current = false;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Gravação iniciada...");
    } catch (err: any) {
      console.error("Erro ao iniciar gravação:", err);
      setError("Permissão de microfone negada ou dispositivo não suportado.");
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback((cancelMode = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      console.log(cancelMode ? "Cancelando gravação..." : "Parando gravação...");
      
      // Set the cancel flag if we're in cancel mode
      if (cancelMode) {
        cancelRef.current = true;
      }
      
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
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
