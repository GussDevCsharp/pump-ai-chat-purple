
import { Button } from "@/components/ui/button"
import { Check, Tag, X } from "lucide-react"
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
  const [open, setOpen] = useState(true)

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
      
      setOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar tema:', error)
      toast({
        variant: "destructive",
        description: "Erro ao atualizar tema",
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Tag className="h-4 w-4 text-pump-purple" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-white">
        <div className="flex justify-between items-center mb-2 pb-1 border-b">
          <span className="text-sm font-medium">Escolher tema</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={() => {
              setOpen(false)
              if (onThemeChange) onThemeChange()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-2">Carregando...</div>
        ) : themes.length === 0 ? (
          <div className="text-center py-2">Nenhum tema encontrado</div>
        ) : (
          <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="ghost"
                className="justify-start gap-2 h-8 px-2"
                onClick={() => handleSelectTheme(theme.id)}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    theme.id === currentTheme ? "opacity-100" : "opacity-0"
                  )}
                />
                <span 
                  className="w-3 h-3 rounded-full inline-block" 
                  style={{ background: theme.color || "#7E1CC6" }}
                />
                <span className="text-sm truncate">{theme.name}</span>
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
