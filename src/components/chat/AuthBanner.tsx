
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AuthBannerProps {
  remainingInteractions: number
}

export const AuthBanner = ({ remainingInteractions }: AuthBannerProps) => {
  const navigate = useNavigate()

  return (
    <div className="bg-blue-50 dark:bg-blue-950 p-3 flex items-center justify-between border-b dark:border-blue-900">
      <div className="flex items-center gap-2">
        <span className="text-sm text-blue-700 dark:text-blue-300">
          Modo visitante: {remainingInteractions} interações restantes hoje
        </span>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        className="text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900"
        onClick={() => navigate('/login')}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Entrar para recursos avançados
      </Button>
    </div>
  )
}
