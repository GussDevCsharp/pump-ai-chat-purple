
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { BusinessPlan } from "@/types/business-generator";

interface BusinessPlanDisplayProps {
  businessPlan: BusinessPlan;
  onStartNew: () => void;
}

export const BusinessPlanDisplay: React.FC<BusinessPlanDisplayProps> = ({ businessPlan, onStartNew }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-pump-purple">
        Plano de Negócios: {businessPlan.businessName}
      </h1>
      
      {businessPlan.sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{section.title}</h2>
          <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
      
      <div className="flex gap-4 mt-8">
        <Button 
          onClick={onStartNew} 
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
  );
};
