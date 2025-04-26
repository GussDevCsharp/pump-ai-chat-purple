
import { ChatSidebar } from "./ChatSidebar"
import { ChatContainer } from "./ChatContainer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useState } from "react"
import { Menu } from "lucide-react"
import { useChatAuth } from "@/hooks/useChatAuth"
import { SidebarProvider } from "../ui/sidebar"

export const ChatLayout = () => {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { authStatus } = useChatAuth()

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-white relative overflow-hidden w-full">
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
          <ChatSidebar />
        )}

        <main className="flex-1 flex flex-col overflow-hidden relative h-full">
          {isMobile && authStatus === "authenticated" && (
            <button
              className="md:hidden absolute top-4 left-4 p-2 rounded hover:bg-pump-gray-light transition z-10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-pump-purple" />
            </button>
          )}
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <ChatContainer />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
