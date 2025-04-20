
import { useState, useEffect } from "react"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ApiKeyDisplay } from "@/components/chat/ApiKeyDisplay"
import { useLocation, Navigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import Dashboard from "./Dashboard"

interface Message {
  role: 'assistant' | 'user'
  content: string
}

const Index = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const chatState = location.state
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const { createSession, refreshSessions } = useChatSessions()
  
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
      // Add user message
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])

      // Create session if we don't have one
      let currentSessionId = sessionId
      if (!currentSessionId) {
        const session = await createSession("New Chat")
        if (!session) throw new Error("Failed to create chat session")
        currentSessionId = session.id
        // Update URL with new session ID without reloading
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('session', currentSessionId)
        window.history.pushState({}, '', `${location.pathname}?${newSearchParams}`)
      }

      // Save user message
      if (currentSessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSessionId,
            role: 'user',
            content
          })
      }

      // Get AI response from edge function
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
      
      // Save assistant message
      if (currentSessionId) {
        await supabase
          .from('chat_messages')
          .insert({
            session_id: currentSessionId,
            role: 'assistant',
            content: assistantMessage.content
          })
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Refresh the sessions list to show the new chat
      refreshSessions()
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to get response: ${error.message}`
      })
    }
  }

  // Show chat interface if we're on /chat route
  if (location.pathname === '/chat') {
    return (
      <div className="flex h-screen bg-white">
        <ChatSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-pump-gray/20 p-4">
            <img 
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
              alt="Pump.ia"
              className="h-8"
            />
          </header>
          <ChatMessages messages={messages} />
          <ChatInput 
            suggestedPrompts={chatState?.prompts} 
            onSendMessage={handleSendMessage}
          />
          <ApiKeyDisplay />
        </main>
      </div>
    )
  }

  // Show dashboard on root route
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

