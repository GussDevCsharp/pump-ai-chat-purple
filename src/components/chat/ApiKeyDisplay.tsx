
import { useEffect, useState } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export const ApiKeyDisplay = () => {
  const [apiKey, setApiKey] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch(
          "https://spyfzrgwbavmntiginap.supabase.co/functions/v1/chat/getApiKey",
          {
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweWZ6cmd3YmF2bW50aWdpbmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzcwNjEsImV4cCI6MjA2MDQxMzA2MX0.nBc8x2mLTm4j9KpxSzsgCp0xHgaJnWvN2t7I3H37n70`,
            }
          }
        )
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setApiKey('Erro ao carregar a chave')
        } else {
          setApiKey(data.apiKey || 'Chave não encontrada')
        }
      } catch (error) {
        console.error('Erro ao buscar a chave API:', error)
        setError(error.message)
        setApiKey('Erro ao carregar a chave')
      }
    }

    fetchApiKey()
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 hover:text-gray-900">
          API Key <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="font-mono">{apiKey}</div>
          {error && <span className="text-red-500 ml-2">(*)</span>}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

