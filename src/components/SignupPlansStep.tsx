
import React from "react";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
  chatpump?: boolean;
  benefits?: string[]; // novo campo para os benefícios
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

  // Para evitar issues se não passar allBenefits
  const uniqueAllBenefits = (allBenefits ?? [])
    .filter((benefit, idx, arr) => benefit && arr.indexOf(benefit) === idx);

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Escolha o seu plano</h3>
      <div
        className={`
          flex flex-wrap gap-4 justify-center
        `}
      >
        {plans.map(plan => (
          <button
            type="button"
            key={plan.id}
            className={`relative min-w-[220px] max-w-[320px] w-full sm:w-auto flex-shrink-0 border rounded-lg p-4 text-left transition-all duration-150 ${selectedPlanId === plan.id ? 'border-pump-purple bg-pump-purple/5 shadow' : 'border-gray-200 bg-white'} ${disabled ? "opacity-70" : "hover:shadow-md"}`}
            onClick={() => !disabled && onSelect(plan)}
            disabled={disabled}
            tabIndex={0}
          >
            {/* Marca d'água com todos os benefícios */}
            {uniqueAllBenefits.length > 0 && (
              <ul className="absolute inset-0 p-4 z-0 opacity-15 pointer-events-none select-none list-none text-xs" aria-hidden="true">
                {uniqueAllBenefits.map((b, idx) => (
                  <li key={idx} className="mb-1 text-gray-500" style={{
                    whiteSpace: 'nowrap',
                    textShadow: '0 1px 8px #fff, 0 0px 1px #fff',
                  }}>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg">{plan.name}</span>
                <span>
                  {plan.is_paid
                    ? <span className="font-bold text-pump-purple">R$ {plan.price.toFixed(2)}</span>
                    : <span className="font-medium text-green-600">Grátis</span>
                  }
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              {/* Destaque só os benefícios do plano */}
              {plan.benefits && plan.benefits.length > 0 && (
                <ul className="text-sm mt-3 space-y-1 pl-4 list-disc text-gray-800 font-medium">
                  {plan.benefits.map((b, idx) => (
                    <li key={idx} className="text-pump-purple">{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

