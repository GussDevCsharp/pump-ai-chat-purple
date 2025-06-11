
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  ChartBar, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  Star,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Target
} from "lucide-react"
import { Header } from "@/components/common/Header"

export default function Landing() {
  const businessPrompts = [
    {
      title: "Análise Financeira",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Insights financeiros precisos para decisões estratégicas",
      features: ["Fluxo de caixa", "Projeções", "KPIs", "ROI"]
    },
    {
      title: "Gestão de Pessoas",
      icon: <Users className="w-6 h-6" />,
      description: "Desenvolva sua equipe com estratégias personalizadas",
      features: ["Feedback", "Desenvolvimento", "Cultura", "Performance"]
    },
    {
      title: "Estratégia Comercial",
      icon: <ChartBar className="w-6 h-6" />,
      description: "Acelere suas vendas com táticas comprovadas",
      features: ["Market research", "Vendas", "Preços", "CRM"]
    },
    {
      title: "Gestão Empresarial",
      icon: <Building className="w-6 h-6" />,
      description: "Otimize processos e maximize resultados",
      features: ["Processos", "Governança", "Riscos", "Digital"]
    }
  ]

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Respostas Instantâneas",
      description: "IA especializada que responde em segundos com insights precisos"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Estratégias Personalizadas",
      description: "Soluções adaptadas ao seu setor e tamanho de empresa"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Dados Seguros",
      description: "Máxima segurança e privacidade para suas informações"
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Disponível 24/7",
      description: "Consultoria empresarial disponível a qualquer hora"
    }
  ]

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO, TechStart",
      content: "O ChatPump transformou nossa tomada de decisão. Reduzimos 40% o tempo de planejamento estratégico.",
      rating: 5
    },
    {
      name: "Ana Santos",
      role: "Diretora Financeira, GrowCorp",
      content: "As análises financeiras são precisas e me ajudam a identificar oportunidades rapidamente.",
      rating: 5
    },
    {
      name: "Roberto Lima",
      role: "Founder, StartupXYZ",
      content: "Impressionante como a IA entende nosso contexto e oferece soluções práticas.",
      rating: 5
    }
  ]

  const stats = [
    { number: "10,000+", label: "Empresas Atendidas" },
    { number: "500,000+", label: "Consultas Realizadas" },
    { number: "95%", label: "Satisfação" },
    { number: "24/7", label: "Disponibilidade" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-700 px-4 py-2">
              🚀 A Revolução da IA Empresarial
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme Sua Empresa com
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Obtenha consultoria empresarial instantânea, estratégias personalizadas e insights 
              que aceleram seu crescimento. A IA mais avançada do mercado, especializada em negócios.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/chat" state={{ topic: "Consultoria Empresarial", prompts: businessPrompts[0].features }}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-purple-600 px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que Escolher o ChatPump?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Desenvolvido especificamente para empresas que buscam crescimento acelerado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Categories */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Especialista em Todas as Áreas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              IA treinada nas melhores práticas empresariais mundiais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessPrompts.map((category, index) => (
              <Link 
                key={index}
                to="/chat"
                state={{ topic: category.title, prompts: category.features }}
                className="group"
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 bg-white">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 w-fit group-hover:from-purple-200 group-hover:to-blue-200 transition-all">
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4 group-hover:bg-purple-50 group-hover:text-purple-700"
                    >
                      Explorar Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que Nossos Clientes Dizem
            </h2>
            <p className="text-lg text-gray-600">
              Resultados reais de empresas reais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Revolucionar Sua Empresa?
            </h2>
            <p className="text-lg text-purple-100 mb-8">
              Junte-se a milhares de empresas que já transformaram seus resultados com o ChatPump
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Começar Grátis
                </Button>
              </Link>
              
              <Link to="/business-generator">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
                  Gerar Plano de Negócio
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-purple-200 mt-4">
              ✓ Sem cartão de crédito • ✓ Configuração em 2 minutos • ✓ Suporte 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img 
                src="/img/CHATPUMP.png" 
                alt="ChatPump"
                className="h-12 mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 mb-4">
                A inteligência artificial mais avançada para empresas que buscam crescimento acelerado.
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary">🚀 Inovação</Badge>
                <Badge variant="secondary">🎯 Resultados</Badge>
                <Badge variant="secondary">🔒 Segurança</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/chat" className="hover:text-white">IA Empresarial</Link></li>
                <li><Link to="/business-generator" className="hover:text-white">Gerador de Negócios</Link></li>
                <li><Link to="/themes" className="hover:text-white">Temas</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ChatPump. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
