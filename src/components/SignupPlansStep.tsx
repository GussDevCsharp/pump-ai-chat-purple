
import React from "react";

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_paid: boolean;
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
      <h3 className="font-semibold text-lg mb-4 text-gray-900">Escolha o seu plano</h3>
      <div className="grid gap-4">
        {plans.map(plan => (
          <button
            type="button"
            key={plan.id}
            className={`border rounded-lg p-4 text-left ${selectedPlanId === plan.id ? 'border-pump-purple bg-pump-purple/5' : 'border-gray-200'} ${disabled ? "opacity-70" : ""}`}
            onClick={() => !disabled && onSelect(plan)}
            disabled={disabled}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">{plan.name}</span>
              <span className="">
                {plan.is_paid 
                  ? <span className="font-bold text-pump-purple">R$ {plan.price.toFixed(2)}</span>
                  : <span className="font-medium text-green-600">Grátis</span>
                }
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
