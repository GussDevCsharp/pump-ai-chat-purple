
import { FormDataType } from "@/types/business-generator"
import { useLocation } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import LoadingDots from "./LoadingDots"
import { useEffect, useRef } from "react"
import { Copy } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking])

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  return (
    <ScrollArea className="flex-1 h-full font-sans antialiased subpixel-antialiased text-[16px] text-gray-900 dark:text-white selection:bg-pump-gray/10 selection:text-pump-gray">
      <div className="w-full mx-auto space-y-6 py-4 px-[10px]">
        {businessData && (
          <div className="flex gap-4 px-[10px] bg-pump-gray/5 dark:bg-pump-gray/10 py-4 rounded-lg mb-6">
            <div className="w-8 h-8 rounded-full bg-pump-gray flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white font-sans">B</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2 font-sans dark:text-white">Informações do seu negócio:</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 font-sans">
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
            className={`flex gap-4 px-[10px] ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${
              message.role === 'assistant' ? 'bg-pump-gray' : 'bg-gray-600'
            } flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm font-medium text-white font-sans">{
                message.role === 'assistant' ? 'A' : 'U'
              }</span>
            </div>
            <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
              {message.role === 'user' ? (
                <span
                  className="inline-block px-4 py-2 rounded-lg bg-pump-gray text-white font-sans antialiased subpixel-antialiased"
                  style={{
                    wordBreak: 'break-word',
                    lineHeight: '1.6',
                    maxWidth: '70%',
                    textAlign: 'left',
                  }}
                >
                  {message.content}
                </span>
              ) : (
                <div 
                  className="group relative text-sm inline-block font-sans antialiased subpixel-antialiased w-full dark:text-white"
                  style={{ wordBreak: 'break-word', lineHeight: '1.6' }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="
                      absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100
                      transition-opacity dark:text-white dark:hover:bg-white/10
                      z-10
                    "
                    onClick={() => handleCopy(message.content)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar mensagem</span>
                  </Button>
                  <ReactMarkdown 
                    components={{
                      h1: ({children}) =>
                        <h1 className="font-sans text-2xl md:text-3xl font-extrabold text-pump-gray dark:text-white mb-3">{children}</h1>,
                      h2: ({children}) =>
                        <h2 className="font-sans text-xl md:text-2xl font-bold text-pump-gray dark:text-white mb-2">{children}</h2>,
                      h3: ({children}) =>
                        <h3 className="font-sans text-lg font-semibold text-pump-gray dark:text-white mb-2">{children}</h3>,
                      ul: ({children}) =>
                        <ul className="font-sans list-disc ml-5 mb-2 text-base dark:text-white">{children}</ul>,
                      li: ({children}) =>
                        <li className="font-sans text-base text-gray-800 dark:text-gray-200 mb-1 leading-relaxed">{children}</li>,
                      p: ({children}) =>
                        <p className="mb-3 last:mb-0 font-sans text-[16px] text-gray-900 dark:text-white">{children}</p>,
                      strong: ({children}) =>
                        <strong className="font-sans font-bold text-pump-gray dark:text-white">{children}</strong>,
                      em: ({children}) =>
                        <em className="font-sans italic dark:text-white">{children}</em>,
                      a: ({href, children}) =>
                        <a className="font-sans underline text-pump-gray hover:text-pump-gray/90 dark:text-white dark:hover:text-white/90" href={href as string} target="_blank" rel="noopener noreferrer">{children}</a>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-4 px-[10px]">
            <div className="w-8 h-8 rounded-full bg-pump-gray flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-white font-sans">A</span>
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-2 rounded-lg bg-pump-gray-light dark:bg-[#333333] text-gray-800 dark:text-white font-sans antialiased subpixel-antialiased">
                <LoadingDots />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
