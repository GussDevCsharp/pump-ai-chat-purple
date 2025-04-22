
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Building, ChartBar, Users, TrendingUp, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/common/Header"

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

  const companies = [
    {
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1200px-Microsoft_logo_%282012%29.svg.png",
    },
    {
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png",
    }
  ];

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
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

        <section className="mt-24 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Empresas que confiam na nossa IA
            </h2>
            <p className="text-lg text-pump-gray max-w-2xl mx-auto">
              Descubra como empresas estão transformando seus negócios com nossa inteligência artificial
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-70 grayscale">
            {companies.map((company, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-16 max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
