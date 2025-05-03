
import React from "react";
import { Button } from "@/components/ui/button";

interface SuggestedPromptsProps {
  prompts?: string[];
  onSelectPrompt: (prompt: string) => void;
}

export const SuggestedPrompts = ({
  prompts,
  onSelectPrompt
}: SuggestedPromptsProps) => {
  if (!prompts || prompts.length === 0) return null;
  
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {prompts.map((prompt, index) => (
        <Button
          key={index}
          variant="outline"
          className="text-sm text-gray-700 dark:text-white bg-white dark:bg-[#222222] border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#333333]"
          onClick={() => onSelectPrompt(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>
  );
};
