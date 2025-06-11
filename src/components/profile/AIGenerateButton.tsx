
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onGenerate(fieldId)}
            className={`h-8 w-8 flex items-center justify-center ${isDark ? 'bg-[#333333] text-white' : ''}`}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="animate-spin text-xs">⟳</span>
            ) : (
              <Wand className="w-3 h-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gerar com IA</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
