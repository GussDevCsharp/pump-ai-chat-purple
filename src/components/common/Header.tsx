
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { Home, LogIn } from "lucide-react"
import { useChatAuth } from "@/hooks/useChatAuth"

export const Header = () => {
  const { authStatus, user } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="border-b border-pump-gray/20 p-4 bg-white sticky top-0 z-10 dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-4">
          {authStatus === 'authenticated' ? (
            <UserCardMenu />
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-pump-purple hover:text-pump-purple/90 gap-2">
                <LogIn className="h-5 w-5" />
                Entrar
              </Button>
            </Link>
          )}
          <Link to={homeLink}>
            <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90">
              <Home className="h-5 w-5" />
              <span className="sr-only">Voltar para página inicial</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
