
import { useLocation } from "react-router-dom"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Header } from "@/components/common/Header"

const Index = () => {
  const location = useLocation()

  if (location.pathname === '/chat') {
    return <ChatLayout />;
  }

  return (
    <div className="min-h-screen bg-pump-offwhite">
      <Header />
      <main>
        {/* Dashboard removido */}
      </main>
    </div>
  )
}

export default Index
