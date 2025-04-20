import { BusinessCard } from "@/components/dashboard/BusinessCard"
import { UserCard } from "@/components/common/UserCard";

const extendedBusinessSectors = [
  {
    title: "Marketing e Vendas",
    description: "Estratégias e conteúdo para sua equipe comercial",
    gradient: "purple",
    prompts: [
      "Criar estratégia de marketing digital",
      "Otimizar funil de vendas",
      "Desenvolver pitch comercial",
      "Planejar campanha de lançamento",
      "Análise de concorrência"
    ]
  },
  {
    title: "Recursos Humanos",
    description: "Gestão de pessoas e desenvolvimento organizacional",
    gradient: "green",
    prompts: [
      "Criar descrição de cargo",
      "Desenvolver programa de treinamento",
      "Avaliar desempenho de equipe",
      "Plano de carreira",
      "Política de benefícios"
    ]
  },
  {
    title: "Finanças",
    description: "Análise financeira e planejamento estratégico",
    gradient: "blue",
    prompts: [
      "Análise de viabilidade financeira",
      "Planejamento orçamentário",
      "Gestão de custos",
      "Projeção financeira",
      "Indicadores financeiros"
    ]
  },
  {
    title: "Operações",
    description: "Otimização de processos e gestão operacional",
    gradient: "orange",
    prompts: [
      "Mapear processos internos",
      "Otimizar cadeia de suprimentos",
      "Implementar metodologia ágil",
      "Gestão de qualidade",
      "Plano de contingência"
    ]
  },
  {
    title: "Tecnologia",
    description: "Inovação e transformação digital",
    gradient: "indigo",
    prompts: [
      "Planejar transformação digital",
      "Avaliar soluções tecnológicas",
      "Desenvolver arquitetura de sistemas",
      "Segurança da informação",
      "Gestão de dados"
    ]
  },
  {
    title: "Jurídico",
    description: "Compliance e gestão de contratos",
    gradient: "gray",
    prompts: [
      "Análise de contratos",
      "Adequação à LGPD",
      "Gestão de propriedade intelectual",
      "Compliance empresarial",
      "Análise de riscos legais"
    ]
  },
  {
    title: "Estratégia",
    description: "Planejamento e gestão estratégica",
    gradient: "purple",
    prompts: [
      "Desenvolver plano estratégico",
      "Análise SWOT",
      "Definição de KPIs",
      "Gestão de projetos",
      "Plano de expansão"
    ]
  },
  {
    title: "Sustentabilidade",
    description: "ESG e responsabilidade social",
    gradient: "green",
    prompts: [
      "Desenvolver política ESG",
      "Gestão ambiental",
      "Responsabilidade social",
      "Relatório de sustentabilidade",
      "Economia circular"
    ]
  }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-pump-gray/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <UserCard />
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Central de Inteligência Empresarial
          </h1>
          <p className="text-lg text-pump-gray mb-8">
            Explore nossa biblioteca completa de recursos e ferramentas para impulsionar seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {extendedBusinessSectors.map((sector, index) => (
            <BusinessCard key={index} {...sector} />
          ))}
        </div>
      </main>
    </div>
  )
}
