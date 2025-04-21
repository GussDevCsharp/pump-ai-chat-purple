
import React from "react";
import { CheckCircle } from "lucide-react";

type Step = {
  title: string;
};

interface SignupRoadmapProps {
  steps: Step[];
  currentStep: number;
}

export function SignupRoadmap({ steps, currentStep }: SignupRoadmapProps) {
  const percent = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="relative w-full max-w-xl mx-auto">
        <div className="h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-2 bg-pump-purple rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs relative z-10 max-w-xl mx-auto">
          {steps.map((step, i) => {
            const completed = i < currentStep;
            const current = i === currentStep;
            return (
              <div key={step.title} className="flex flex-col items-center w-1/4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mb-2 ${
                    completed
                      ? "bg-green-500 text-white"
                      : current
                      ? "bg-pump-purple text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {completed ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span
                  className={`text-center text-xs font-medium ${
                    current ? "text-pump-purple" : "text-gray-600"
                  }`}
                  style={{ minWidth: 70 }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

