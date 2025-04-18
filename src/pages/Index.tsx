
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
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
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
