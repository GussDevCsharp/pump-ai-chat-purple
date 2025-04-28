
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-4 left-4 z-20 text-pump-purple dark:text-white hover:text-pump-purple/90 dark:hover:text-white/90"
      onClick={() => navigate('/themes')}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Voltar para temas
    </Button>
  )
}
