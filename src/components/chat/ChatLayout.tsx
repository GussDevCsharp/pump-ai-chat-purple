
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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen bg-offwhite dark:bg-[#1A1F2C] relative overflow-hidden w-full">
        {/* Menu mobile só aparece se estiver autenticado */}
        {(isMobile && sidebarOpen && authStatus === "authenticated") && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-[85%] max-w-xs bg-offwhite dark:bg-[#1A1F2C] shadow-2xl border-r border-pump-gray/20 dark:border-white/10 dark:text-white h-full animate-slide-in-left">
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
              className="md:hidden absolute top-4 left-4 p-2 rounded hover:bg-pump-gray-light dark:hover:bg-white/10 transition z-10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-pump-gray dark:text-white" />
            </button>
          )}
          <div className="flex-1 flex flex-col overflow-hidden h-full bg-offwhite dark:bg-[#1A1F2C] dark:text-white">
            <ChatContainer />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
