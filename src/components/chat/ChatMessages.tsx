
import { FormDataType } from "@/types/business-generator"
import { useLocation } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import LoadingDots from "./LoadingDots"
import { useEffect, useRef } from "react"
import { Copy } from "lucide-react"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: 'assistant' | 'user'
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isThinking?: boolean
}

export const ChatMessages = ({ messages, isThinking }: ChatMessagesProps) => {
  const location = useLocation()
  const businessData = location.state?.businessData as FormDataType
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        description: "Conteúdo copiado para a área de transferência",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Erro ao copiar conteúdo",
      })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {businessData && (
          <div className="flex gap-4 px-4 bg-pump-purple/5 py-4 rounded-lg mb-6">
            <div className="w-8 h-8 rounded-full bg-pump-purple flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">B</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Informações do seu negócio:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(businessData).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex gap-4 px-4 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${
              message.role === 'assistant' ? 'bg-pump-purple' : 'bg-gray-600'
            } flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm font-medium text-white">
                {message.role === 'assistant' ? 'A' : 'U'}
              </span>
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div 
                className={`group relative text-sm inline-block px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-pump-purple text-white ml-auto' 
                    : 'bg-pump-gray-light text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="
                      absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100
                      transition-opacity
                      ml-2
                    "
                    onClick={() => handleCopy(message.content)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar mensagem</span>
                  </Button>
                )}
                {message.role === 'assistant' ? (
                  <ReactMarkdown 
                    components={{
                      p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                      h3: ({children}) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
                      ul: ({children}) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
                      li: ({children}) => <li>{children}</li>,
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-4 px-4">
            <div className="w-8 h-8 rounded-full bg-pump-purple flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-2 rounded-lg bg-pump-gray-light text-gray-800">
                <LoadingDots />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

