import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { ApiKeyDisplay } from "@/components/chat/ApiKeyDisplay"
import { WelcomeScreen } from "@/components/chat/WelcomeScreen"
import { useToast } from "@/hooks/use-toast"
import { useChatSessions } from "@/hooks/useChatSessions"
import { useChatAuth } from "@/hooks/useChatAuth"
import { useThemePrompt } from "@/hooks/useThemePrompt"
import { useThemePrompts } from "@/hooks/useThemePrompts"
import { Watermark } from "../common/Watermark"
import { PromptSuggestionCards } from "./PromptSuggestionCards"
import { useMessageHandling } from "@/hooks/useMessageHandling"
import { usePromptHandling } from "@/hooks/usePromptHandling"
import { useSessionManagement } from "@/hooks/useSessionManagement"
import { usePromptCardInteractions } from "@/hooks/usePromptCardInteractions"
import { AnonymousUserBanner } from "./AnonymousUserBanner"
import { supabase } from "@/integrations/supabase/client"

export const ChatContainer = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const { toast } = useToast()
  const [isThinking, setIsThinking] = useState(false)
  const { createSession, refreshSessions } = useChatSessions()
  const { authStatus, recordInteraction, remainingInteractions } = useChatAuth()
  const { currentThemeId } = useSessionManagement(sessionId, authStatus)

  const {
    messages,
    setMessages,
    loadMessages,
    saveLocalMessages
  } = useMessageHandling(sessionId, authStatus);

  const {
    furtivePrompt,
    setFurtivePrompt,
    businessData,
    interpolatePatternPrompt,
    substitutePromptTags
  } = usePromptHandling();

  const { patternPrompt } = useThemePrompt(currentThemeId ?? undefined)
  const { prompts: themePrompts, isLoading: isThemePromptsLoading } = useThemePrompts(currentThemeId ?? undefined)
  const { handlePromptCardSelect } = usePromptCardInteractions();

  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId);
    } else {
      setMessages([{
        role: 'assistant',
        content: 'Olá! Como posso ajudar você hoje?'
      }]);
    }
  }, [sessionId, authStatus]);

  const handleSendMessage = async (content: string) => {
    if (authStatus === 'anonymous' && !recordInteraction()) {
      return;
    }
    try {
      const userMessage = { role: 'user' as const, content };
      setMessages(prev => [...prev, userMessage]);
      setIsThinking(true);

      let currentSessionId = sessionId;
      let isFirstMessage = !currentSessionId;

      if (!currentSessionId) {
        const defaultTitle = content.split(' ').slice(0, 5).join(' ') + '...';
        const session = await createSession(defaultTitle);
        if (!session) throw new Error("Failed to create chat session");

        currentSessionId = session.id;
        setSearchParams(prev => {
          prev.set('session', currentSessionId!);
          return prev;
        });
      }

      let aiMessageToSend = content;
      let furtivePromptSnapshot = furtivePrompt;

      if (furtivePromptSnapshot) {
        if (!content.trim()) {
          aiMessageToSend = substitutePromptTags(furtivePromptSnapshot.text, businessData);
        } else {
          aiMessageToSend =
            substitutePromptTags(furtivePromptSnapshot.text, businessData) +
            " " +
            content;
        }
      } else if (patternPrompt?.pattern_prompt) {
        aiMessageToSend = interpolatePatternPrompt(
          patternPrompt.pattern_prompt,
          content,
          businessData
        );
      }

      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: aiMessageToSend }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to service');
      }

      const data = await response.json();
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Invalid response format from AI service');
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: data.choices[0].message.content
      };

      if (authStatus === 'anonymous') {
        saveLocalMessages(currentSessionId, [userMessage, assistantMessage]);
        setMessages(prev => [...prev, assistantMessage]);
        await refreshSessions();
      } else {
        try {
          const messagesToSave = [
            { session_id: currentSessionId, role: 'user', content: userMessage.content },
            { session_id: currentSessionId, role: 'assistant', content: assistantMessage.content }
          ];
          
          await supabase.from('chat_messages').insert(messagesToSave);
          setMessages(prev => [...prev, assistantMessage]);
          await refreshSessions();
        } catch (error: any) {
          throw new Error(`Failed to save messages: ${error.message}`);
        }
      }

      setFurtivePrompt(null);

    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao obter resposta: ${error.message}`
      });
    } finally {
      setIsThinking(false);
    }
  };

  const showWelcomeScreen = !sessionId || (messages.length === 1 && messages[0].role === 'assistant' && 
    messages[0].content === 'Olá! Como posso ajudar você hoje?')

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <Watermark />
      {authStatus === 'anonymous' && (
        <AnonymousUserBanner remainingInteractions={remainingInteractions} />
      )}
      
      {showWelcomeScreen ? (
        <WelcomeScreen onSendMessage={handleSendMessage} />
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden h-full">
          <ChatMessages messages={messages} isThinking={isThinking} />
          <PromptSuggestionCards
            prompts={themePrompts}
            onSelect={handlePromptCardSelect}
            loading={isThemePromptsLoading}
          />
          <ChatInput 
            onSendMessage={handleSendMessage} 
            furtivePromptTitle={furtivePrompt ? furtivePrompt.title : undefined}
            setFurtivePromptCleared={() => setFurtivePrompt(null)}
          />
          <ApiKeyDisplay />
        </div>
      )}
    </div>
  )
}
