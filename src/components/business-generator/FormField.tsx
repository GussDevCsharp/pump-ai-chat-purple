
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { FormField } from "@/types/business-generator";

interface FormFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  formData?: Record<string, string>;
  onAIGenerate?: (fieldId: string) => void;
}

export const BusinessFormField: React.FC<FormFieldProps> = ({ 
  field, 
  value, 
  onChange,
  formData,
  onAIGenerate
}) => {
  const showAIButton = field.type === "input" || field.type === "textarea";

  const renderAIButton = () => {
    if (!showAIButton || !onAIGenerate) return null;
    
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onAIGenerate(field.id)}
        className="ml-2"
      >
        <Wand className="mr-2 h-4 w-4" />
        Gerar com IA
      </Button>
    );
  };

  switch (field.type) {
    case "input":
      return (
        <div className="space-y-2">
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="flex items-center">
            <Input
              id={field.id}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || ""}
              className="w-full"
            />
            {renderAIButton()}
          </div>
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-2">
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="flex items-start">
            <Textarea
              id={field.id}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || ""}
              className="w-full"
            />
            {renderAIButton()}
          </div>
        </div>
      );
    case "radio":
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            className="flex flex-col space-y-2"
          >
            {field.options?.map((option) => (
              <div className="flex items-center space-x-2" key={option.id}>
                <RadioGroupItem value={option.id} id={`${field.id}-${option.id}`} />
                <label
                  htmlFor={`${field.id}-${option.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    default:
      return null;
  }
};
