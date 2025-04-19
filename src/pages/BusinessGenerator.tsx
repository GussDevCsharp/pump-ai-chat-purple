import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { steps } from "@/config/business-generator-steps";
import { BusinessFormField } from "@/components/business-generator/FormField";
import { BusinessPlanDisplay } from "@/components/business-generator/BusinessPlanDisplay";
import { ProgressMap } from "@/components/business-generator/ProgressMap";
import { Watermark } from "@/components/common/Watermark";
import { FormDataType, BusinessPlan } from "@/types/business-generator";

export default function BusinessGenerator() {
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

  if (businessPlan) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-pump-gray/20 p-4">
          <div className="container mx-auto flex items-center">
            <Link to="/">
              <img 
                src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
                alt="Pump.ia"
                className="h-8"
              />
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <BusinessPlanDisplay businessPlan={businessPlan} onStartNew={startNewPlan} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Watermark />
      
      <header className="border-b border-pump-gray/20 p-4 relative z-10">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
              alt="Pump.ia"
              className="h-8"
            />
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-pump-purple">
            Monte Seu Negócio
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-600 mb-12">
            Responda algumas perguntas simples e te ajudaremos a criar um plano para seu negócio.
          </p>

          {!businessPlan ? (
            <>
              <ProgressMap 
                steps={steps}
                currentStep={currentStep}
                completedFields={formData}
              />
              
              <Card className="mb-8">
                <CardContent className="pt-8">
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-3">{currentStepData.title}</h2>
                    <p className="text-lg md:text-xl text-gray-600">{currentStepData.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {currentStepData.fields.map((field) => {
                      if (field.conditional && formData[field.conditional.field] !== field.conditional.value) {
                        return null;
                      }
                      return (
                        <BusinessFormField
                          key={field.id}
                          field={field}
                          value={formData[field.id] || ""}
                          onChange={(value) => handleFieldChange(field.id, value)}
                        />
                      );
                    })}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between p-6">
                  <Button 
                    onClick={handlePrevious} 
                    disabled={currentStep === 0}
                    variant="outline"
                    className="text-lg gap-2 px-6 py-3 h-auto"
                  >
                    <ArrowLeft size={20} />
                    Voltar
                  </Button>
                  <div className="text-lg text-gray-500">
                    Passo {currentStep + 1} de {steps.length}
                  </div>
                  <Button 
                    onClick={handleNext}
                    disabled={isGenerating}
                    className="text-lg gap-2 px-6 py-3 h-auto bg-pump-purple hover:bg-pump-purple/90"
                  >
                    {isGenerating ? (
                      "Gerando..."
                    ) : currentStep === steps.length - 1 ? (
                      "Criar Plano"
                    ) : (
                      <>
                        Próximo
                        <ArrowRight size={20} />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <BusinessPlanDisplay businessPlan={businessPlan} onStartNew={startNewPlan} />
          )}
        </div>
      </main>
    </div>
  );
}
