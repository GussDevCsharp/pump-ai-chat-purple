import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Building, ChartBar, Users, TrendingUp, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Landing() {
  const businessPrompts = [
    {
      title: "Análise Financeira",
      icon: <TrendingUp className="w-5 h-5" />,
      prompts: ["Análise de fluxo de caixa", "Projeção financeira", "Indicadores KPI"]
    },
    {
      title: "Gestão de Pessoas",
      icon: <Users className="w-5 h-5" />,
      prompts: ["Feedback de desempenho", "Plano de desenvolvimento", "Cultura organizacional"]
    },
    {
      title: "Estratégia Comercial",
      icon: <ChartBar className="w-5 h-5" />,
      prompts: ["Análise de mercado", "Plano de vendas", "Estratégia de preços"]
    },
    {
      title: "Gestão Empresarial",
      icon: <Building className="w-5 h-5" />,
      prompts: ["Processos internos", "Governança corporativa", "Gestão de riscos"]
    }
  ]

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="border-b border-pump-gray/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
          <div className="flex gap-4">
            <Link to="/business-generator">
              <Button variant="outline" className="text-pump-purple hover:text-pump-purple/90">
                Gerar um Negócio
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-pump-purple hover:text-pump-purple/90">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 bg-offwhite">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Inteligência Artificial para Empresas
          </h1>
          <p className="text-lg text-pump-gray mb-8 max-w-2xl mx-auto">
            Transforme sua gestão empresarial com IA especializada em negócios. 
            Obtenha insights valiosos e soluções práticas para sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" state={{ topic: "Consultoria Empresarial", prompts: businessPrompts[0].prompts }}>
              <Button size="lg" className="bg-pump-purple hover:bg-pump-purple/90 gap-2 w-full sm:w-auto">
                <MessageSquare size={18} />
                Consultar IA
              </Button>
            </Link>
            <Link to="/business-generator">
              <Button size="lg" variant="outline" className="bg-white border-pump-purple text-pump-purple hover:bg-pump-purple/10 w-full sm:w-auto">
                Gerar um Negócio
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessPrompts.map((category, index) => (
            <Link 
              key={index}
              to="/chat"
              state={{ topic: category.title, prompts: category.prompts }}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-pump-gray/20 bg-transparent">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-pump-purple/10 text-pump-purple">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <ul className="space-y-2 text-sm text-pump-gray">
                      {category.prompts.map((prompt, idx) => (
                        <li key={idx}>{prompt}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
