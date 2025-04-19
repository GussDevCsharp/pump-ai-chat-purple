
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
    startNewPlan
  };
};
