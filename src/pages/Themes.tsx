
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useThemePrompts } from "@/hooks/useThemePrompts";
import React from "react";

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
        flex flex-col h-[370px] bg-white rounded-2xl border-2 border-pump-gray/10 hover:shadow-2xl 
        transform transition-all duration-200 cursor-pointer
        hover:scale-105 shadow-md group
      `}
      style={{
        borderColor: theme.color || "#e9e3fc"
      }}
    >
      <div className="flex flex-col flex-1 justify-between p-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-full"
              style={{
                background: theme.color ? `${theme.color}20` : "#f4ebfd",
              }}
            >
              <span 
                className="font-bold text-2xl"
                style={{
                  color: theme.color || "#7E1CC6"
                }}
              >{theme.name.charAt(0)}</span>
            </div>
            <h3 className="font-bold text-xl text-gray-900">{theme.name}</h3>
          </div>
          {theme.description && (
            <p className="text-center text-base text-pump-gray mt-2 mb-3 px-2 min-h-[42px]">{theme.description}</p>
          )}
        </div>
        {/* Tópicos dos prompts */}
        <div className="flex flex-col gap-1 mt-2 flex-1 justify-end min-h-[93px]">
          {isLoading ? (
            <span className="text-pump-gray text-sm">Carregando tópicos...</span>
          ) : (
            prompts && prompts.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {prompts.map((prompt) => (
                  <li key={prompt.id} className="truncate">{prompt.title}</li>
                ))}
              </ul>
            ) : (
              <span className="text-pump-gray text-sm">Nenhum tópico encontrado</span>
            )
          )}
        </div>
        <div className="flex justify-center mt-4">
          <Button
            size="lg"
            variant="outline"
            className="w-full py-2 px-5 rounded-lg font-semibold border-pump-purple text-pump-purple hover:bg-pump-purple/10 hover:text-pump-purple bg-white transition-all"
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
    <div className="min-h-screen bg-offwhite">
      <Header />
      <main className="w-full px-2 sm:px-4 md:px-8 py-8 flex flex-col items-center">
        <div className="w-full bg-white/90 rounded-2xl shadow-lg p-7 md:p-12 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div className="w-full text-left">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
                Central de Controle
              </h1>
              <p className="text-lg text-pump-gray mb-6">
                Gerencie seus temas, chats e configurações de forma centralizada.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={handleNewChat}
                  size="lg"
                  className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-lg px-7 py-3 text-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Novo Chat
                </Button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-pump-gray">Carregando temas...</p>
            </div>
          ) : themes.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-pump-gray">Nenhum tema encontrado. Você pode criar um novo tema ou iniciar uma conversa geral.</p>
            </div>
          ) : (
            <div className="grid gap-8 
              grid-cols-1
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4
              w-full"
            >
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  onSelect={handleSelectTheme}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
