
import { BusinessCard } from "./BusinessCard"

const businessSectors = [
  {
    title: "Marketing e Vendas",
    description: "Estratégias e conteúdo para sua equipe comercial",
    gradient: "purple",
    prompts: [
      "Criar estratégia de marketing digital",
      "Otimizar funil de vendas",
      "Desenvolver pitch comercial"
    ],
    themeName: "Marketing",
    themeColor: "#9b87f5"
  },
  {
    title: "Recursos Humanos",
    description: "Gestão de pessoas e desenvolvimento organizacional",
    gradient: "green",
    prompts: [
      "Criar descrição de cargo",
      "Desenvolver programa de treinamento",
      "Avaliar desempenho de equipe"
    ],
    themeName: "RH",
    themeColor: "#4ADE80"
  },
  {
    title: "Finanças",
    description: "Análise financeira e planejamento estratégico",
    gradient: "blue",
    prompts: [
      "Análise de viabilidade financeira",
      "Planejamento orçamentário",
      "Gestão de custos"
    ],
    themeName: "Financeiro",
    themeColor: "#0EA5E9"
  },
  {
    title: "Operações",
    description: "Otimização de processos e gestão operacional",
    gradient: "orange",
    prompts: [
      "Mapear processos internos",
      "Otimizar cadeia de suprimentos",
      "Implementar metodologia ágil"
    ],
    themeName: "Operações",
    themeColor: "#F97316"
  },
  {
    title: "Tecnologia",
    description: "Inovação e transformação digital",
    gradient: "indigo",
    prompts: [
      "Planejar transformação digital",
      "Avaliar soluções tecnológicas",
      "Desenvolver arquitetura de sistemas"
    ],
    themeName: "Tecnologia",
    themeColor: "#6366F1"
  },
  {
    title: "Jurídico",
    description: "Compliance e gestão de contratos",
    gradient: "gray",
    prompts: [
      "Análise de contratos",
      "Adequação à LGPD",
      "Gestão de propriedade intelectual"
    ],
    themeName: "Jurídico",
    themeColor: "#6B7280"
  }
]

export const Dashboard = () => {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bem-vindo ao Pump.ia
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessSectors.map((sector, index) => (
          <BusinessCard key={index} {...sector} />
        ))}
      </div>
    </div>
  )
}

