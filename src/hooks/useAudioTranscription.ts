
import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const resetTranscript = () => setTranscript("");

  const startRecording = useCallback(async () => {
    setError(null);
    
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
            toast({
              title: "Transcrição concluída",
              description: "Áudio transcrito com sucesso.",
            });
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
          toast({
            variant: "destructive",
            title: "Erro",
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Gravação iniciada...");
      
      toast({
        title: "Gravação iniciada",
        description: "Fale agora e pressione o botão novamente para parar.",
      });
    } catch (err: any) {
      console.error("Erro ao iniciar gravação:", err);
      setError("Permissão de microfone negada ou dispositivo não suportado.");
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Permissão de microfone negada ou dispositivo não suportado.",
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      console.log("Parando gravação...");
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
