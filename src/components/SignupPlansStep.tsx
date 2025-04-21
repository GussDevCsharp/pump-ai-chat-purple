
import React from "react";
import { ArrowRight, User, Database, Smartphone, Upload, Clock, FileText, Shield, Users, Folder, Key, Activity, AlertTriangle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mapeamento simples de ícones (você pode adaptar conforme os nomes dos benefícios)
const iconMap: { [key: string]: React.ReactNode } = {
  "usuário": <User className="w-4 h-4" />,
  "armazenamento": <Database className="w-4 h-4" />,
  "dispositivos": <Smartphone className="w-4 h-4" />,
  "transfer": <Upload className="w-4 h-4" />,
  "restaurar": <Clock className="w-4 h-4" />,
  "PDF": <FileText className="w-4 h-4" />,
  "senha": <Shield className="w-4 h-4" />,
  "usuários": <Users className="w-4 h-4" />,
  "pastas": <Folder className="w-4 h-4" />,
  "acesso": <Key className="w-4 h-4" />,
  "atividade": <Activity className="w-4 h-4" />,
  "alerta": <AlertTriangle className="w-4 h-4" />,
  "SSO": <LogIn className="w-4 h-4" />,
};

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[];
}

interface SignupPlansStepProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelect: (plan: Plan) => void;
  disabled?: boolean;
  forceColumn?: boolean; // Força exibição em coluna (vertical)
}

function getBenefitIcon(benefit: string) {
  // Busca o ícone que mais casa com a palavra-chave do benefício:
  const lower = benefit.toLowerCase();
  const entry = Object.entries(iconMap).find(([key]) =>
    lower.includes(key)
  );
  return entry ? entry[1] : <FileText className="w-4 h-4" />;
}

export function SignupPlansStep({ plans, selectedPlanId, onSelect, disabled, forceColumn }: SignupPlansStepProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum plano disponível no momento. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  // Layout: cards em coluna ocupando toda a largura (sem overflow)
  return (
    <div>
      <h3 className="font-semibold text-xl mb-6 text-gray-900 text-center">Escolha o seu plano</h3>
      <div className={
        forceColumn
          ? "flex flex-col w-full gap-6"
          : "flex w-full overflow-x-auto gap-6 p-2 justify-center"
      }>
        {plans.slice(0, 3).map((plan, idx) => {
          const selected = selectedPlanId === plan.id;
          return (
            <div
              key={plan.id}
              className={`flex flex-col min-w-[290px] max-w-[340px] w-full bg-white border rounded-2xl shadow-md
                transition-all duration-200
                ${selected
                  ? "border-pump-purple ring-2 ring-pump-purple/30 bg-pump-purple/5 shadow-xl scale-105"
                  : "border-gray-200 hover:shadow-lg"}
                `}
              style={{
                flex: "1 1 0",
              }}
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Título & Preço */}
                <div className="mb-1 text-xs text-gray-500">{plan.is_paid ? "Para profissionais" : "Para uso pessoal"}</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{plan.name}</span>
                  {/* Destaque opcional */}
                  {idx === 1 && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[#fef7cd] text-[#807020] font-semibold">Melhor valor</span>
                  )}
                </div>
                <div className="my-2 mb-4 text-lg font-semibold text-gray-900">
                  {plan.is_paid
                    ? <>R$ {plan.price.toFixed(2)}/mês</>
                    : <>Grátis</>
                  }
                </div>
                {/* Botão de ação */}
                <Button
                  variant={selected ? "default" : "outline"}
                  className={`w-full mb-4 flex justify-between items-center transition
                  ${selected ? "bg-pump-purple text-white hover:bg-pump-purple/90" : "border-pump-purple text-pump-purple hover:bg-pump-purple/10"}
                  `}
                  onClick={() => !disabled && onSelect(plan)}
                  disabled={disabled}
                >
                  {plan.is_paid ? "Comprar agora" : "Avaliação grátis"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                {/* Descrição */}
                <p className="text-sm text-gray-700 mb-4 min-h-[32px]">{plan.description}</p>
                {/* Benefícios */}
                <ul className="flex flex-col gap-3 mb-6">
                  {plan.benefits && plan.benefits.length > 0 ? (
                    plan.benefits.map((benefit, idxb) => (
                      <li key={idxb} className="flex gap-2 text-[15px] items-center text-gray-900">
                        <span className="text-pump-purple">{getBenefitIcon(benefit)}</span>
                        <span className="leading-tight">{benefit}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic text-[15px]">Sem benefícios informados</li>
                  )}
                </ul>
                <div className="mt-auto">
                  <a
                    href="#"
                    tabIndex={-1}
                    className="text-xs font-semibold text-pump-purple underline hover:text-pump-purple/80"
                  >
                    Ver todos os recursos
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
