
import { MessageCircle, Plus, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

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

      {/* User Menu */}
      <div className="border-t border-pump-gray/20 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pump-purple/10 flex items-center justify-center">
              <User className="w-4 h-4 text-pump-purple" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Usuário</span>
              <span className="text-xs text-pump-gray">Empresa</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-pump-gray hover:text-pump-purple">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
