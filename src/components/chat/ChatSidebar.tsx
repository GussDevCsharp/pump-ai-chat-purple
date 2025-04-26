import { useState, useEffect } from "react"
import { useChatSessions, ChatSession } from "@/hooks/useChatSessions"
import { useChatThemes } from "@/hooks/useChatThemes"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { SidebarSessionGroup } from "./sidebar/SidebarSessionGroup"
import { 
  Menu, 
  Plus, 
  Search,
  ListCollapse 
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar"

export function ChatSidebar({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const { sessions, isLoading, refreshSessions, deleteSession } = useChatSessions()
  const { themes, isLoading: isThemesLoading, refreshThemes } = useChatThemes()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSessions, setFilteredSessions] = useState(sessions)

  const handleCreateNewSession = async () => {
    navigate('/chat')
    if (onClose) {
      onClose()
    }
  }

  const handleSessionClick = (sessionId: string) => {
    navigate(`/chat?session=${sessionId}`)
    if (onClose) {
      onClose()
    }
  }

  const handleEditSession = async (sessionId: string, title: string) => {
    const newTitle = prompt("Enter new title:", title)
    if (newTitle && newTitle !== title) {
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .update({ title: newTitle })
          .eq('id', sessionId)

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

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(sessionId)
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

  // Group sessions by theme first, then by date for themeless sessions
  const groupedSessions = filteredSessions
    ? filteredSessions.reduce((acc: { [key: string]: ChatSession[] }, session: ChatSession) => {
      if (session.theme_id) {
        // If session has a theme, group by theme
        const theme = themes?.find(t => t.id === session.theme_id)
        const themeKey = theme ? `theme-${theme.id}` : 'no-theme'
        if (!acc[themeKey]) {
          acc[themeKey] = []
        }
        acc[themeKey].push(session)
      } else {
        // If no theme, group by date
        const createdAt = new Date(session.created_at)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)

        let dateKey: string
        if (createdAt.toDateString() === today.toDateString()) {
          dateKey = 'today'
        } else if (createdAt.toDateString() === yesterday.toDateString()) {
          dateKey = 'yesterday'
        } else {
          dateKey = createdAt.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        }
        
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(session)
      }
      return acc
    }, {})
    : {}

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-pump-gray/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
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
      </SidebarHeader>
      
      <SidebarContent>
        {isLoading ? (
          <div className="p-4 text-pump-gray">Carregando conversas...</div>
        ) : (
          <>
            {Object.entries(groupedSessions)
              .sort((a, b) => {
                // Sort themes first
                const isThemeA = a[0].startsWith('theme-')
                const isThemeB = b[0].startsWith('theme-')
                if (isThemeA && !isThemeB) return -1
                if (!isThemeA && isThemeB) return 1

                // Then sort dates
                if (a[0] === 'today') return -1
                if (b[0] === 'today') return 1
                if (a[0] === 'yesterday') return -1
                if (b[0] === 'yesterday') return 1
                return new Date(b[0]).getTime() - new Date(a[0]).getTime()
              })
              .map(([groupKey, sessions]) => {
                const isThemeGroup = groupKey.startsWith('theme-')
                const themeId = isThemeGroup ? groupKey.replace('theme-', '') : null
                const theme = themes?.find(t => t.id === themeId)
                
                return (
                  <SidebarSessionGroup
                    key={groupKey}
                    groupId={groupKey}
                    themeObj={theme}
                    sessions={sessions}
                    currentSessionId={sessionId}
                    onOpen={(sessionId) => handleSessionClick(sessionId)}
                    onEdit={(sessionId, title) => handleEditSession(sessionId, title)}
                    onDelete={(sessionId) => handleDeleteSession(sessionId)}
                    onThemeChange={handleThemeChange}
                    title={isThemeGroup ? (theme?.name || 'Sem tema') : groupKey === 'today' ? 'Hoje' : groupKey === 'yesterday' ? 'Ontem' : groupKey}
                  />
                )
              })}
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter />
    </Sidebar>
  )
}
