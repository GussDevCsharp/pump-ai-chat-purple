
import { Header } from "@/components/common/Header";
import { PageFooter } from "@/components/common/PageFooter";
import { Watermark } from "@/components/common/Watermark";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-offwhite dark:bg-[#1A1F2C] flex flex-col">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 bg-offwhite dark:bg-[#1A1F2C]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <p className="text-pump-gray-dark dark:text-white/90">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">1. Introdução</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                A ChatPump está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, 
                usamos, divulgamos e protegemos suas informações quando você utiliza nossos serviços de inteligência artificial 
                para negócios ("Serviços").
              </p>
              <p className="text-pump-gray-dark dark:text-white/90 mt-4">
                Por favor, leia esta política cuidadosamente para entender nossas práticas em relação aos seus dados pessoais 
                e como os trataremos. Ao utilizar nossos Serviços, você concorda com as práticas descritas nesta Política de Privacidade.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">2. Informações que Coletamos</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Coletamos os seguintes tipos de informações:
              </p>
              <ul className="list-disc pl-6 mt-3 text-pump-gray-dark dark:text-white/90">
                <li className="mb-2">
                  <strong>Informações da Conta:</strong> Nome, endereço de e-mail, senha e informações de contato.
                </li>
                <li className="mb-2">
                  <strong>Informações do Perfil:</strong> Nome da empresa, setor de atuação, número de funcionários e outras informações comerciais.
                </li>
                <li className="mb-2">
                  <strong>Dados de Uso:</strong> Consultas feitas à IA, interações com o sistema e feedback fornecido.
                </li>
                <li className="mb-2">
                  <strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, dispositivo, sistema operacional e dados de logs.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">3. Como Usamos Suas Informações</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Utilizamos as informações coletadas para:
              </p>
              <ul className="list-disc pl-6 mt-3 text-pump-gray-dark dark:text-white/90">
                <li className="mb-2">Fornecer, manter e melhorar nossos Serviços;</li>
                <li className="mb-2">Personalizar respostas e recomendações da IA;</li>
                <li className="mb-2">Processar transações e enviar notificações relacionadas;</li>
                <li className="mb-2">Analisar tendências e comportamentos de uso para aprimorar a experiência do usuário;</li>
                <li className="mb-2">Proteger contra atividades fraudulentas e melhorar a segurança;</li>
                <li className="mb-2">Comunicar sobre atualizações, ofertas e novos produtos.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Não vendemos seus dados pessoais a terceiros. Podemos compartilhar suas informações com:
              </p>
              <ul className="list-disc pl-6 mt-3 text-pump-gray-dark dark:text-white/90">
                <li className="mb-2">
                  <strong>Provedores de Serviços:</strong> Empresas que nos auxiliam na operação, manutenção e melhoria dos Serviços.
                </li>
                <li className="mb-2">
                  <strong>Parceiros de Negócios:</strong> Para oferecer produtos ou serviços integrados, sempre com seu consentimento.
                </li>
                <li className="mb-2">
                  <strong>Requisitos Legais:</strong> Quando necessário para cumprir obrigações legais ou proteger direitos.
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">5. Segurança de Dados</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não 
                autorizado, divulgação, alteração e destruição. Embora nos esforcemos para utilizar meios comercialmente 
                aceitáveis para proteger seus dados pessoais, não podemos garantir sua segurança absoluta.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">6. Seus Direitos</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Você tem direitos em relação aos seus dados pessoais, incluindo:
              </p>
              <ul className="list-disc pl-6 mt-3 text-pump-gray-dark dark:text-white/90">
                <li className="mb-2">Acessar e receber uma cópia dos seus dados pessoais;</li>
                <li className="mb-2">Corrigir dados imprecisos ou incompletos;</li>
                <li className="mb-2">Excluir seus dados pessoais em determinadas circunstâncias;</li>
                <li className="mb-2">Restringir ou opor-se ao processamento de seus dados pessoais;</li>
                <li className="mb-2">Solicitar a portabilidade de seus dados;</li>
                <li className="mb-2">Retirar seu consentimento a qualquer momento.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">7. Cookies e Tecnologias Similares</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar tráfego e personalizar 
                conteúdo. Você pode configurar seu navegador para recusar cookies, mas isso pode afetar certas funcionalidades 
                dos nossos Serviços.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">8. Alterações a Esta Política</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Podemos atualizar esta Política de Privacidade de tempos em tempos. Notificaremos sobre mudanças significativas 
                por meio de um aviso em nosso site ou por e-mail. Recomendamos que você revise periodicamente esta política para 
                se manter informado sobre como protegemos suas informações.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-4">9. Contato</h2>
              <p className="text-pump-gray-dark dark:text-white/90">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre nossas práticas de privacidade, entre em contato conosco:
              </p>
              <div className="mt-4 text-pump-gray-dark dark:text-white/90">
                <p><strong>E-mail:</strong> privacidade@chatpump.com.br</p>
                <p><strong>Telefone:</strong> (11) 5555-5555</p>
                <p><strong>Endereço:</strong> Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Watermark />
      <PageFooter />
    </div>
  );
}
