
import React from "react";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface AIGenerateButtonProps {
  fieldId: string;
  isGenerating: boolean;
  onGenerate: (fieldId: string) => void;
}

export function AIGenerateButton({ fieldId, isGenerating, onGenerate }: AIGenerateButtonProps) {
  const { isDark } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => onGenerate(fieldId)}
      className={`px-2 py-1 h-8 text-xs flex items-center ${isDark ? 'bg-[#333333] text-white' : ''}`}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <span className="flex items-center">
          <span className="animate-spin mr-1">⟳</span> Gerando...
        </span>
      ) : (
        <>
          <Wand className="w-3 h-3 mr-1" />
          Gerar com IA
        </>
      )}
    </Button>
  );
}
