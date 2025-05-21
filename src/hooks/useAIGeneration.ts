
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
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um objetivo principal realista e específico para o empreendedor nos próximos 12 meses:\n\n${context}`;
          break;
        case "entrepreneurshipReason":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto explicando uma motivação autêntica para empreender:\n\n${context}`;
          break;
        case "motivation":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto sobre o que poderia motivar este empresário no dia a dia:\n\n${context}`;
          break;
        case "difficulties":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto sobre as possíveis dificuldades como gestor para este empresário:\n\n${context}`;
          break;
        case "mainProducts":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto e focado descrevendo os principais produtos ou serviços que esta empresa poderia oferecer:\n\n${context}`;
          break;
        case "targetAudience":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto e preciso descrevendo o público-alvo ideal para esta empresa:\n\n${context}`;
          break;
        case "biggestChallenge":
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto curto descrevendo qual poderia ser o maior desafio atual desta empresa:\n\n${context}`;
          break;
        default:
          prompt = `${promptPrefix} Baseado nas informações a seguir, gere um texto relevante para o campo "${field}":\n\n${context}`;
      }
      
      // Make API call to the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-profile-field', {
        body: { prompt, field }
      });
      
      if (error) throw new Error(error.message);
      
      return data.text;
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
