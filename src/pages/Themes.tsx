
import { useEffect } from "react"
import { useChatThemes } from "@/hooks/useChatThemes" 
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"

export default function Themes() {
  const { themes, isLoading } = useChatThemes()
  const { createSession } = useChatSessions()
  const navigate = useNavigate()

  const handleSelectTheme = async (themeId: string, themeName: string) => {
    const session = await createSession(`Chat sobre ${themeName}`, undefined, undefined, themeId)
    if (session) {
      navigate(`/chat?session=${session.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-pump-gray/20 p-4 bg-white">
        <img 
          src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
          alt="Pump.ia"
          className="h-8"
        />
      </header>
      <main className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Escolha um tema para conversar
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-pump-gray">Carregando temas...</p>
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-pump-gray">Nenhum tema encontrado. Você pode criar um novo tema ou iniciar uma conversa geral.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {themes.map((theme) => (
              <Card 
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id, theme.name)}
                className="cursor-pointer hover:shadow-md transition-shadow border-pump-gray/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: theme.color ? theme.color + '20' : '#9b87f520' }}>
                      <MessageCircle className="w-5 h-5" 
                                     style={{ color: theme.color || '#9b87f5' }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{theme.name}</h3>
                      {theme.description && (
                        <p className="text-sm text-pump-gray mt-1">{theme.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
