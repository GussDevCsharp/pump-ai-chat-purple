
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Header } from "@/components/common/Header";
import { ProfileCompletionAlert } from "@/components/common/ProfileCompletionAlert";
import { ThemeSearch } from "@/components/themes/ThemeSearch";
import { PageFooter } from "@/components/common/PageFooter";

export default function Themes() {
  const { themes, isLoading } = useChatThemes();
  const { createSession } = useChatSessions();
  const navigate = useNavigate();

  const handleSelectTheme = async (themeId: string, themeName: string) => {
    const session = await createSession(`Chat sobre ${themeName}`, undefined, undefined, themeId);
    if (session) {
      navigate(`/chat?session=${session.id}&theme=${themeId}`);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex flex-col">
      <ProfileCompletionAlert />
      <Header />
      <main className="w-full px-2 sm:px-4 md:px-8 py-6 flex-1">
        <div className="w-full max-w-4xl mx-auto mt-8">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Escolha um tema para começar
          </h1>
          <ThemeSearch 
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
