import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface BusinessCardProps {
  title: string
  description: string
  prompts: string[]
  gradient: string
}

export const BusinessCard = ({ title, description, prompts, gradient }: BusinessCardProps) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate('/chat', { 
      state: { 
        topic: title,
        prompts: prompts
      } 
    })
  }

  return (
    <Card 
      className={`${gradient} border-none text-white hover:scale-105 transition-transform cursor-pointer`}
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-white/90">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {prompts.map((prompt, index) => (
            <Button 
              key={index} 
              variant="secondary" 
              className="w-full justify-start bg-white/10 hover:bg-white/20 text-white"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
