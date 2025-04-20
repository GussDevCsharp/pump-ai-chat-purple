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

interface Message {
  role: 'assistant' | 'user'
  content: string
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
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('theme_id')
        .eq('id', sessionId)
        .maybeSingle();
      if (!error && data && data.theme_id) setCurrentThemeId(data.theme_id);
      else setCurrentThemeId(null);
    }
    fetchThemeId();
  }, [sessionId]);

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined);

  const [businessData] = useState({
    company_name: "Minha Empresa",
    industry: "Tecnologia",
    years: "5",
    focus: "Soluções inovadoras",
  });

  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId)
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Olá! Como posso ajudar você hoje?'
      }])
    }
  }, [sessionId])

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

      if (isFirstMessage) {
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

  return (
    <div className="flex-1 flex flex-col">
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
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <>
          <ChatMessages messages={messages} isThinking={isThinking} />
          <ChatInput onSendMessage={handleSendMessage} />
          <ApiKeyDisplay />
        </>
      )}
    </div>
  )
}
