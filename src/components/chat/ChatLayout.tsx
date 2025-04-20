
import { ChatSidebar } from "./ChatSidebar"
import { ChatHeader } from "./ChatHeader"
import { ChatContainer } from "./ChatContainer"

export const ChatLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader />
        <ChatContainer />
      </main>
    </div>
  )
}
