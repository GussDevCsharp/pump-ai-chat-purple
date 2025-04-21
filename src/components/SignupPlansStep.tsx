
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
  allBenefits?: string[];
}

export function SignupPlansStep({ plans, selectedPlanId, onSelect, disabled, allBenefits }: SignupPlansStepProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum plano disponível no momento. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  // Lista completa e única de benefícios (sem duplicatas e definidos)
  const uniqueAllBenefits = (allBenefits ?? [])
    .filter((benefit, idx, arr) => benefit && arr.indexOf(benefit) === idx);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-gray-900 text-center">Escolha o seu plano</h3>
      <div
        className="
          flex flex-row gap-4 justify-center 
          flex-wrap md:flex-nowrap
          w-full
        "
      >
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
            <ul className="mt-2 space-y-1 text-sm font-medium">
              {uniqueAllBenefits.map((benefit, idx) => {
                const isActive = plan.benefits?.includes(benefit);
                return (
                  <li
                    key={idx}
                    className={`
                      flex items-center gap-2
                      ${isActive 
                        ? "text-pump-purple font-semibold"
                        : "text-gray-400 line-through opacity-60"
                      }
                    `}
                  >
                    {isActive ? (
                      <span className="inline-block w-2 h-2 bg-pump-purple rounded-full" />
                    ) : (
                      <span className="inline-block w-2 h-2 border border-gray-300 rounded-full" />
                    )}
                    {benefit}
                  </li>
                )
              })}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}
