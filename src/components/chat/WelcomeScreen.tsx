
import { ChatInput } from "./ChatInput"

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void
}

export const WelcomeScreen = ({ onSendMessage }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-pump-purple dark:text-white mb-8 text-center">
        Vamos transformar sua empresa hoje?
      </h1>
      <div className="w-full">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  )
}
