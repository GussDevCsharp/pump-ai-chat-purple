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
import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function ChatSidebar({ onClose, sidebarVisible }: { onClose?: () => void, sidebarVisible?: boolean }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const { sessions, isLoading, refreshSessions, deleteSession } = useChatSessions()
  const { themes, isLoading: isThemesLoading, refreshThemes } = useChatThemes()
  const { toast } = useToast()
  const { searchTerm, setSearchTerm, groupedSessions } = useFilteredSessions(sessions, themes)
  const isMobile = useIsMobile()
  
  // Estado para controlar a edição de títulos
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [newSessionTitle, setNewSessionTitle] = useState("")

  // Se não for mobile e sidebarVisible é falso, não renderize o sidebar
  const shouldRenderSidebar = isMobile || sidebarVisible !== false

  if (!shouldRenderSidebar) {
    return null
  }

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

  const handleEditSession = (sessionId: string, title: string) => {
    setEditingSessionId(sessionId)
    setNewSessionTitle(title)
  }
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSessionTitle(e.target.value)
  }
  
  const handleSaveEdit = async (sessionId: string) => {
    if (newSessionTitle.trim() !== "") {
      try {
        const { error } = await supabase
          .from('chat_sessions')
          .update({ title: newSessionTitle })
          .eq('id', sessionId)

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Sucesso",
          description: "Título da conversa atualizado."
        })
        setEditingSessionId(null)
        await refreshSessions()
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message
        })
      }
    }
  }
  
  const handleCancelEdit = () => {
    setEditingSessionId(null)
  }
  
  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId)
      toast({
        title: "Sucesso",
        description: "Conversa excluída com sucesso."
      })
      if (sessionId === searchParams.get('session')) {
        navigate('/chat')
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      })
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
                    editingId={editingSessionId}
                    newTitle={newSessionTitle}
                    onTitleChange={handleTitleChange}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onKeyPress={handleKeyPress}
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
