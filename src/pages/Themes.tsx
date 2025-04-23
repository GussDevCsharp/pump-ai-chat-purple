
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { UserCardMenu } from "@/components/common/UserCardMenu";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/common/Header";

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
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white/90 rounded-xl shadow-lg p-9 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div className="w-full md:w-2/3 text-left">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {themes.map((theme) => (
                <Card 
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme.id, theme.name)}
                  className="cursor-pointer hover:shadow-md transition-shadow border-pump-gray/20 bg-white/90 rounded-xl"
                  style={{
                    borderColor: theme.color || undefined
                  }}
                >
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: (theme.color ? theme.color + '20' : '#9b87f520')
                      }}>
                      <span style={{ color: theme.color || '#9b87f5', fontWeight: 600, fontSize: 22 }}>
                        {theme.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{theme.name}</h3>
                      {theme.description && (
                        <p className="text-sm text-pump-gray mt-1">{theme.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
