
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const steps = [
  {
    id: "business-type",
    title: "Tipo de negócio",
    description: "Escolha o tipo de negócio que você deseja criar",
    fields: [
      {
        id: "businessType",
        label: "Tipo de negócio",
        type: "radio",
        options: [
          { id: "product", label: "Produto" },
          { id: "service", label: "Serviço" },
          { id: "hybrid", label: "Híbrido (Produto e Serviço)" },
          { id: "marketplace", label: "Marketplace" },
          { id: "saas", label: "Software as a Service (SaaS)" },
        ],
      },
    ],
  },
  {
    id: "target-audience",
    title: "Público-alvo",
    description: "Defina o público-alvo do seu negócio",
    fields: [
      {
        id: "targetAudience",
        label: "Quem é o público-alvo do seu negócio?",
        type: "radio",
        options: [
          { id: "b2c", label: "Consumidores finais (B2C)" },
          { id: "b2b", label: "Empresas (B2B)" },
          { id: "b2b2c", label: "Empresas e consumidores finais (B2B2C)" },
        ],
      },
      {
        id: "audienceDescription",
        label: "Detalhe seu público-alvo em poucas palavras",
        type: "textarea",
        placeholder: "Ex: Profissionais entre 25-45 anos que trabalham com tecnologia...",
      },
    ],
  },
  {
    id: "industry",
    title: "Setor",
    description: "Escolha o setor do seu negócio",
    fields: [
      {
        id: "industry",
        label: "Setor",
        type: "radio",
        options: [
          { id: "technology", label: "Tecnologia" },
          { id: "health", label: "Saúde" },
          { id: "education", label: "Educação" },
          { id: "finance", label: "Finanças" },
          { id: "food", label: "Alimentação" },
          { id: "retail", label: "Varejo" },
          { id: "logistics", label: "Logística" },
          { id: "other", label: "Outro" },
        ],
      },
      {
        id: "industryDetail",
        label: "Se escolheu Outro, especifique",
        type: "input",
        placeholder: "Ex: Turismo sustentável",
        conditional: { field: "industry", value: "other" },
      },
    ],
  },
  {
    id: "unique-value",
    title: "Diferencial",
    description: "Qual é o diferencial do seu negócio?",
    fields: [
      {
        id: "uniqueValue",
        label: "Descreva o diferencial do seu negócio",
        type: "textarea",
        placeholder: "Ex: Nossa empresa oferece um serviço personalizado com atendimento 24/7...",
      },
    ],
  },
  {
    id: "resources",
    title: "Recursos",
    description: "Quais recursos você possui para começar seu negócio?",
    fields: [
      {
        id: "initialBudget",
        label: "Orçamento inicial aproximado",
        type: "radio",
        options: [
          { id: "low", label: "Até R$ 10.000" },
          { id: "medium", label: "Entre R$ 10.000 e R$ 50.000" },
          { id: "high", label: "Entre R$ 50.000 e R$ 200.000" },
          { id: "vhigh", label: "Acima de R$ 200.000" },
        ],
      },
      {
        id: "team",
        label: "Equipe inicial",
        type: "radio",
        options: [
          { id: "solo", label: "Apenas eu (solo)" },
          { id: "small", label: "Pequena equipe (2-5 pessoas)" },
          { id: "medium", label: "Equipe média (6-15 pessoas)" },
          { id: "large", label: "Equipe grande (mais de 15 pessoas)" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "Objetivos",
    description: "Quais são os objetivos do seu negócio?",
    fields: [
      {
        id: "shortTermGoals",
        label: "Objetivos de curto prazo (1 ano)",
        type: "textarea",
        placeholder: "Ex: Lançar o MVP, conseguir os primeiros 100 clientes...",
      },
      {
        id: "longTermGoals",
        label: "Objetivos de longo prazo (3-5 anos)",
        type: "textarea",
        placeholder: "Ex: Expandir para outros mercados, atingir faturamento de R$ 1 milhão...",
      },
    ],
  },
];

export default function BusinessGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessPlan, setBusinessPlan] = useState(null);
  const navigate = useNavigate();

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    const currentFields = currentStepData.fields.filter(field => 
      !field.conditional || formData[field.conditional.field] === field.conditional.value
    );
    
    // Validate if all required fields are filled
    const isValid = currentFields.every(field => formData[field.id]);
    
    if (!isValid) {
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

  const handleFieldChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    });
  };

  const generateBusinessPlan = () => {
    setIsGenerating(true);
    
    // Here we'd typically make an API call to generate the business plan
    // For now we'll simulate with a timeout
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

  const renderFormField = (field) => {
    // If this field has a condition and the condition is not met, don't render it
    if (field.conditional && formData[field.conditional.field] !== field.conditional.value) {
      return null;
    }

    switch (field.type) {
      case "input":
        return (
          <div className="space-y-2" key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <Input
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder || ""}
              className="w-full"
            />
          </div>
        );
      case "textarea":
        return (
          <div className="space-y-2" key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <Textarea
              id={field.id}
              value={formData[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder || ""}
              className="w-full"
            />
          </div>
        );
      case "radio":
        return (
          <div className="space-y-3" key={field.id}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <RadioGroup
              value={formData[field.id] || ""}
              onValueChange={(value) => handleFieldChange(field.id, value)}
              className="flex flex-col space-y-2"
            >
              {field.options.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                  <RadioGroupItem value={option.id} id={`${field.id}-${option.id}`} />
                  <label
                    htmlFor={`${field.id}-${option.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  // If we have a generated business plan, show it
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-pump-purple">Plano de Negócios: {businessPlan.businessName}</h1>
            
            {businessPlan.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{section.title}</h2>
                <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
              </div>
            ))}
            
            <div className="flex gap-4 mt-8">
              <Button 
                onClick={startNewPlan} 
                variant="outline"
                className="flex-1"
              >
                Criar Novo Plano
              </Button>
              <Button 
                onClick={() => navigate('/chat', {
                  state: {
                    topic: "Plano de Negócios",
                    prompts: [
                      "Como elaborar um plano financeiro para esta empresa?",
                      "Quais são as principais estratégias de marketing para este negócio?",
                      "Como estruturar a equipe ideal para este tipo de empresa?",
                      "Quais são os principais riscos deste modelo de negócio?",
                      "Como atrair os primeiros clientes?"
                    ]
                  }
                })}
                className="flex-1 gap-2 bg-pump-purple hover:bg-pump-purple/90"
              >
                <MessageSquare size={18} />
                Consultar IA para Detalhes
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center text-pump-purple">Gere um Negócio</h1>
          <p className="text-center text-gray-600 mb-8">
            Responda algumas perguntas e criaremos um plano de negócios personalizado para você.
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">{currentStepData.title}</h2>
                <p className="text-gray-600">{currentStepData.description}</p>
              </div>
              
              <div className="space-y-4">
                {currentStepData.fields.map((field) => renderFormField(field))}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Anterior
              </Button>
              <div className="text-sm text-gray-500">
                Passo {currentStep + 1} de {steps.length}
              </div>
              <Button 
                onClick={handleNext}
                disabled={isGenerating}
                className="gap-2 bg-pump-purple hover:bg-pump-purple/90"
              >
                {isGenerating ? (
                  "Gerando..."
                ) : currentStep === steps.length - 1 ? (
                  "Gerar Plano"
                ) : (
                  <>
                    Próximo
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
