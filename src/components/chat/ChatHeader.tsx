
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export const ChatHeader = () => {
  return (
    <header className="border-b border-pump-gray/20 p-4 flex justify-between items-center">
      <img 
        src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
        alt="Pump.ia"
        className="h-8"
      />
      <Link to="/">
        <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90">
          <Home className="h-5 w-5" />
          <span className="sr-only">Voltar para página inicial</span>
        </Button>
      </Link>
    </header>
  )
}
