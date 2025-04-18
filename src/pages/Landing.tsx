
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChartBarIcon, MegaphoneIcon, Settings2Icon, FlaskRound } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-pump-gray/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/88c96faa-f875-4c6e-b71c-1389cec6d64e.png" 
            alt="Pump.ia"
            className="h-8"
          />
          <Link to="/login">
            <Button variant="outline" className="text-pump-purple hover:text-pump-purple/90">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Inteligência Artificial para impulsionar sua empresa
          </h1>
          <p className="text-lg text-pump-gray mb-8 max-w-2xl">
            Transforme cada área da sua empresa com soluções de IA personalizadas para suas necessidades específicas.
          </p>
          <div className="flex gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-pump-purple hover:bg-pump-purple/90">
                Começar agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-pump-purple">
              Saiba mais
            </Button>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              {
                icon: <ChartBarIcon className="w-8 h-8 text-pump-purple" />,
                title: "Vendas",
                description: "Automatize análises de mercado e previsões de vendas com IA"
              },
              {
                icon: <MegaphoneIcon className="w-8 h-8 text-pump-purple" />,
                title: "Marketing",
                description: "Otimize campanhas e engajamento com insights baseados em dados"
              },
              {
                icon: <Settings2Icon className="w-8 h-8 text-pump-purple" />,
                title: "Processos",
                description: "Melhore a eficiência operacional com automação inteligente"
              },
              {
                icon: <FlaskRound className="w-8 h-8 text-pump-purple" />,
                title: "Desenvolvimento",
                description: "Acelere a inovação com análise preditiva e sugestões de IA"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-6 text-center rounded-lg border border-pump-gray/20 hover:border-pump-purple/20 hover:bg-pump-purple/5 transition-all"
              >
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-pump-gray">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Por que escolher a Pump.ia?
              </h2>
              <div className="space-y-4">
                {[
                  "Soluções personalizadas para cada setor",
                  "Integração simples com seus sistemas existentes",
                  "Suporte técnico especializado",
                  "Resultados mensuráveis e ROI claro"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pump-purple" />
                    <p className="text-pump-gray">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-pump-gray-light rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Comece sua transformação digital hoje
              </h3>
              <p className="text-pump-gray mb-6">
                Junte-se a dezenas de empresas que já estão usando a Pump.ia para revolucionar seus negócios através da inteligência artificial.
              </p>
              <Link to="/login">
                <Button className="w-full bg-pump-purple hover:bg-pump-purple/90">
                  Agende uma demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
