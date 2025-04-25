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
            src="/uploads/logo.png" 
            alt="Pump.ia"
            className="h-8 md:h-10"
          />
        </Link>
        <div className="flex items-center gap-2">
          {authStatus === 'authenticated' ? (
            <UserCardMenu />
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-pump-purple hover:text-pump-purple/90 gap-1.5 md:gap-2 rounded-lg text-sm md:text-base">
                <LogIn className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden sm:inline">Entrar</span>
              </Button>
            </Link>
          )}
          <Link to={homeLink}>
            <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90 rounded-lg">
              <Home className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Voltar para página inicial</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
