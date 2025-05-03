
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useThemePrompts } from "@/hooks/useThemePrompts"

interface BusinessCardProps {
  title: string
  description: string
  gradient: string
  themeName?: string
  themeColor?: string
  themeId?: string
  prompts?: any[]
}

export const BusinessCard = ({ 
  title, 
  description, 
  gradient, 
  themeName, 
  themeColor,
  themeId 
}: BusinessCardProps) => {
  const navigate = useNavigate()
  const { prompts, isLoading } = useThemePrompts(themeId);

  const handleCardClick = async () => {
    const { data: themeData, error: themeError } = await supabase
      .from('chat_themes')
      .select('id')
      .eq('name', title)
      .single()

    let themeId = themeData?.id

    if (!themeData) {
      const { data: newTheme, error: createError } = await supabase
        .from('chat_themes')
        .insert([
          { 
            name: title, 
            description: description,
            color: gradient 
          }
        ])
        .select()
        .single()

      if (createError) {
        console.error('Error creating theme:', createError)
        return
      }
      
      themeId = newTheme.id
    }

    navigate('/chat', { 
      state: { 
        topic: title,
        prompts: prompts,
        themeId: themeId
      } 
    })
  }

  const getBadgeColor = (gradient: string) => {
    if (gradient.includes('purple')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
    if (gradient.includes('green')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
    if (gradient.includes('blue')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
    if (gradient.includes('orange') || gradient.includes('red')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
    if (gradient.includes('indigo')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200';
    if (gradient.includes('gray')) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
  }

  return (
    <Card 
      className="border border-[#E5E5E5] bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer dark:bg-[#1A1F2C] dark:border-white/10"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={getBadgeColor(gradient)}>
            <MessageSquare className="h-3 w-3 mr-1" />
            {title}
          </Badge>
        </div>
        <CardTitle className="text-xl text-gray-900 dark:text-white">{title}</CardTitle>
        <CardDescription className="text-pump-gray dark:text-gray-300">{description}</CardDescription>
        {themeName && (
          <div className="mt-2">
            <span
              className="font-semibold text-sm"
              style={{
                color: themeColor || "#9b87f5"
              }}
            >
              {themeName}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-sm text-pump-gray dark:text-gray-300">Carregando tópicos...</div>
          ) : prompts && prompts.length > 0 ? (
            prompts.map((prompt) => (
              <Button 
                key={prompt.id}
                variant="outline" 
                className="w-full justify-start text-gray-700 hover:bg-gray-50 border-gray-200 
                  dark:text-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
              >
                {prompt.title}
              </Button>
            ))
          ) : (
            <div className="text-sm text-pump-gray dark:text-gray-300">Nenhum tópico encontrado</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
