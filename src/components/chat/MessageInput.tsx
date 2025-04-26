
import { SendHorizontal } from "lucide-react"
import { ImageGeneratorButton } from "./ImageGeneratorButton"
import { AudioRecordingButton } from "./AudioRecordingButton"

interface MessageInputProps {
  message: string
  isLoading: boolean
  onMessageChange: (message: string) => void
  onSubmit: () => void
  onImageGenerated: (imageUrl: string) => void
}

export const MessageInput = ({
  message,
  isLoading,
  onMessageChange,
  onSubmit,
  onImageGenerated
}: MessageInputProps) => {
  return (
    <div className="relative flex items-center">
      <textarea
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
        className="w-full resize-none rounded-lg border border-pump-gray/20 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pump-purple/20 pr-28"
        rows={1}
        placeholder="Digite sua mensagem..."
        disabled={isLoading}
      />
      <AudioRecordingButton 
        isLoading={isLoading}
        onTranscriptGenerated={(transcript) => onMessageChange(message ? message + " " + transcript : transcript)}
      />
      <ImageGeneratorButton 
        onImageGenerated={(imageUrl) => {
          const markdown = `![Generated Image](${imageUrl})`
          onMessageChange(message ? `${message}\n${markdown}` : markdown)
          onSubmit()
        }} 
        message={message}
      />
      <button
        type="button"
        className="absolute right-3 p-1 text-pump-purple hover:text-pump-purple/80 transition-colors disabled:opacity-50"
        onClick={onSubmit}
        disabled={isLoading}
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </div>
  )
