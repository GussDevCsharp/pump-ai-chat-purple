
import { Button } from "@/components/ui/button"
import { Check, Tag } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useChatThemes } from "@/hooks/useChatThemes"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ThemeSelectProps {
  sessionId: string
  currentTheme?: string | null
  onThemeChange?: () => void
}

export const ThemeSelect = ({ sessionId, currentTheme, onThemeChange }: ThemeSelectProps) => {
  const { themes } = useChatThemes()
  const { toast } = useToast()

  const handleSelectTheme = async (themeId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ theme_id: themeId })
        .eq('id', sessionId)

      if (error) throw error

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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Tag className="h-4 w-4 text-pump-gray" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
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
      </PopoverContent>
    </Popover>
  )
}
