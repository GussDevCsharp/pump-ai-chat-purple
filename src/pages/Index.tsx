
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSidebar } from "@/components/chat/ChatSidebar"

const Index = () => {
  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        <header className="border-b border-pump-gray/20 p-4">
          <img 
            src="/lovable-uploads/88c96faa-f875-4c6e-b71c-1389cec6d64e.png" 
            alt="Pump.ia"
            className="h-8"
          />
        </header>
        
        <ChatMessages />
        <ChatInput />
      </main>
    </div>
  )
}

export default Index
