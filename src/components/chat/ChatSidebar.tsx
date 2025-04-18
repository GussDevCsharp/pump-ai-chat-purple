
import { MessageCircle, Plus } from "lucide-react"

export const ChatSidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-pump-gray/20 p-4 flex flex-col">
      <button className="w-full flex items-center gap-2 p-3 bg-white hover:bg-pump-gray-light rounded-lg border border-pump-gray/20 transition-colors">
        <Plus className="w-4 h-4 text-pump-gray" />
        <span className="text-sm text-pump-gray font-medium">Novo chat</span>
      </button>
      
      <div className="mt-4 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 p-3 hover:bg-pump-gray-light rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4 text-pump-gray" />
            <span className="text-sm text-pump-gray font-medium truncate">Chat anterior 1</span>
          </button>
          <button className="flex items-center gap-2 p-3 hover:bg-pump-gray-light rounded-lg transition-colors">
            <MessageCircle className="w-4 h-4 text-pump-gray" />
            <span className="text-sm text-pump-gray font-medium truncate">Chat anterior 2</span>
          </button>
        </div>
      </div>
    </div>
  )
}
