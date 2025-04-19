
import { Progress } from "@/components/ui/progress"
import { Step } from "@/types/business-generator"
import { CheckCircle } from "lucide-react"

interface ProgressMapProps {
  steps: Step[]
  currentStep: number
  completedFields: { [key: string]: string }
}

export const ProgressMap = ({ steps, currentStep, completedFields }: ProgressMapProps) => {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className="mb-8 relative">
      <Progress value={progress} className="h-2 mb-6" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border ${
                isCurrent ? 'border-pump-purple bg-pump-purple/5' :
                isCompleted ? 'border-green-500 bg-green-50' :
                'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500' :
                    isCurrent ? 'bg-pump-purple' :
                    'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs text-white font-medium">{index + 1}</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              
              {isCompleted && (
                <div className="text-sm text-gray-600">
                  {step.fields.map(field => (
                    <div key={field.id} className="flex gap-2">
                      <span className="font-medium">{field.label}:</span>
                      <span>{completedFields[field.id]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
