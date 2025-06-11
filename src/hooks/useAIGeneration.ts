
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
      // Create specific prompts for each field that work independently
      let prompt = "";
      
      switch (field) {
        case "mainGoal":
          prompt = "Gere um objetivo principal específico e realista para um empreendedor nos próximos 12 meses. Exemplo: aumentar faturamento, expandir mercado, melhorar processos. MÁXIMO 140 caracteres.";
          break;
        case "entrepreneurshipReason":
          prompt = "Gere uma motivação autêntica e pessoal para empreender. Exemplo: independência financeira, realizar sonhos, criar impacto positivo. MÁXIMO 140 caracteres.";
          break;
        case "motivation":
          prompt = "Gere o que motiva um empresário no dia a dia. Exemplo: ver clientes satisfeitos, crescimento da equipe, inovação. MÁXIMO 140 caracteres.";
          break;
        case "difficulties":
          prompt = "Gere as principais dificuldades de um gestor. Exemplo: gestão de pessoas, fluxo de caixa, concorrência. MÁXIMO 140 caracteres.";
          break;
        case "mainProducts":
          prompt = "Gere uma descrição concisa de produtos/serviços de uma empresa. Exemplo: consultoria empresarial, produtos artesanais, serviços digitais. MÁXIMO 140 caracteres.";
          break;
        case "targetAudience":
          prompt = "Gere uma descrição de público-alvo empresarial. Exemplo: pequenos empresários, jovens profissionais, famílias classe média. MÁXIMO 140 caracteres.";
          break;
        case "biggestChallenge":
          prompt = "Gere o maior desafio atual de uma empresa. Exemplo: captação de clientes, redução de custos, digitalização. MÁXIMO 140 caracteres.";
          break;
        default:
          prompt = `Gere uma sugestão útil e prática para o campo "${field}" de um perfil empresarial. MÁXIMO 140 caracteres.`;
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
