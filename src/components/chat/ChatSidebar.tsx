
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatThemes } from "@/hooks/useChatThemes"
import { useFilteredSessions } from "@/hooks/useFilteredSessions"
import { SidebarFooter } from "./sidebar/SidebarFooter"
import { SidebarSessionGroup } from "./sidebar/SidebarSessionGroup"
import { SidebarSearch } from "./sidebar/SidebarSearch"
import { NewChatButton } from "./sidebar/NewChatButton"
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
  const { searchTerm, setSearchTerm, groupedSessions } = useFilteredSessions(sessions, themes)

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

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-pump-gray/20">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <SidebarSearch onSearch={() => {}} />
        </div>
        <NewChatButton onClick={handleCreateNewSession} />
      </SidebarHeader>
      
      <SidebarContent>
        {isLoading ? (
          <div className="p-4 text-pump-gray">Carregando conversas...</div>
        ) : (
          <>
            {Object.entries(groupedSessions)
              .sort((a, b) => {
                const isThemeA = a[0].startsWith('theme-')
                const isThemeB = b[0].startsWith('theme-')
                if (isThemeA && !isThemeB) return -1
                if (!isThemeA && isThemeB) return 1

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
