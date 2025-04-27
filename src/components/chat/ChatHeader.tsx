
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { useChatAuth } from "@/hooks/useChatAuth"

export const ChatHeader = ({ mobileMenuButton }: { mobileMenuButton?: React.ReactNode }) => {
  const { authStatus } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="border-b border-pump-gray/20 p-4 flex justify-between items-center sticky top-0 bg-white z-10">
      <div className="flex items-center gap-4">
        {mobileMenuButton && (
          <div className="md:hidden">
            {mobileMenuButton}
          </div>
        )}
        <Link to="/">
          <img 
            src="/uploads/3deeda76-6dea-4dd0-8ef5-586b5ebcee30.png" 
            alt="ChatPump"
            className="h-8"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <UserCardMenu />
        <Link to={homeLink}>
          <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90">
            <Home className="h-5 w-5" />
            <span className="sr-only">Voltar para página inicial</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
