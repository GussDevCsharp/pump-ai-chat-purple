
import { useState } from 'react';

export const usePromptHandling = () => {
  const [furtivePrompt, setFurtivePrompt] = useState<{ text: string; title: string } | null>(null);
  const [businessData] = useState({
    company_name: "Minha Empresa",
    industry: "Tecnologia",
    years: "5",
    focus: "Soluções inovadoras",
  });

  const interpolatePatternPrompt = (
    pattern: string,
    userQuery: string,
    business: Record<string, string>
  ) => {
    let filled = pattern;
    for (const key in business) {
      filled = filled.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key]);
    }
    filled = filled.replace(/{{\s*user_query\s*}}/g, userQuery);
    return filled;
  };

  const substitutePromptTags = (prompt: string, business: Record<string, string>) => {
    let result = prompt;
    for (const key in business) {
      result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), business[key]);
    }
    return result;
  };

  return {
    furtivePrompt,
    setFurtivePrompt,
    businessData,
    interpolatePatternPrompt,
    substitutePromptTags
  };
};
