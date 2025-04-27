
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { Home, LogIn } from "lucide-react"
import { useChatAuth } from "@/hooks/useChatAuth"

export const Header = () => {
  const { authStatus } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="border-b border-pump-gray/10 bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/uploads/CHATPUMP PNG.png" 
            alt="ChatPump"
            className="h-8 md:h-10"
          />
        </Link>
        <div className="flex items-center gap-2">
          {authStatus === 'authenticated' ? (
            <UserCardMenu />
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-pump-purple hover:text-pump-purple/90 gap-2 rounded-lg hidden md:flex">
                <LogIn className="h-5 w-5" />
                Entrar
              </Button>
              <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90 md:hidden">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link to={homeLink}>
            <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90 rounded-lg">
              <Home className="h-5 w-5" />
              <span className="sr-only">Voltar para página inicial</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
} // Added this closing curly brace
