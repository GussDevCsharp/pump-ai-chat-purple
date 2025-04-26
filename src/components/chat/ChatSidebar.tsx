
import { useState, useEffect } from "react"
import { useChatSessions, ChatSession } from "@/hooks/useChatSessions"
import { useChatThemes } from "@/hooks/useChatThemes"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SidebarSessionCard } from "./sidebar/SidebarSessionCard"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { SidebarSessionGroup } from "./sidebar/SidebarSessionGroup"
import { Menu, Plus, Search } from "lucide-react"

export function ChatSidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const { sessions, isLoading, refreshSessions, deleteSession } = useChatSessions()
  const { themes, isLoading: isThemesLoading, refreshThemes } = useChatThemes()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[] | null>(null)

  const handleCreateNewSession = async () => {
    navigate('/chat')
    if (onClose) {
      onClose()
    }
  }

  const handleSessionClick = (session: ChatSession) => {
    navigate(`/chat?session=${session.id}`)
    if (onClose) {
      onClose()
    }
  }

  const handleEditSession = async (session: ChatSession) => {
    const newTitle = prompt("Enter new title:", session.title)
    if (newTitle && newTitle !== session.title) {
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .update({ title: newTitle })
          .eq('id', session.id)

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Success",
          description: "Session title updated successfully."
        })
        await refreshSessions()
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        })
      }
    }
  }

  const handleDeleteSession = async (session: ChatSession) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(session.id)
        toast({
          title: "Success",
          description: "Session deleted successfully."
        })
        navigate('/chat')
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message
        })
      }
    }
  }

  const handleThemeChange = async () => {
    await refreshThemes()
    await refreshSessions()
  }

  useEffect(() => {
    if (sessions) {
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase()
        const filtered = sessions.filter(session =>
          session.title.toLowerCase().includes(lowerSearchTerm)
        )
        setFilteredSessions(filtered)
      } else {
        setFilteredSessions(sessions)
      }
    }
  }, [sessions, searchTerm])

  const groupedSessions = filteredSessions
    ? filteredSessions.reduce((acc: { [key: string]: ChatSession[] }, session: ChatSession) => {
      const createdAt = new Date(session.created_at)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)

      let groupKey: string

      if (createdAt.toDateString() === today.toDateString()) {
        groupKey = 'Today'
      } else if (createdAt.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday'
      } else {
        groupKey = createdAt.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      }

      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(session)
      return acc
    }, {})
    : {}

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-pump-gray/20">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {/* Implement sidebar collapse logic */}} 
            className="p-2 hover:bg-pump-gray-light rounded"
          >
            <Menu className="w-5 h-5 text-pump-gray" />
          </button>
          <button 
            className="p-2 hover:bg-pump-gray-light rounded"
          >
            <Search className="w-5 h-5 text-pump-gray" />
          </button>
        </div>
        <button 
          onClick={handleCreateNewSession}
          className="p-2 hover:bg-pump-purple/10 rounded-full"
        >
          <Plus className="w-5 h-5 text-pump-purple" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-pump-gray">Loading sessions...</div>
        ) : (
          <>
            {Object.entries(groupedSessions).sort((a, b) => {
              if (a[0] === 'Today') return -1
              if (b[0] === 'Today') return 1
              if (a[0] === 'Yesterday') return -1
              if (b[0] === 'Yesterday') return 1
              return new Date(b[0]).getTime() - new Date(a[0]).getTime()
            }).map(([group, sessions]) => (
              <div key={group} className="mb-4">
                <div className="px-4 py-2 text-xs font-medium text-pump-gray">
                  {group}
                </div>
                <div className="space-y-1 px-2">
                  {sessions.map((session) => {
                    const themeObj = themes?.find(theme => theme.id === session.theme_id)
                    return (
                      <SidebarSessionCard
                        key={session.id}
                        session={session}
                        themeObj={themeObj}
                        isActive={session.id === sessionId}
                        onOpen={() => handleSessionClick(session)}
                        onEdit={() => handleEditSession(session)}
                        onDelete={() => handleDeleteSession(session)}
                        onThemeChange={handleThemeChange}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      <SidebarFooter />
    </div>
  )
}
