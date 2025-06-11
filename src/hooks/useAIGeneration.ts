
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AiGenerationProps {
  field: string;
  contextData?: Record<string, any>;
  promptPrefix?: string;
}

export function useAIGeneration() {
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const generateWithAI = async ({ field, contextData, promptPrefix = "" }: AiGenerationProps): Promise<string> => {
    setIsGenerating(prev => ({ ...prev, [field]: true }));
    
    try {
      // Create context from existing data
      const context = contextData ? Object.entries(contextData)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n") : "";
      
      // Create appropriate prompt based on the field and context
      let prompt = "";
      
      switch (field) {
        case "mainGoal":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um objetivo principal específico e realista para o empreendedor nos próximos 12 meses. MÁXIMO 140 caracteres. Seja direto e objetivo:\n\n${context}`;
          break;
        case "entrepreneurshipReason":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere uma motivação autêntica e pessoal para empreender. MÁXIMO 140 caracteres. Use linguagem natural:\n\n${context}`;
          break;
        case "motivation":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere o que motiva este empresário no dia a dia. MÁXIMO 140 caracteres. Seja específico:\n\n${context}`;
          break;
        case "difficulties":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere as principais dificuldades como gestor. MÁXIMO 140 caracteres. Seja realista:\n\n${context}`;
          break;
        case "mainProducts":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere uma descrição concisa dos principais produtos/serviços. MÁXIMO 140 caracteres:\n\n${context}`;
          break;
        case "targetAudience":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere uma descrição precisa do público-alvo. MÁXIMO 140 caracteres:\n\n${context}`;
          break;
        case "biggestChallenge":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere o maior desafio atual da empresa. MÁXIMO 140 caracteres. Seja específico:\n\n${context}`;
          break;
        default:
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto relevante para o campo "${field}". MÁXIMO 140 caracteres:\n\n${context}`;
      }
      
      // Make API call to the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-profile-field', {
        body: { prompt, field }
      });
      
      if (error) throw new Error(error.message);
      
      // Ensure the generated text doesn't exceed 140 characters
      let generatedText = data.text;
      if (generatedText.length > 140) {
        generatedText = generatedText.substring(0, 137) + '...';
      }
      
      return generatedText;
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Erro ao gerar conteúdo com IA. Tente novamente.');
      return '';
    } finally {
      setIsGenerating(prev => ({ ...prev, [field]: false }));
    }
  };

  return { generateWithAI, isGenerating };
}
