
import { Mic, MicOff } from "lucide-react"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAudioTranscription } from "@/hooks/useAudioTranscription"
import LoadingDots from "./LoadingDots"

interface AudioRecordingButtonProps {
  isLoading: boolean
  onTranscriptGenerated: (transcript: string) => void
}

export const AudioRecordingButton = ({ isLoading, onTranscriptGenerated }: AudioRecordingButtonProps) => {
  const { toast } = useToast()
  const {
    isRecording,
    isLoading: isAudioLoading,
    error: audioError,
    startRecording,
    stopRecording,
    transcript,
    resetTranscript,
  } = useAudioTranscription()

  useEffect(() => {
    if (transcript) {
      onTranscriptGenerated(transcript)
      resetTranscript()
    }
  }, [transcript, onTranscriptGenerated, resetTranscript])

  useEffect(() => {
    if (audioError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: audioError,
      })
    }
  }, [audioError, toast])

  return (
    <>
      <button
        type="button"
        className={`absolute right-12 p-1.5 rounded-full text-pump-purple transition-colors ${isRecording ? 'bg-pump-purple/10' : 'hover:bg-pump-purple/10'} disabled:opacity-50`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading || isAudioLoading}
        aria-label={isRecording ? "Parar gravação" : "Gravar áudio"}
      >
        {isRecording
          ? <MicOff className="w-5 h-5 text-red-500 animate-pulse" />
          : <Mic className="w-5 h-5" />}
      </button>
      {isAudioLoading && (
        <span className="absolute flex items-center gap-1 right-28 text-xs text-gray-500">
          <LoadingDots />
          <span className="ml-1">Transcrevendo...</span>
        </span>
      )}
    </>
  )
}
