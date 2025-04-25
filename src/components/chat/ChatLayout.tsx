
import { ChatSidebar } from "./ChatSidebar"
import { ChatHeader } from "./ChatHeader"
import { ChatContainer } from "./ChatContainer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Menu } from "lucide-react"
import { useChatAuth } from "@/hooks/useChatAuth"

export const ChatLayout = () => {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { authStatus } = useChatAuth()

  return (
    <div className="flex h-screen bg-offwhite relative overflow-hidden">
      {/* Menu mobile só aparece se estiver autenticado */}
      {(isMobile && sidebarOpen && authStatus === "authenticated") && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 max-w-xs bg-white shadow-2xl border-r border-pump-gray/20 h-full animate-slide-in-left">
            <ChatSidebar onClose={() => setSidebarOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/25 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Menu lateral só aparece para usuários autenticados */}
      {!isMobile && authStatus === "authenticated" && (
        <div className="hidden md:block w-64 border-r border-pump-gray/20">
          <ChatSidebar />
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative h-full">
        <div className="sticky top-0 z-30">
          <ChatHeader
            mobileMenuButton={isMobile && authStatus === "authenticated" ? (
              <button
                className="md:hidden p-2 mr-2 rounded hover:bg-pump-gray-light transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-pump-purple" />
              </button>
            ) : null}
          />
        </div>
        <div
          className={`flex-1 flex flex-col overflow-hidden ${
            isMobile && sidebarOpen ? "pointer-events-none opacity-25" : ""
          }`}
        >
          <ChatContainer />
        </div>
      </main>
    </div>
  )
}
