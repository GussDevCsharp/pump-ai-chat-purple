import { useState, useEffect } from "react"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { ApiKeyDisplay } from "@/components/chat/ApiKeyDisplay"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useSearchParams, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useThemePrompt } from "@/hooks/useThemePrompt"

const demoPrompts = [
  { title: "Campanha Digital para Lançamento de Produto", tema: "marketing e vendas", tags: ["nome_empresa", "segmento", "tipo_produto", "plataforma_marketing"], prompt: "Crie uma campanha de marketing digital para lançar o produto {{tipo_produto}} da empresa {{nome_empresa}}, que atua no segmento de {{segmento}}. A campanha deve ser focada em atrair novos clientes e aumentar o reconhecimento da marca nas plataformas {{plataforma_marketing}}." },
  { title: "Aumento de Ticket Médio", tema: "marketing e vendas", tags: ["nome_empresa", "segmento", "canal_venda"], prompt: "Sugira estratégias eficazes para aumentar o ticket médio das vendas da empresa {{nome_empresa}}, que atua no segmento {{segmento}}, com foco nas vendas realizadas pelo canal {{canal_venda}}." },
  { title: "Sequência de E-mails para Recuperar Clientes Inativos", tema: "marketing e vendas", tags: ["nome_empresa", "segmento", "tipo_cliente"], prompt: "Crie uma sequência de 3 e-mails para reengajar clientes inativos da empresa {{nome_empresa}}, que trabalha com {{segmento}}, considerando o perfil do público {{tipo_cliente}}." },
  { title: "Conteúdos Virais para TikTok", tema: "marketing e vendas", tags: ["nome_empresa", "produto_principal", "publico_alvo"], prompt: "Sugira 5 ideias de conteúdos virais para TikTok com foco no produto {{produto_principal}} da empresa {{nome_empresa}}, considerando que o público-alvo principal são {{publico_alvo}}." },
  { title: "Roteiro de Abordagem de Vendas pelo WhatsApp", tema: "marketing e vendas", tags: ["nome_empresa", "segmento", "tipo_cliente"], prompt: "Crie um roteiro de abordagem para a equipe de vendas da empresa {{nome_empresa}} utilizar pelo WhatsApp, considerando o segmento {{segmento}} e um perfil de cliente {{tipo_cliente}}." },
  { title: "Chatbot para Atendimento Inicial", tema: "tecnologia", tags: ["nome_empresa", "segmento", "canal_atendimento"], prompt: "Crie um roteiro de chatbot simples para atender clientes no canal {{canal_atendimento}} da empresa {{nome_empresa}}, que atua no setor de {{segmento}}. O bot deve ser simpático, objetivo e captar as primeiras informações do cliente." },
  { title: "Ferramentas de Automação para Pequenas Empresas", tema: "tecnologia", tags: ["nome_empresa", "segmento", "quantidade_colaboradores"], prompt: "Sugira ferramentas acessíveis de automação que a empresa {{nome_empresa}}, com {{quantidade_colaboradores}} colaboradores, pode usar para otimizar processos no segmento de {{segmento}}." },
  { title: "Uso de IA para Previsão de Demanda", tema: "tecnologia", tags: ["nome_empresa", "segmento", "produto_servico"], prompt: "Mostre como a empresa {{nome_empresa}}, do segmento {{segmento}}, pode utilizar inteligência artificial para analisar dados de vendas e prever a demanda do produto/serviço {{produto_servico}}." },
  { title: "Plano de Cibersegurança para Pequenas Empresas", tema: "tecnologia", tags: ["nome_empresa", "segmento"], prompt: "Crie um plano básico de cibersegurança para proteger dados e operações da empresa {{nome_empresa}}, que atua no segmento {{segmento}} e está iniciando sua jornada digital." },
  { title: "Plataformas para Criar Aplicativo de Agendamento", tema: "tecnologia", tags: ["nome_empresa", "tipo_servico"], prompt: "Sugira plataformas e ferramentas acessíveis para que a empresa {{nome_empresa}} crie um aplicativo simples de agendamento de {{tipo_servico}} para seus clientes." },
  { title: "Processo Seletivo para Contratar Vendedores", tema: "recursos humanos", tags: ["nome_empresa", "segmento", "tipo_vaga"], prompt: "Crie um processo seletivo objetivo e eficaz para contratação de {{tipo_vaga}} pela empresa {{nome_empresa}}, que atua no setor de {{segmento}}." },
  { title: "Plano de Cargos e Salários", tema: "recursos humanos", tags: ["nome_empresa", "quantidade_colaboradores", "segmento"], prompt: "Estruture um plano básico de cargos e salários para a empresa {{nome_empresa}}, do segmento {{segmento}}, com até {{quantidade_colaboradores}} colaboradores." },
  { title: "Manual de Boas-Vindas para Novos Colaboradores", tema: "recursos humanos", tags: ["nome_empresa", "cultura_empresa", "segmento"], prompt: "Crie um manual de boas-vindas para novos colaboradores da empresa {{nome_empresa}}, destacando a cultura {{cultura_empresa}} e os principais valores do segmento de {{segmento}}." },
  { title: "Indicadores de RH para Pequenas Empresas", tema: "recursos humanos", tags: ["nome_empresa", "quantidade_colaboradores"], prompt: "Sugira indicadores simples e eficazes para que o setor de RH da empresa {{nome_empresa}}, com {{quantidade_colaboradores}} funcionários, acompanhe a performance da equipe." },
  { title: "Política de Home Office", tema: "recursos humanos", tags: ["nome_empresa", "segmento", "cultura_empresa"], prompt: "Desenvolva uma política prática de home office para a empresa {{nome_empresa}}, do segmento {{segmento}}, levando em consideração uma cultura organizacional {{cultura_empresa}}." },
  { title: "Plano Estratégico de Expansão", tema: "estratégia", tags: ["nome_empresa", "segmento", "tempo_mercado"], prompt: "Desenvolva um plano estratégico de 6 meses para expansão da empresa {{nome_empresa}}, que atua no setor de {{segmento}} e tem {{tempo_mercado}} de mercado." },
  { title: "Objetivos SMART para Crescimento", tema: "estratégia", tags: ["nome_empresa", "meta_principal", "segmento"], prompt: "Crie objetivos SMART para a empresa {{nome_empresa}}, que deseja alcançar a meta de {{meta_principal}} atuando no segmento de {{segmento}}." },
  { title: "Modelo de Negócio Canvas", tema: "estratégia", tags: ["nome_empresa", "segmento"], prompt: "Monte um Business Model Canvas completo para a empresa {{nome_empresa}}, que atua no setor de {{segmento}}." },
  { title: "Matriz BCG para Análise de Produtos", tema: "estratégia", tags: ["nome_empresa", "produtos_principais"], prompt: "Utilize a matriz BCG para analisar os principais produtos da empresa {{nome_empresa}}: {{produtos_principais}}. Classifique os produtos como Estrela, Vaca Leiteira, Abacaxi ou Interrogação e recomende ações." },
  { title: "Análise SWOT Personalizada", tema: "estratégia", tags: ["nome_empresa", "segmento", "mercado_atuacao"], prompt: "Realize uma análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças) personalizada para a empresa {{nome_empresa}}, que atua no setor de {{segmento}} com foco no mercado {{mercado_atuacao}}." }
];

