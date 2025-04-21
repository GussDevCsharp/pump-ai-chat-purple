import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"

interface BusinessCardProps {
  title: string
  description: string
  prompts: string[]
  gradient: string
  themeName?: string
  themeColor?: string
}

export const BusinessCard = ({ title, description, prompts, gradient, themeName, themeColor }: BusinessCardProps) => {
  const navigate = useNavigate()

  const handleCardClick = async () => {
    // Primeiro, encontrar ou criar o tema
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

  // Extract color from gradient for the badge
  const getBadgeColor = (gradient: string) => {
    if (gradient.includes('purple')) return 'bg-purple-100 text-purple-800';
    if (gradient.includes('green')) return 'bg-green-100 text-green-800';
    if (gradient.includes('blue')) return 'bg-blue-100 text-blue-800';
    if (gradient.includes('orange') || gradient.includes('red')) return 'bg-orange-100 text-orange-800';
    if (gradient.includes('indigo')) return 'bg-indigo-100 text-indigo-800';
    if (gradient.includes('gray')) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  }

  return (
    <Card 
      className="border bg-offwhite shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={`${getBadgeColor(gradient)} font-normal`}>
            <MessageSquare className="h-3 w-3 mr-1" />
            {title}
          </Badge>
        </div>
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        <CardDescription className="text-pump-gray">{description}</CardDescription>
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
          {prompts.map((prompt, index) => (
            <Button 
              key={index} 
              variant="outline" 
              className="w-full justify-start text-gray-700 hover:bg-gray-50 border-gray-200"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
