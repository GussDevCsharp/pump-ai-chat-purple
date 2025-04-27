
import React from "react";
import { ThemePrompt } from "@/hooks/useThemePrompts";
import { ClipboardList } from "lucide-react";

interface PromptSuggestionCardsProps {
  prompts: ThemePrompt[];
  onSelect: (prompt: ThemePrompt) => void;
  loading?: boolean;
}

export const PromptSuggestionCards: React.FC<PromptSuggestionCardsProps> = ({
  prompts,
  onSelect,
  loading
}) => {
  if (loading) {
    return (
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="bg-pump-gray/20 rounded-lg h-10 w-36 animate-pulse" />
        <div className="bg-pump-gray/20 rounded-lg h-10 w-48 animate-pulse" />
        <div className="bg-pump-gray/20 rounded-lg h-10 w-28 animate-pulse" />
      </div>
    );
  }
  if (!prompts || prompts.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {prompts.map(prompt => (
        <button
          type="button"
          key={prompt.id}
          className="bg-white border border-pump-purple/20 rounded-lg px-4 py-2 shadow hover:bg-pump-purple/10 text-pump-purple font-medium text-sm transition-colors cursor-pointer flex items-center gap-2"
          onClick={() => onSelect(prompt)}
          style={{ minWidth: 120 }}
        >
          <span>{prompt.title}</span>
          {prompt.action_plan && (
            <ClipboardList className="w-4 h-4 text-pump-purple/70" />
          )}
        </button>
      ))}
    </div>
  );
};
