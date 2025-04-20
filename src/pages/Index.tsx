
import { useState, useEffect } from "react"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ApiKeyDisplay } from "@/components/chat/ApiKeyDisplay"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useLocation, useSearchParams, Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface Message {
  role: 'assistant' | 'user'
  content: string
}

const Index = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const chatState = location.state
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const { createSession, refreshSessions, sessions } = useChatSessions()
  
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
  
  const handleSendMessage = async (content: string) => {
    try {
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])

      setIsThinking(true)

      let currentSessionId = sessionId
      
      // If no session ID exists, create a new session
      if (!currentSessionId) {
        // Generate default title from first message
        const defaultTitle = content.split(' ').slice(0, 5).join(' ').slice(0, 30)
        
        // Create session in database
        const session = await createSession(
          defaultTitle,
          chatState?.theme,
          chatState?.title
        )
        
        if (!session) throw new Error("Failed to create chat session")
        
        currentSessionId = session.id
        
        // Update URL with session ID
        setSearchParams(prev => {
          prev.set('session', currentSessionId!)
          return prev
        })
      }

      // First API call to get the main response
      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || 'Failed to connect to service')
      }

      const data = await response.json()
      
      if (!data.choices || data.choices.length === 0) {
        console.error("Invalid response format:", data)
        throw new Error('Invalid response format from AI service')
      }
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      }

      // Second API call to generate a title
      const titleResponse = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Based on this conversation:\nUser: ${content}\nAssistant: ${assistantMessage.content}\n\nGenerate a very concise title (maximum 40 characters) that captures the main topic or question.`
        }),
      })

      if (!titleResponse.ok) throw new Error('Failed to generate title')
      const titleData = await titleResponse.json()

      if (titleData.choices && titleData.choices.length > 0) {
        const suggestedTitle = titleData.choices[0].message.content
          .replace(/["']/g, '') // Remove quotes if present
          .trim()
          .slice(0, 40) // Ensure max length

        // Update session title
        await supabase
          .from('chat_sessions')
          .update({ title: suggestedTitle })
          .eq('id', currentSessionId)
      }

      // Save messages to database
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
        
        // Refresh sessions list to show the new/updated session
        await refreshSessions()
      } catch (error: any) {
        console.error("Error saving messages:", error)
        throw new Error(`Failed to save messages: ${error.message}`)
      }
    } catch (error: any) {
      console.error("Chat error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to get response: ${error.message}`
      })
    } finally {
      setIsThinking(false)
    }
  }

  if (location.pathname === '/chat') {
    const showWelcomeScreen = messages.length === 1 && messages[0].role === 'assistant' && 
      messages[0].content === 'Olá! Como posso ajudar você hoje?'

    return (
      <div className="flex h-screen bg-white">
        <ChatSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-pump-gray/20 p-4 flex justify-between items-center">
            <img 
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
              alt="Pump.ia"
              className="h-8"
            />
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-pump-purple hover:text-pump-purple/90">
                <Home className="h-5 w-5" />
                <span className="sr-only">Voltar para página inicial</span>
              </Button>
            </Link>
          </header>
          {showWelcomeScreen ? (
            <WelcomeScreen onSendMessage={handleSendMessage} />
          ) : (
            <>
              <ChatMessages messages={messages} isThinking={isThinking} />
              <ChatInput onSendMessage={handleSendMessage} />
              <ApiKeyDisplay />
            </>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-pump-gray/20 p-4 bg-white">
        <img 
          src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
          alt="Pump.ia"
          className="h-8"
        />
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default Index
