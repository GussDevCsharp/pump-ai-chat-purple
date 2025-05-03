
import { useLocation } from "react-router-dom"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Header } from "@/components/common/Header"

const Index = () => {
  const location = useLocation()

  if (location.pathname === '/chat') {
    return <ChatLayout />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1F2C]">
      <Header />
      <main>
        {/* Dashboard removido */}
      </main>
    </div>
  )
}

export default Index
