
import { BusinessCard } from "./BusinessCard"

const businessSectors = [
  {
    title: "Marketing e Vendas",
    description: "Estratégias e conteúdo para sua equipe comercial",
    gradient: "bg-gradient-to-br from-purple-600 to-blue-500",
    prompts: [
      "Criar estratégia de marketing digital",
      "Otimizar funil de vendas",
      "Desenvolver pitch comercial"
    ]
  },
  {
    title: "Recursos Humanos",
    description: "Gestão de pessoas e desenvolvimento organizacional",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-700",
    prompts: [
      "Criar descrição de cargo",
      "Desenvolver programa de treinamento",
      "Avaliar desempenho de equipe"
    ]
  },
  {
    title: "Finanças",
    description: "Análise financeira e planejamento estratégico",
    gradient: "bg-gradient-to-br from-blue-600 to-cyan-500",
    prompts: [
      "Análise de viabilidade financeira",
      "Planejamento orçamentário",
      "Gestão de custos"
    ]
  },
  {
    title: "Operações",
    description: "Otimização de processos e gestão operacional",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    prompts: [
      "Mapear processos internos",
      "Otimizar cadeia de suprimentos",
      "Implementar metodologia ágil"
    ]
  },
  {
    title: "Tecnologia",
    description: "Inovação e transformação digital",
    gradient: "bg-gradient-to-br from-indigo-600 to-purple-600",
    prompts: [
      "Planejar transformação digital",
      "Avaliar soluções tecnológicas",
      "Desenvolver arquitetura de sistemas"
    ]
  },
  {
    title: "Jurídico",
    description: "Compliance e gestão de contratos",
    gradient: "bg-gradient-to-br from-gray-700 to-gray-900",
    prompts: [
      "Análise de contratos",
      "Adequação à LGPD",
      "Gestão de propriedade intelectual"
    ]
  }
]

export const Dashboard = () => {
  return (
    <div className="p-8">
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