interface Message {
  role: 'assistant' | 'user'
  content: string
}

// Interface para mensagens locais
interface LocalMessage extends Message {
  session_id: string
  created_at: string
}

export const ChatContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session')
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const { createSession, refreshSessions } = useChatSessions()
  const { authStatus, recordInteraction, remainingInteractions } = useChatAuth()

  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThemeId() {
      if (!sessionId) {
        setCurrentThemeId(null);
        return;
      }
      
      // Para sessões locais, verificamos no localStorage
      if (authStatus === 'anonymous') {
        try {
          const localSessions = JSON.parse(localStorage.getItem('anonymous_chat_sessions') || '[]');
          const session = localSessions.find((s: any) => s.id === sessionId);
          setCurrentThemeId(session?.theme_id || null);
        } catch (e) {
          setCurrentThemeId(null);
        }
        return;
      }
      
      // Para sessões no banco
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('theme_id')
        .eq('id', sessionId)
        .maybeSingle();
      if (!error && data && data.theme_id) setCurrentThemeId(data.theme_id);
      else setCurrentThemeId(null);
    }
    fetchThemeId();
  }, [sessionId, authStatus]);

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined);

  const [businessData] = useState({
    company_name: "Minha Empresa",
    industry: "Tecnologia",
    years: "5",
    focus: "Soluções inovadoras",
  });
  
  // Chave para armazenar mensagens locais
  const LOCAL_MESSAGES_KEY = 'anonymous_chat_messages';
  
  // Carregar mensagens locais do localStorage
  const getLocalMessages = (chatSessionId: string): Message[] => {
    try {
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      return allMessages
        .filter((msg: LocalMessage) => msg.session_id === chatSessionId)
        .sort((a: LocalMessage, b: LocalMessage) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((msg: LocalMessage) => ({
          role: msg.role,
          content: msg.content
        }));
    } catch (error) {
      console.error('Error loading local messages:', error);
      return [];
    }
  };
  
  // Salvar mensagens locais no localStorage
  const saveLocalMessages = (sessionId: string, newMessages: Message[]) => {
    try {
      // Pegar todas as mensagens salvas
      const allMessages = JSON.parse(localStorage.getItem(LOCAL_MESSAGES_KEY) || '[]');
      
      // Remover mensagens antigas desta sessão
      const otherSessionsMessages = allMessages.filter(
        (msg: LocalMessage) => msg.session_id !== sessionId
      );
      
      // Adicionar novas mensagens com id da sessão
      const updatedMessages = [
        ...otherSessionsMessages,
        ...newMessages.map((msg) => ({
          ...msg,
          session_id: sessionId,
          created_at: new Date().toISOString()
        }))
      ];
      
      localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving local messages:', error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      if (authStatus === 'anonymous') {
        // Carregar mensagens do localStorage para usuários anônimos
        const localMessages = getLocalMessages(sessionId);
        if (localMessages.length > 0) {
          setMessages(localMessages);
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Olá! Como posso ajudar você hoje?'
          }]);
        }
      } else {
        // Carregar mensagens do banco para usuários autenticados
        loadMessages(sessionId);
      }
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Olá! Como posso ajudar você hoje?'
      }]);
    }
  }, [sessionId, authStatus]);

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      if (data && data.length > 0) {
        const formattedMessages: Message[] = data.map(msg => ({
          role: msg.role as 'assistant' | 'user',
          content: msg.content
        }))
        setMessages(formattedMessages)
      } else {
        setMessages([{
          role: 'assistant',
          content: 'Olá! Como posso ajudar você hoje?'
        }])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat messages"
      })
    }
  }

  const interpolatePatternPrompt = (
    pattern: string,
    userQuery: string,
    business: Record<string, string>
  ) => {
    let filled = pattern;
    for (const key in business) {
      filled = filled.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key]);
    }
    filled = filled.replace(/{{\s*user_query\s*}}/g, userQuery);
    return filled;
  };

  const handleSendMessage = async (content: string) => {
    if (authStatus === 'anonymous' && !recordInteraction()) {
      return;
    }

    try {
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])
      setIsThinking(true)

      let currentSessionId = sessionId
      let isFirstMessage = !currentSessionId

      if (!currentSessionId) {
        const defaultTitle = content.split(' ').slice(0, 5).join(' ') + '...'
        
        const session = await createSession(defaultTitle)
        if (!session) throw new Error("Failed to create chat session")

        currentSessionId = session.id
        setSearchParams(prev => {
          prev.set('session', currentSessionId!)
          return prev
        })
      }

      let aiMessageToSend: string;
      if (patternPrompt?.pattern_prompt) {
        aiMessageToSend = interpolatePatternPrompt(
          patternPrompt.pattern_prompt,
          content,
          businessData
        );
      } else {
        aiMessageToSend = content;
      }

      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiMessageToSend }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to connect to service')
      }

      const data = await response.json()
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Invalid response format from AI service')
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      }

      if (authStatus === 'anonymous') {
        // Salvar mensagens localmente para usuários anônimos
        saveLocalMessages(currentSessionId, [userMessage, assistantMessage]);
        setMessages(prev => [...prev, assistantMessage]);
        await refreshSessions();
      } else if (isFirstMessage) {
        // Salvar a primeira mensagem para usuários autenticados
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: currentSessionId,
                role: 'user',
                content: userMessage.content
              },
              {
                session_id: currentSessionId,
                role: 'assistant',
                content: assistantMessage.content
              }
            ])
        } catch (error: any) {
          console.error("Erro ao salvar a primeira conversa:", error)
        }
        setMessages(prev => [...prev, assistantMessage])
        await refreshSessions()
      } else {
        // Salvar mensagens subsequentes para usuários autenticados
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: currentSessionId,
                role: 'user',
                content: userMessage.content
              },
              {
                session_id: currentSessionId,
                role: 'assistant',
                content: assistantMessage.content
              }
            ])
          setMessages(prev => [...prev, assistantMessage])
          await refreshSessions()
        } catch (error: any) {
          throw new Error(`Failed to save messages: ${error.message}`)
        }
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao obter resposta: ${error.message}`
      })
    } finally {
      setIsThinking(false)
    }
  }

  const showWelcomeScreen = !sessionId || (messages.length === 1 && messages[0].role === 'assistant' && 
    messages[0].content === 'Olá! Como posso ajudar você hoje?')

  useEffect(() => {
    const temasUnicos = Array.from(new Set(demoPrompts.map(p => p.tema)));
    console.log('Temas:', temasUnicos.join(', '));
  }, []);

  const handleStartNewChat = async () => {
    const session = await createSession("Nova conversa");
    if (session) {
      setSearchParams(prev => {
        prev.set("session", session.id);
        return prev;
      }, { replace: true });
      // Limpa mensagens antigas
      setMessages([{
        role: 'assistant',
        content: 'Olá! Como posso ajudar você hoje?'
      }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {authStatus === 'anonymous' && (
        <div className="bg-blue-50 p-3 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-700">
              Modo visitante: {remainingInteractions} interações restantes hoje
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
            onClick={() => navigate('/login')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar para recursos avançados
          </Button>
        </div>
      )}
      
      {authStatus === 'authenticated' && (
        <div className="px-4 pt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={handleStartNewChat}
            className="border-pump-purple text-pump-purple hover:bg-pump-purple/10"
          >
            Novo Chat
          </Button>
        </div>
      )}
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <ChatMessages messages={messages} isThinking={isThinking} />
          <ChatInput onSendMessage={handleSendMessage} />
          <ApiKeyDisplay />
        </div>
      )}
    </div>
  )
}
