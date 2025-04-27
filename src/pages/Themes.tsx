
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Header } from "@/components/common/Header";
import { useThemeTopics } from "@/hooks/useThemeTopics";
import { ProfileCompletionAlert } from "@/components/common/ProfileCompletionAlert";
import { ProfileCompletionChart } from "@/components/profile/ProfileCompletionChart";
import { TrendingTopics } from "@/components/themes/TrendingTopics";
import { WelcomeSection } from "@/components/themes/WelcomeSection";
import { ThemeGrid } from "@/components/themes/ThemeGrid";
import { PageFooter } from "@/components/common/PageFooter";

export default function Themes() {
  const { themes, isLoading } = useChatThemes();
  const { createSession } = useChatSessions();
  const navigate = useNavigate();
  const { latestTopics, popularTopics, isLoading: isTopicsLoading } = useThemeTopics();

  const handleSelectTheme = async (themeId: string, themeName: string) => {
    const session = await createSession(`Chat sobre ${themeName}`, undefined, undefined, themeId);
    if (session) {
      navigate(`/chat?session=${session.id}`);
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
      <ProfileCompletionAlert />
      <Header />
      <main className="w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="w-full flex flex-col gap-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                <WelcomeSection onNewChat={handleNewChat} />
              </div>

              {!isTopicsLoading && (
                <TrendingTopics 
                  latestTopics={latestTopics}
                  popularTopics={popularTopics}
                />
              )}

              <ThemeGrid 
                themes={themes}
                onSelectTheme={handleSelectTheme}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <ProfileCompletionChart />
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
