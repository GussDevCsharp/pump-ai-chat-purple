
import { BusinessCard } from "./BusinessCard"

const businessSectors = [
  {
    title: "Marketing e Vendas",
    description: "Estratégias e conteúdo para sua equipe comercial",
    gradient: "purple",
    themeName: "Marketing",
    themeColor: "#9b87f5",
    themeId: "marketing-theme-id" // You'll need to replace these IDs with actual theme IDs from your database
  },
  {
    title: "Recursos Humanos",
    description: "Gestão de pessoas e desenvolvimento organizacional",
    gradient: "green",
    themeName: "RH",
    themeColor: "#4ADE80",
    themeId: "rh-theme-id"
  },
  {
    title: "Finanças",
    description: "Análise financeira e planejamento estratégico",
    gradient: "blue",
    themeName: "Financeiro",
    themeColor: "#0EA5E9",
    themeId: "financas-theme-id"
  },
  {
    title: "Operações",
    description: "Otimização de processos e gestão operacional",
    gradient: "orange",
    themeName: "Operações",
    themeColor: "#F97316",
    themeId: "operacoes-theme-id"
  },
  {
    title: "Tecnologia",
    description: "Inovação e transformação digital",
    gradient: "indigo",
    themeName: "Tecnologia",
    themeColor: "#6366F1",
    themeId: "tecnologia-theme-id"
  },
  {
    title: "Jurídico",
    description: "Compliance e gestão de contratos",
    gradient: "gray",
    themeName: "Jurídico",
    themeColor: "#6B7280",
    themeId: "juridico-theme-id"
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
