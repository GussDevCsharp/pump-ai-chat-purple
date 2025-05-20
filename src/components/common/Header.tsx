
import { Link } from "react-router-dom"
import { UserCardMenu } from "@/components/common/UserCardMenu"
import { useChatAuth } from "@/hooks/useChatAuth"
import { ThemeToggle } from "@/components/common/ThemeToggle"

export const Header = () => {
  const { authStatus } = useChatAuth();
  const homeLink = authStatus === 'authenticated' ? "/themes" : "/";

  return (
    <header className="bg-background border-b border-pump-gray/10 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="\img\CHATPUMP.png" 
            alt="ChatPump"
            className="h-10 md:h-14"
          />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserCardMenu />
        </div>
      </div>
    </header>
  );
};
