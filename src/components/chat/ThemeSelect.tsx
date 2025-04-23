
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useChatThemes } from "@/hooks/useChatThemes"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ThemeSelectProps {
  sessionId: string
  currentTheme?: string | null
  onThemeChange?: () => void
}

export const ThemeSelect = ({ sessionId, currentTheme, onThemeChange }: ThemeSelectProps) => {
  const { themes, isLoading } = useChatThemes()
  const { toast } = useToast()
  const [selectedThemeName, setSelectedThemeName] = useState<string | null>(null)

  // Fetch the current theme name when component loads or currentTheme changes
  useEffect(() => {
    const fetchThemeName = async () => {
      if (!currentTheme) {
        setSelectedThemeName(null)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('chat_themes')
          .select('name')
          .eq('id', currentTheme)
          .single()
        
        if (error) throw error
        if (data) {
          setSelectedThemeName(data.name)
        }
      } catch (error) {
        console.error('Error fetching theme name:', error)
      }
    }
    
    fetchThemeName()
  }, [currentTheme])

  const handleSelectTheme = async (themeId: string) => {
    try {
      console.log(`Updating session ${sessionId} with theme_id: ${themeId}`)
      
      const { error } = await supabase
        .from('chat_sessions')
        .update({ theme_id: themeId })
        .eq('id', sessionId)

      if (error) throw error
      
      // Find the theme name for UI feedback
      const selectedTheme = themes.find(t => t.id === themeId)
      if (selectedTheme) {
        setSelectedThemeName(selectedTheme.name)
      }

      toast({
        description: "Tema atualizado com sucesso",
      })

      if (onThemeChange) {
        onThemeChange()
      }
    } catch (error) {
      console.error('Erro ao atualizar tema:', error)
      toast({
        variant: "destructive",
        description: "Erro ao atualizar tema",
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative group">
          <Tag className="h-4 w-4 text-pump-gray group-hover:hidden" />
          <Tag className="h-4 w-4 text-pump-gray hidden group-hover:block" />
          {selectedThemeName && !selectedThemeName.startsWith("group-hover") && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 text-xs px-1 py-0 group-hover:hidden"
            >
              {selectedThemeName}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {isLoading ? (
          <div className="text-center py-2">Carregando...</div>
        ) : themes.length === 0 ? (
          <div className="text-center py-2">Nenhum tema encontrado</div>
        ) : (
          <div className="flex flex-col gap-1">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => handleSelectTheme(theme.id)}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    theme.id === currentTheme ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>{theme.name}</span>
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

