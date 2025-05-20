
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { useChatAuth } from "@/hooks/useChatAuth"

export const ChatHeader = ({ mobileMenuButton }: { mobileMenuButton?: React.ReactNode }) => {
  const { authStatus } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="border-b border-pump-gray/20 p-2 sm:p-4 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1A1F2C] z-10">
      <div className="flex items-center gap-2 sm:gap-4">
        {mobileMenuButton && (
          <div className="md:hidden">
            {mobileMenuButton}
          </div>
        )}
        <Link to="/">
          <img 
            src="\img\CHATPUMP.png" 
            alt="ChatPump"
            className="h-auto w-[150px] sm:w-[180px]"
            style={{ background: 'transparent' }}
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <UserCardMenu />
        <Link to={homeLink}>
          <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90 h-8 w-8 sm:h-10 sm:w-10">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Voltar para página inicial</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
