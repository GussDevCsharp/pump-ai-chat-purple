
import { ChatInput } from "./ChatInput"
import { useIsMobile } from "@/hooks/use-mobile"

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
}

export const WelcomeScreen = ({ onSendMessage }: WelcomeScreenProps) => {
  const isMobile = useIsMobile()
  
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-pump-purple dark:text-white mb-6 sm:mb-8 text-center">
        Vamos transformar sua empresa hoje?
      </h1>
      <div className="w-full">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  )
}
