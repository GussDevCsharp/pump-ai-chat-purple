import { useState } from "react";
import { FormDataType, BusinessPlan } from "@/types/business-generator";
import { toast } from "sonner";
import { steps } from "@/config/business-generator-steps";

export const useBusinessForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    const currentFields = currentStepData.fields.filter(field => 
      !field.conditional || formData[field.conditional.field] === field.conditional.value
    );
    
    if (!currentFields.every(field => formData[field.id])) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateBusinessPlan();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
  };

  const handleGenerateWithAI = async (fieldId: string) => {
    if (!formData.businessName) {
      toast.error("Por favor, preencha o nome do negócio primeiro.");
      return;
    }

    setIsGenerating(true);
    try {
      let prompt = "";
      switch (fieldId) {
        case "uniqueValue":
          prompt = `Sugestão de diferencial competitivo para ${formData.businessName}, um negócio do tipo ${formData.businessType} no setor de ${formData.industry === 'other' ? formData.industryDetail : formData.industry}, focado em ${formData.targetAudience === 'b2c' ? 'consumidores finais' : formData.targetAudience === 'b2b' ? 'empresas' : 'empresas e consumidores finais'}.`;
          break;
        case "shortTermGoals":
          prompt = `Objetivos de curto prazo (1 ano) para ${formData.businessName}, considerando que é um ${formData.businessType} com investimento inicial ${formData.initialBudget === 'low' ? 'baixo' : formData.initialBudget === 'medium' ? 'médio' : 'alto'}.`;
          break;
        case "longTermGoals":
          prompt = `Objetivos de longo prazo (3-5 anos) para ${formData.businessName}, considerando que é um ${formData.businessType} com equipe ${formData.team === 'solo' ? 'individual' : formData.team === 'small' ? 'pequena' : 'média'}.`;
          break;
        case "audienceDescription":
          prompt = `Descrição detalhada do público-alvo ideal para ${formData.businessName}, um negócio do tipo ${formData.businessType} focado em ${formData.targetAudience === 'b2c' ? 'consumidores finais' : formData.targetAudience === 'b2b' ? 'empresas' : 'ambos'}.`;
          break;
        default:
          toast.error("Campo não suportado para geração por IA.");
          setIsGenerating(false);
          return;
      }

      // Simulating AI response for now - in reality, you would call an AI service here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let generatedText = "";
      switch (fieldId) {
        case "uniqueValue":
          generatedText = `Atendimento personalizado 24/7 com suporte via WhatsApp e sistema de agendamento online integrado, oferecendo maior comodidade e agilidade para nossos clientes.`;
          break;
        case "shortTermGoals":
          generatedText = `Conquistar 100 clientes ativos, estabelecer presença online forte com avaliação média de 4.5 estrelas, e atingir faturamento mensal consistente.`;
          break;
        case "longTermGoals":
          generatedText = `Expandir para 3 cidades da região, desenvolver linha própria de produtos, e criar programa de fidelidade com mais de 1000 membros ativos.`;
          break;
        case "audienceDescription":
          generatedText = `Profissionais entre 25-45 anos, com renda média-alta, que valorizam qualidade e conveniência, principalmente em áreas urbanas e com interesse em tecnologia.`;
          break;
      }

      setFormData(prev => ({
        ...prev,
        [fieldId]: generatedText
      }));
      
      toast.success("Texto gerado com sucesso!");
    } catch (error) {
      console.error("Error generating text:", error);
      toast.error("Erro ao gerar texto. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBusinessPlan = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setBusinessPlan({
        businessName: `Startup ${formData.industry || ""}`,
        sections: [
          {
            title: "Resumo Executivo",
            content: `Este plano de negócios descreve uma ${formData.businessType === 'product' ? 'empresa de produtos' : 'empresa de serviços'} 
                    no setor de ${formData.industry === 'other' ? formData.industryDetail : formData.industry}, 
                    direcionada para ${formData.targetAudience === 'b2c' ? 'consumidores finais' : 
                    formData.targetAudience === 'b2b' ? 'empresas' : 'empresas e consumidores finais'}.`
          },
          {
            title: "Análise de Mercado",
            content: `O negócio atenderá ${formData.audienceDescription || 'o público-alvo definido'}, 
                    com um investimento inicial ${formData.initialBudget === 'low' ? 'baixo' : 
                    formData.initialBudget === 'medium' ? 'médio' : 'alto'} e uma equipe ${
                    formData.team === 'solo' ? 'individual' : 
                    formData.team === 'small' ? 'pequena' : 
                    formData.team === 'medium' ? 'média' : 'grande'}.`
          },
          {
            title: "Proposta de Valor",
            content: `O diferencial do negócio consiste em: ${formData.uniqueValue || 'diferencial não especificado'}.`
          },
          {
            title: "Planejamento Estratégico",
            content: `Objetivos de curto prazo: ${formData.shortTermGoals || 'não especificados'}. 
                    Objetivos de longo prazo: ${formData.longTermGoals || 'não especificados'}.`
          },
          {
            title: "Próximos Passos",
            content: "Recomendamos refinar este plano de negócios, conduzir pesquisas de mercado detalhadas, e elaborar um plano financeiro completo."
          }
        ]
      });
      
      setIsGenerating(false);
    }, 2000);
  };

  const startNewPlan = () => {
    setFormData({});
    setCurrentStep(0);
    setBusinessPlan(null);
  };

  return {
    currentStep,
    formData,
    isGenerating,
    businessPlan,
    currentStepData,
    handleNext,
    handlePrevious,
    handleFieldChange,
    handleGenerateWithAI,
    startNewPlan
  };
};
