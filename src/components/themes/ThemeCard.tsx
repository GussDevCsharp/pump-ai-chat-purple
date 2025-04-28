
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemePrompts } from "@/hooks/useThemePrompts";
import { Circle } from "lucide-react";

type ThemeCardProps = {
  theme: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
  };
  onSelect: (themeId: string, themeName: string) => void;
};

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const { prompts, isLoading } = useThemePrompts(theme.id);

  return (
    <Card
      onClick={() => onSelect(theme.id, theme.name)}
      className={`
        flex flex-col h-[320px] rounded-xl border border-[#E5E5E5] hover:shadow-xl 
        transform transition-all duration-200 cursor-pointer
        hover:scale-[1.02] shadow-md group
        px-3 py-2 dark:bg-black/40 dark:backdrop-blur-lg
      `}
      style={{
        borderColor: "#E5E5E5"
      }}
    >
      <div className="flex flex-col flex-1 justify-between h-full p-2">
        <div>
          <div className="flex items-center gap-2 mb-2 mt-1">
            <div 
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{
                background: theme.color ? `${theme.color}20` : "#f4ebfd",
              }}
            >
              <span 
                className="font-bold text-base dark:text-white"
                style={{
                  color: theme.color || "#7E1CC6"
                }}
              >{theme.name.charAt(0)}</span>
            </div>
            <h3 className="font-normal text-base text-foreground dark:text-white leading-tight">{theme.name}</h3>
          </div>
          {theme.description && (
            <p className="text-xs text-muted-foreground dark:text-white/70 mt-1 mb-2 px-1 max-h-[30px] overflow-hidden">
              {theme.description}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-1 flex-1 justify-start min-h-[60px]">
          {isLoading ? (
            <span className="text-muted-foreground dark:text-white/70 text-xs">Carregando tópicos...</span>
          ) : (
            prompts && prompts.length > 0 ? (
              <ul className="space-y-2">
                {prompts.map((prompt) => (
                  <li key={prompt.id} className="flex items-start gap-2">
                    <Circle 
                      className="w-2 h-2 mt-1.5 flex-shrink-0" 
                      fill="#8E9196" 
                      size={8}
                    />
                    <span className="text-xs text-muted-foreground dark:text-white/70 leading-tight">
                      {prompt.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground dark:text-white/70 text-xs">Nenhum tópico encontrado</span>
            )
          )}
        </div>

        <div className="flex justify-center mt-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full py-1 px-3 rounded-lg font-normal text-xs border-primary text-primary hover:bg-primary/10 hover:text-primary dark:bg-black/40 dark:text-white dark:border-white/20 dark:hover:bg-white/10 transition-all"
          >
            Entrar no chat deste tema
          </Button>
        </div>
      </div>
    </Card>
  );
};
