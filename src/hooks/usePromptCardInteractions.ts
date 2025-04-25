
import { useState } from 'react';

interface FurtivePrompt {
  text: string;
  title: string;
}

export const usePromptCardInteractions = () => {
  const [furtivePrompt, setFurtivePrompt] = useState<FurtivePrompt | null>(null);

  const handlePromptCardSelect = (prompt: any) => {
    setFurtivePrompt({
      text: prompt.prompt_furtive ?? prompt.title,
      title: prompt.title
    });
    const textArea = document.querySelector('textarea');
    if (textArea) {
      textArea.value = prompt.title;
      textArea.dispatchEvent(new Event('input', { bubbles: true }));
      textArea.focus();
    }
  };

  return {
    furtivePrompt,
    setFurtivePrompt,
    handlePromptCardSelect
  };
};
