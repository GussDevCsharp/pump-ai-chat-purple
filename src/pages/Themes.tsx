import React from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useThemePrompts } from "@/hooks/useThemePrompts";

// Glassmorphism utility (Tailwind + inline style)
const glassClasses = `
  bg-white/30 backdrop-blur-xl border border-white/20 shadow-xl
  transition-all duration-300 hover:shadow-2xl hover:scale-[1.045] hover:border-pump-purple/60
`;

type ThemeCardProps = {
  theme: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
  };
  onSelect: (themeId: string, themeName: string) => void;
};

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const { prompts, isLoading } = useThemePrompts(theme.id);

  return (
    <Card
      onClick={() => onSelect(theme.id, theme.name)}
      className={`
        ${glassClasses}
        flex flex-col h-[360px] rounded-2xl cursor-pointer animate-fade-in
        px-4 py-3 font-sans group select-none
      `}
      style={{
        borderColor: theme.color || "#ece0fd",
        background: "linear-gradient(115deg, #FFFDF3 85%, #ece0fd 100%)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.09)",
      }}
      tabIndex={0}
      aria-label={`Entrar no tema ${theme.name}`}
      role="button"
    >
      <div className="flex flex-col flex-1 justify-between h-full">
        <div>
          <div className="flex items-center gap-3 mb-3 mt-4">
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-full shadow"
              style={{
                background: theme.color ? `${theme.color}15` : "#f5eeff",
              }}
            >
              <span 
                className="font-black text-[2rem] tracking-tight"
                style={{
                  color: theme.color || "#7E1CC6"
                }}
              >{theme.name.charAt(0).toUpperCase()}</span>
            </div>
            <h3
              className="
                font-black text-2xl md:text-[2rem] lg:text-3xl leading-tight
                transition-all duration-300
                text-pump-purple drop-shadow-[0_1.5px_0_rgba(126,28,198,0.10)] font-sans
                group-hover:text-pump-purple/90
                truncate
                "
              style={{
                letterSpacing: "-0.01em",
                textShadow: "0 2px 8px #ECE6FF44"
              }}
            >
              {theme.name}
            </h3>
          </div>
          {theme.description && (
            <p className="text-center text-base text-pump-gray mt-1 mb-2 px-1 min-h-[28px] font-sans font-medium">{theme.description}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-1 flex-1 justify-start min-h-[64px]">
          {isLoading ? (
            <span className="text-pump-gray text-sm font-sans">Carregando tópicos...</span>
          ) : (
            prompts && prompts.length > 0 ? (
              <ul className="list-disc pl-4 text-sm text-gray-700 font-sans">
                {prompts.map((prompt) => (
                  <li key={prompt.id} className="truncate">{prompt.title}</li>
                ))}
              </ul>
            ) : (
              <span className="text-pump-gray text-sm font-sans">Nenhum tópico encontrado</span>
            )
          )}
        </div>
        <div className="flex justify-center mt-3">
          <Button
            size="lg"
            variant="outline"
            className="
              w-full py-2 px-5 rounded-lg font-semibold border-pump-purple text-pump-purple 
              bg-white/80 hover:bg-pump-purple/20 hover:text-pump-purple 
              transition-all font-sans
              ring-0 focus:ring-2 focus:ring-pump-purple/40
              "
            tabIndex={-1}
          >
            Entrar no chat deste tema
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default function Themes() {
  const { themes, isLoading } = useChatThemes();
  const { createSession } = useChatSessions();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-offwhite font-sans">
      <Header />
      <main className="w-full px-2 sm:px-4 md:px-8 py-8 flex flex-col items-center font-sans">
        <div className="
            w-full glass
            rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 flex flex-col gap-10
            max-w-7xl bg-white/60
            border border-white/40
            transition-all duration-300
            ">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-12 mb-8">
            <div className="w-full text-left">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-pump-purple drop-shadow-[0_2px_0_rgba(126,28,198,0.13)] mb-2 font-sans tracking-tighter animate-fade-in">
                Central de Controle
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-7 font-sans animate-fade-in">
                Gerencie seus temas, chats e configurações em um só lugar.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleNewChat}
                  size="lg"
                  className="
                    bg-pump-purple/95 hover:bg-pump-purple text-white rounded-lg px-8 py-3 text-lg font-sans shadow 
                    ring-0 focus:ring-2 focus:ring-pump-purple/50
                    transition-all 
                    "
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Novo Chat
                </Button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-40 font-sans">
              <p className="text-pump-gray text-lg animate-pulse">Carregando temas...</p>
            </div>
          ) : themes.length === 0 ? (
            <div className="text-center p-8 font-sans animate-fade-in">
              <p className="text-pump-gray text-lg">Nenhum tema encontrado. Você pode criar um novo tema ou iniciar uma conversa geral.</p>
            </div>
          ) : (
            <div className="
              grid gap-8 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4
              w-full
              ">
              {themes.map((theme, idx) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    onSelect={handleSelectTheme}
                  />
                ))
              }
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
