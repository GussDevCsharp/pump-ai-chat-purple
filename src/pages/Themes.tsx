import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Header } from "@/components/common/Header";
import { useChatAuth } from "@/hooks/useChatAuth";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ThemeGrid } from "@/components/themes/ThemeGrid";
import { PageFooter } from "@/components/common/PageFooter";
import { ThemeSearch } from "@/components/themes/ThemeSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/useTheme";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";

export default function Themes() {
  const { themes, isLoading, searchTerm, handleSearch } = useChatThemes();
  const { createSession } = useChatSessions();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useChatAuth();
  const isMobile = useIsMobile();
  const { isDark } = useTheme();
  const { redirectToProfileIfNeeded } = useProfileNavigation();

  // Check if profile is complete, otherwise redirect to profile completion
  useEffect(() => {
    redirectToProfileIfNeeded(location.pathname);
  }, [redirectToProfileIfNeeded, location.pathname]);

  const handleSelectTheme = async (themeId: string, themeName: string) => {
    const session = await createSession(`Chat sobre ${themeName}`, undefined, undefined, themeId);
    if (session) {
      navigate(`/chat?session=${session.id}&theme=${themeId}`);
    }
  };

  const handleNewChat = async () => {
    const session = await createSession("Nova conversa");
    if(session) {
      navigate(`/chat?session=${session.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite dark:bg-[#1A1F2C] flex flex-col">
      <Header />
      <main className="w-full px-4 md:px-8 py-6 bg-offwhite dark:bg-[#1A1F2C]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2 mb-4 md:mb-0">
              <h2 className="text-xl sm:text-2xl font-medium text-pump-gray dark:text-white">
                Olá, {user?.user_metadata?.full_name || 'Empresário'}
              </h2>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 dark:text-white font-sans">
                Sou a inteligência da sua empresa
              </h1>
              <p className="text-pump-gray dark:text-white/70 text-base sm:text-lg">
                Seu suporte 24 horas personalizado para o seu negócio
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <ThemeSearch onSearch={handleSearch} value={searchTerm} />
              <Button 
                onClick={handleNewChat}
                className={`${isDark ? 'bg-pump-purple hover:bg-pump-purple/90 text-white' : 'bg-white text-pump-gray border border-gray-300 hover:bg-gray-100'} rounded-lg px-5 py-2 transition-all duration-200`}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Novo Chat
              </Button>
            </div>
          </div>

          <ThemeGrid 
            themes={themes}
            onSelectTheme={handleSelectTheme}
            isLoading={isLoading}
          />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
