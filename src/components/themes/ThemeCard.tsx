
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemePrompts } from "@/hooks/useThemePrompts";

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
        flex flex-col h-[320px] rounded-xl border border-pump-gray/10 hover:shadow-xl 
        transform transition-all duration-200 cursor-pointer
        hover:scale-[1.02] shadow-md group
        px-3 py-2
      `}
      style={{
        borderColor: theme.color || "#e9e3fc"
      }}
    >
      <div className="flex flex-col flex-1 justify-between h-full bg-white p-2">
        <div>
          <div className="flex items-center gap-2 mb-2 mt-1">
            <div 
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{
                background: theme.color ? `${theme.color}20` : "#f4ebfd",
              }}
            >
              <span 
                className="font-bold text-base"
                style={{
                  color: theme.color || "#7E1CC6"
                }}
              >{theme.name.charAt(0)}</span>
            </div>
            <h3 className="font-normal text-base text-gray-900 leading-tight">{theme.name}</h3>
          </div>
          {theme.description && (
            <p className="text-xs text-pump-gray mt-1 mb-1 px-1 max-h-[30px] overflow-hidden">
              {theme.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-1 flex-1 justify-start min-h-[60px]">
          {isLoading ? (
            <span className="text-pump-gray text-xs">Carregando tópicos...</span>
          ) : (
            prompts && prompts.length > 0 ? (
              <ul className="list-disc pl-4 text-xs text-gray-700">
                {prompts.map((prompt) => (
                  <li key={prompt.id} className="truncate">{prompt.title}</li>
                ))}
              </ul>
            ) : (
              <span className="text-pump-gray text-xs">Nenhum tópico encontrado</span>
            )
          )}
        </div>
        <div className="flex justify-center mt-1">
          <Button
            size="sm"
            variant="outline"
            className="w-full py-1 px-3 rounded-lg font-normal text-xs border-pump-purple text-pump-purple hover:bg-pump-purple/10 hover:text-pump-purple bg-white transition-all"
          >
            Entrar no chat deste tema
          </Button>
        </div>
      </div>
    </Card>
  );
};
