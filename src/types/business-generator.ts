
export interface FieldOption {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: FieldOption[];
  conditional?: {
    field: string;
    value: string;
  };
}

export interface Step {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormDataType {
  businessName?: string;
  businessType?: string;
  targetAudience?: string;
  audienceDescription?: string;
  industry?: string;
  industryDetail?: string;
  uniqueValue?: string;
  initialBudget?: string;
  team?: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  [key: string]: string | undefined;
}

export interface BusinessPlanSection {
  title: string;
  content: string;
}

export interface BusinessPlan {
  businessName: string;
  sections: BusinessPlanSection[];
}
