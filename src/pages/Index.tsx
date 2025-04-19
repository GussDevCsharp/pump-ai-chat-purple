
import { Dashboard } from "@/components/dashboard/Dashboard"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { useLocation, Navigate } from "react-router-dom"

const Index = () => {
  const location = useLocation()
  const chatState = location.state

  // If accessed directly without state, redirect to dashboard
  if (location.pathname === '/chat' && !chatState) {
    return <Navigate to="/" replace />
  }

  // Show chat interface if we're on /chat route
  if (location.pathname === '/chat') {
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
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{chatState.topic}</h2>
          </header>
          <ChatMessages />
          <ChatInput suggestedPrompts={chatState.prompts} />
        </main>
      </div>
    )
  }

  // Show dashboard on root route
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-pump-gray/20 p-4 bg-white">
        <img 
          src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
          alt="Pump.ia"
          className="h-8"
        />
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default Index
