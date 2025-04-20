
import { useState } from "react"
import { Dashboard } from "@/components/dashboard/Dashboard"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { useLocation, Navigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  role: 'assistant' | 'user'
  content: string
}

const Index = () => {
  const location = useLocation()
  const chatState = location.state
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Como posso ajudar você hoje?'
    }
  ])
  
  const handleSendMessage = async (content: string) => {
    try {
      // Add user message
      const userMessage = { role: 'user' as const, content }
      setMessages(prev => [...prev, userMessage])

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
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        console.error("Invalid response format:", data);
        throw new Error('Invalid response from AI service');
      }
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao obter resposta: ${error.message}`
      })
    }
  }

  // Show chat interface if we're on /chat route
  if (location.pathname === '/chat') {
    // If accessed directly without state, redirect to dashboard
    if (!chatState) {
      return <Navigate to="/" replace />
    }
    
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
            <h2 className="mt-2 text-lg font-semibold text-gray-900">{chatState.topic}</h2>
          </header>
          <ChatMessages messages={messages} />
          <ChatInput 
            suggestedPrompts={chatState.prompts} 
            onSendMessage={handleSendMessage}
          />
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
