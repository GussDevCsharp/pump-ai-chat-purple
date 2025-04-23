
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BusinessFormField } from "@/components/business-generator/FormField";
import { BusinessPlanDisplay } from "@/components/business-generator/BusinessPlanDisplay";
import { ProgressMap } from "@/components/business-generator/ProgressMap";
import { Watermark } from "@/components/common/Watermark";
import { FormTitle } from "@/components/business-generator/FormTitle";
import { useBusinessForm } from "@/hooks/useBusinessForm";
import { steps } from "@/config/business-generator-steps";
import { Header } from "@/components/common/Header";

export default function BusinessGenerator() {
  const {
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
  } = useBusinessForm();

  if (businessPlan) {
    return (
      <div className="min-h-screen bg-offwhite">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <BusinessPlanDisplay businessPlan={businessPlan} onStartNew={startNewPlan} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite relative">
      <Header />
      <Watermark />
      <main className="container mx-auto px-4 py-10 flex flex-col items-center relative z-10">
        <div className="max-w-3xl mx-auto w-full bg-white/95 rounded-xl shadow-lg p-8 mt-8">
          <FormTitle />
          
          <ProgressMap 
            steps={steps}
            currentStep={currentStep}
            completedFields={formData}
          />
          
          <Card className="mb-8 bg-white/95 rounded-xl shadow-none border-0">
            <CardContent className="pt-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">{currentStepData.description}</h2>
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
                      formData={formData}
                      onAIGenerate={handleGenerateWithAI}
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
                className="text-lg gap-2 px-6 py-3 h-auto rounded-lg"
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
                className="text-lg gap-2 px-6 py-3 h-auto bg-pump-purple hover:bg-pump-purple/90 rounded-lg"
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
        </div>
      </main>
    </div>
  );
};
