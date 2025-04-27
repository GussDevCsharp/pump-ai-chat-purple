
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Header } from "@/components/common/Header";
import { useChatAuth } from "@/hooks/useChatAuth";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ThemeGrid } from "@/components/themes/ThemeGrid";
import { PageFooter } from "@/components/common/PageFooter";

export default function Themes() {
  const { themes, isLoading } = useChatThemes();
  const { createSession } = useChatSessions();
  const navigate = useNavigate();
  const { user } = useChatAuth();

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="w-full px-4 md:px-8 py-6 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-medium text-pump-gray">
                Gustavo
              </h2>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 font-sans">
                Sou a inteligência da sua empresa
              </h1>
              <p className="text-pump-gray text-lg">
                Seu suporte 24 horas personalizado para o seu negócio
              </p>
            </div>
            <Button 
              onClick={handleNewChat}
              className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-lg px-5 py-2"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Novo Chat
            </Button>
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

