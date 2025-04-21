
import React from "react";

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
}

export function SignupPlansStep({ plans, selectedPlanId, onSelect, disabled }: SignupPlansStepProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum plano disponível no momento. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-gray-900 text-center">Escolha o seu plano</h3>
      <div className="flex flex-row gap-4 justify-center flex-wrap md:flex-nowrap w-full">
        {plans.slice(0,3).map(plan => (
          <button
            type="button"
            key={plan.id}
            className={`
              relative flex-1 max-w-[350px] min-w-[260px]
              flex-shrink-0 border rounded-xl p-5 text-left
              transition-all duration-150
              ${selectedPlanId === plan.id ? 'border-pump-purple bg-pump-purple/5 shadow-xl scale-105 ring-2 ring-pump-purple/40' : 'border-gray-200 bg-white'}
              ${disabled ? "opacity-70 pointer-events-none" : "hover:shadow-md"}
            `}
            onClick={() => !disabled && onSelect(plan)}
            disabled={disabled}
            tabIndex={0}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">{plan.name}</span>
              <span>
                {plan.is_paid
                  ? <span className="font-bold text-pump-purple text-xl">R$ {plan.price.toFixed(2)}</span>
                  : <span className="font-bold text-green-500 text-xl">Grátis</span>
                }
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 min-h-[32px]">{plan.description}</p>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              {plan.benefits && plan.benefits.length > 0 ? (
                plan.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-pump-purple font-semibold">
                    <span className="inline-block w-2 h-2 bg-pump-purple rounded-full" />
                    {benefit}
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">Sem benefícios informados</li>
              )}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
