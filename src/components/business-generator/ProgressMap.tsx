
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
      
      <div className="flex justify-between items-center px-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          
          return (
            <div
              key={step.id}
              className={`flex items-center justify-center`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-green-500' :
                  isCurrent ? 'bg-pump-purple' :
                  'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-lg text-white font-medium">{index + 1}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
