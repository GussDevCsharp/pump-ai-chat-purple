import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useChatThemes } from "@/hooks/useChatThemes";
import { useChatSessions } from "@/hooks/useChatSessions";
import { UserCardMenu } from "@/components/common/UserCardMenu";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

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
      <header className="border-b border-pump-gray/20 p-4 bg-white">
        <div className="container mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
          <UserCardMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 bg-offwhite">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
          <div className="w-full md:w-2/3 text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Central de Controle
            </h1>
            <p className="text-lg text-pump-gray mb-8">
              Gerencie seus temas, chats e configurações de forma centralizada.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleNewChat}
                size="lg"
                className="bg-pump-purple hover:bg-pump-purple/90 text-white"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <Card 
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id, theme.name)}
                className="cursor-pointer hover:shadow-md transition-shadow border-pump-gray/20 bg-transparent"
                style={{
                  borderColor: theme.color || undefined
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: (theme.color ? theme.color + '20' : '#9b87f520')
                      }}>
                      <span style={{ color: theme.color || '#9b87f5', fontWeight: 600, fontSize: 20 }}>
                        {theme.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{theme.name}</h3>
                      {theme.description && (
                        <p className="text-sm text-pump-gray mt-1">{theme.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
