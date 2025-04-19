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

interface FieldOption {
  id: string;
  label: string;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[];
  conditional?: {
    field: string;
    value: string;
  };
}

interface Step {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormDataType {
  businessType?: string;
  targetAudience?: string;
  audienceDescription?: string;
  industry?: string;
  industryDetail?: string;
  uniqueValue?: string;
  initialBudget?: string;
  team?: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  [key: string]: string | undefined;
}

interface BusinessPlanSection {
  title: string;
  content: string;
}

interface BusinessPlan {
  businessName: string;
  sections: BusinessPlanSection[];
}

const steps: Step[] = [
  {
    id: "business-type",
    title: "O que você quer vender?",
    description: "Escolha o tipo principal do seu negócio",
    fields: [
      {
        id: "businessType",
        label: "Selecione uma opção:",
        type: "radio",
        options: [
          { id: "product", label: "Quero vender produtos físicos" },
          { id: "service", label: "Quero oferecer serviços" },
          { id: "hybrid", label: "Quero vender produtos e serviços" },
          { id: "marketplace", label: "Quero criar um site que conecta vendedores e compradores" },
          { id: "saas", label: "Quero criar um software ou aplicativo" },
        ],
      },
    ],
  },
  {
    id: "target-audience",
    title: "Para quem você quer vender?",
    description: "Vamos definir quem são seus clientes ideais",
    fields: [
      {
        id: "targetAudience",
        label: "Quem vai comprar seu produto ou serviço?",
        type: "radio",
        options: [
          { id: "b2c", label: "Vou vender direto para as pessoas (consumidores)" },
          { id: "b2b", label: "Vou vender para outras empresas" },
          { id: "b2b2c", label: "Vou vender tanto para pessoas quanto para empresas" },
        ],
      },
      {
        id: "audienceDescription",
        label: "Descreva um pouco mais sobre seus clientes ideais",
        type: "textarea",
        placeholder: "Exemplo: Jovens de 20 a 35 anos que gostam de tecnologia...",
      },
    ],
  },
  {
    id: "industry",
    title: "Qual é a área do seu negócio?",
    description: "Escolha o setor principal da sua empresa",
    fields: [
      {
        id: "industry",
        label: "Selecione a área que mais combina com seu negócio:",
        type: "radio",
        options: [
          { id: "technology", label: "Tecnologia e Digital" },
          { id: "health", label: "Saúde e Bem-estar" },
          { id: "education", label: "Educação e Ensino" },
          { id: "finance", label: "Finanças e Dinheiro" },
          { id: "food", label: "Comida e Bebida" },
          { id: "retail", label: "Loja e Varejo" },
          { id: "logistics", label: "Entregas e Logística" },
          { id: "other", label: "Outro tipo de negócio" },
        ],
      },
      {
        id: "industryDetail",
        label: "Qual é a área do seu negócio?",
        type: "input",
        placeholder: "Ex: Turismo, Moda, Artesanato...",
        conditional: { field: "industry", value: "other" },
      },
    ],
  },
  {
    id: "unique-value",
    title: "O que torna seu negócio especial?",
    description: "Conte-nos o que vai fazer seu negócio se destacar da concorrência",
    fields: [
      {
        id: "uniqueValue",
        label: "Qual é o diferencial do seu negócio?",
        type: "textarea",
        placeholder: "Ex: Vou oferecer atendimento 24 horas, entregas mais rápidas, produtos exclusivos...",
      },
    ],
  },
  {
    id: "resources",
    title: "Recursos iniciais",
    description: "Vamos planejar com quanto dinheiro e pessoas você vai começar",
    fields: [
      {
        id: "initialBudget",
        label: "Quanto você planeja investir no início?",
        type: "radio",
        options: [
          { id: "low", label: "Até R$ 10.000" },
          { id: "medium", label: "Entre R$ 10.000 e R$ 50.000" },
          { id: "high", label: "Entre R$ 50.000 e R$ 200.000" },
          { id: "vhigh", label: "Mais de R$ 200.000" },
        ],
      },
      {
        id: "team",
        label: "Com quantas pessoas você vai começar?",
        type: "radio",
        options: [
          { id: "solo", label: "Só eu mesmo(a)" },
          { id: "small", label: "Uma equipe pequena (2-5 pessoas)" },
          { id: "medium", label: "Uma equipe média (6-15 pessoas)" },
          { id: "large", label: "Uma equipe grande (mais de 15 pessoas)" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "Quais são seus objetivos?",
    description: "Vamos definir o que você quer alcançar com seu negócio",
    fields: [
      {
        id: "shortTermGoals",
        label: "O que você quer conseguir no primeiro ano?",
        type: "textarea",
        placeholder: "Ex: Conseguir os primeiros 50 clientes, abrir minha loja física...",
      },
      {
        id: "longTermGoals",
        label: "O que você quer alcançar em 3-5 anos?",
        type: "textarea",
        placeholder: "Ex: Expandir para outras cidades, criar novos produtos...",
      },
    ],
  },
];

export default function BusinessGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
  const navigate = useNavigate();

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    const currentFields = currentStepData.fields.filter(field => 
      !field.conditional || formData[field.conditional.field] === field.conditional.value
    );
    
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

  const renderFormField = (field: FormField) => {
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
              {field.options?.map((option) => (
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-pump-purple">
            Monte Seu Negócio
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-600 mb-12">
            Responda algumas perguntas simples e te ajudaremos a criar um plano para seu negócio.
          </p>
          
          <Card className="mb-8">
            <CardContent className="pt-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">{currentStepData.title}</h2>
                <p className="text-lg md:text-xl text-gray-600">{currentStepData.description}</p>
              </div>
              
              <div className="space-y-6">
                {currentStepData.fields.map((field) => renderFormField(field))}
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
        </div>
      </main>
    </div>
  );
}
