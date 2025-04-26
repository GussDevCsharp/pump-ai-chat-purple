
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ImageGeneratorButtonProps {
  onImageGenerated: (imageUrl: string) => void;
}

export const ImageGeneratorButton = ({ onImageGenerated }: ImageGeneratorButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateImage = async (prompt: string) => {
    try {
      setIsGenerating(true)
      
      const { data: keyData, error: keyError } = await supabase
        .from('modelkeys')
        .select('apikey')
        .eq('model', 'OpenAI')
        .single()

      if (keyError || !keyData) {
        throw new Error('Could not fetch API key')
      }

      // Get the session properly - await the promise first
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token || ''

      const response = await fetch("https://spyfzrgwbavmntiginap.supabase.co/functions/v1/generate-image", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          prompt,
          apikey: keyData.apikey  // Pass the API key from modelkeys
        })
      })

      if (!response.ok) {
        throw new Error('Falha ao gerar imagem')
      }

      const data = await response.json()
      onImageGenerated(data.data[0].url)
      
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar a imagem. Tente novamente."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="absolute right-20 p-1.5 text-pump-purple hover:text-pump-purple/80 transition-colors disabled:opacity-50"
      onClick={() => {
        const promptText = window.prompt("Descreva a imagem que você deseja gerar:")
        if (promptText) {
          generateImage(promptText)
        }
      }}
      disabled={isGenerating}
    >
      <ImageIcon className="w-5 h-5" />
    </Button>
  )
}
