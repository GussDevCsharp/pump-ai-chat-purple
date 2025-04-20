import { useEffect } from "react"
import { useChatThemes } from "@/hooks/useChatThemes" 
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { 
  MessageCircle, Briefcase, Award, Book, Headphones, Heart, User, Globe, Puzzle, Star, PieChart,
  Lightbulb, Code, Music, Users, ShoppingCart, Target, Activity, Compass, Map, Calendar, Layout
} from "lucide-react"
import { useChatSessions } from "@/hooks/useChatSessions"
import { UserCardMenu } from "@/components/common/UserCardMenu"

function getThemeIcon(themeName: string) {
  const name = themeName.toLowerCase();
  if (name.includes("negócios") || name.includes("empresa") || name.includes("start")) return <Briefcase className="w-5 h-5" />;
  if (name.includes("prêmio") || name.includes("premio") || name.includes("conquista")) return <Award className="w-5 h-5" />;
  if (name.includes("livro") || name.includes("educa") || name.includes("estudo")) return <Book className="w-5 h-5" />;
  if (name.includes("música") || name.includes("musica")) return <Music className="w-5 h-5" />;
  if (name.includes("amor") || name.includes("romance") || name.includes("relaciona")) return <Heart className="w-5 h-5" />;
  if (name.includes("pessoa") || name.includes("perfil")) return <User className="w-5 h-5" />;
  if (name.includes("globo") || name.includes("mundo")) return <Globe className="w-5 h-5" />;
  if (name.includes("puzzle") || name.includes("desafio") || name.includes("jogo")) return <Puzzle className="w-5 h-5" />;
  if (name.includes("estrela") || name.includes("favorito")) return <Star className="w-5 h-5" />;
  if (name.includes("gráfico") || name.includes("dados") || name.includes("análise")) return <PieChart className="w-5 h-5" />;
  if (name.includes("ideia") || name.includes("inovação") || name.includes("inspir")) return <Lightbulb className="w-5 h-5" />;
  if (name.includes("programa") || name.includes("tech") || name.includes("código") || name.includes("codigo")) return <Code className="w-5 h-5" />;
  if (name.includes("equipe") || name.includes("grupo")) return <Users className="w-5 h-5" />;
  if (name.includes("compras") || name.includes("loja") || name.includes("shop")) return <ShoppingCart className="w-5 h-5" />;
  if (name.includes("objetivo") || name.includes("meta")) return <Target className="w-5 h-5" />;
  if (name.includes("atividade") || name.includes("atividade")) return <Activity className="w-5 h-5" />;
  if (name.includes("navega") || name.includes("bússola")) return <Compass className="w-5 h-5" />;
  if (name.includes("mapa") || name.includes("viagem")) return <Map className="w-5 h-5" />;
  if (name.includes("data") || name.includes("calendário")) return <Calendar className="w-5 h-5" />;
  if (name.includes("layout") || name.includes("interface")) return <Layout className="w-5 h-5" />;
  if (name.includes("podcast") || name.includes("áudio") || name.includes("audio")) return <Headphones className="w-5 h-5" />;
  return <MessageCircle className="w-5 h-5" />;
}

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
      <header className="border-b border-pump-gray/20 p-4 px-4 sm:px-8 bg-white relative">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0">
            <UserCardMenu />
          </div>
        </div>
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
                      <span style={{ color: theme.color || '#9b87f5' }}>
                        {getThemeIcon(theme.name)}
                      </span>
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
