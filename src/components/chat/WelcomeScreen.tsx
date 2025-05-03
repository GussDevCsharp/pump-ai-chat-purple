
import { ChatInput } from "./ChatInput"
import { useIsMobile } from "@/hooks/use-mobile"

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
}

export const WelcomeScreen = ({ onSendMessage }: WelcomeScreenProps) => {
  const isMobile = useIsMobile()
  
  return (
    <div className="flex flex-col items-center justify-between h-full bg-white dark:bg-[#1A1F2C]">
      <div className="flex-1 flex items-center justify-center w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-pump-purple dark:text-white mb-6 sm:mb-8 text-center max-w-md px-4">
          Vamos transformar sua empresa hoje?
        </h1>
      </div>
      <div className="w-full">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  )
}
