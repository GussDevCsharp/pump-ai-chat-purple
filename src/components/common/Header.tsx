
import { Link } from "react-router-dom"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { useChatAuth } from "@/hooks/useChatAuth"

export const Header = () => {
  const { authStatus } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="bg-white border-b border-pump-gray/10 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/uploads/chatpump-logo.png" 
            alt="ChatPump"
            className="h-8 md:h-10"
          />
        </Link>
        <UserCardMenu />
      </div>
    </header>
  )
}
