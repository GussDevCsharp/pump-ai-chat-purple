
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

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
            Transforme a maneira como sua empresa opera com nossa IA especializada em soluções empresariais.
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

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
            {[
              {
                icon: <Building2 className="w-8 h-8 text-pump-purple" />,
                title: "Soluções Empresariais",
                description: "IA customizada para as necessidades específicas do seu negócio"
              },
              {
                icon: <Building2 className="w-8 h-8 text-pump-purple" />,
                title: "Integração Simples",
                description: "Implemente nossa IA facilmente em seus processos existentes"
              },
              {
                icon: <Building2 className="w-8 h-8 text-pump-purple" />,
                title: "Suporte Especializado",
                description: "Equipe dedicada para ajudar na implementação e uso"
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-6 text-center">
                {feature.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-pump-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
