
import { Link } from "react-router-dom"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { useChatAuth } from "@/hooks/useChatAuth"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"

export const Header = () => {
  const { authStatus } = useChatAuth();

  return (
    <header className="bg-white dark:bg-[#1A1F2C] border-b border-pump-gray/10 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="\img\CHATPUMP.png" 
            alt="ChatPump"
            className="h-auto w-[240px] max-h-16"
            style={{ background: 'transparent' }}
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {authStatus === 'authenticated' ? (
            <UserCardMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Trial Grátis
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
