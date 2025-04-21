
import React from "react";

interface SignupStepperProps {
  steps: string[];
  current: number;
}

export function SignupStepper({ steps, current }: SignupStepperProps) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 font-bold text-sm
            ${current === idx ? "bg-pump-purple text-white" : current > idx ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
            {current > idx ? "✓" : idx + 1}
          </div>
          <span className={`text-xs ${current === idx ? "text-pump-purple" : "text-gray-600"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}
