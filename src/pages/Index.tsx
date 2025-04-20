
import { useLocation } from "react-router-dom"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Dashboard } from "@/components/dashboard/Dashboard"

const Index = () => {
  const location = useLocation()

  if (location.pathname === '/chat') {
    return <ChatLayout />
  }

  return (
    <div className="min-h-screen bg-white">
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
