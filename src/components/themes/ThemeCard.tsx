
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
        flex flex-col h-[340px] rounded-2xl border-2 border-pump-gray/10 hover:shadow-2xl 
        transform transition-all duration-200 cursor-pointer
        hover:scale-105 shadow-md group
        px-4 py-3
      `}
      style={{
        borderColor: theme.color || "#e9e3fc"
      }}
    >
      <div className="flex flex-col flex-1 justify-between h-full bg-white p-2">
        <div>
          <div className="flex items-center gap-2 mb-2 mt-2">
            <div 
              className="w-10 h-10 flex items-center justify-center rounded-full"
              style={{
                background: theme.color ? `${theme.color}20` : "#f4ebfd",
              }}
            >
              <span 
                className="font-bold text-xl"
                style={{
                  color: theme.color || "#7E1CC6"
                }}
              >{theme.name.charAt(0)}</span>
            </div>
            <h3 className="font-normal text-xl text-gray-900 leading-tight">{theme.name}</h3>
          </div>
          {theme.description && (
            <p className="text-sm text-pump-gray mt-2 mb-2 px-1 max-h-[40px] overflow-hidden">
              {theme.description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1 mt-1 flex-1 justify-start min-h-[74px]">
          {isLoading ? (
            <span className="text-pump-gray text-sm">Carregando tópicos...</span>
          ) : (
            prompts && prompts.length > 0 ? (
              <ul className="list-disc pl-4 text-sm text-gray-700">
                {prompts.map((prompt) => (
                  <li key={prompt.id} className="truncate">{prompt.title}</li>
                ))}
              </ul>
            ) : (
              <span className="text-pump-gray text-sm">Nenhum tópico encontrado</span>
            )
          )}
        </div>
        <div className="flex justify-center mt-2">
          <Button
            size="lg"
            variant="outline"
            className="w-full py-2 px-5 rounded-lg font-normal border-pump-purple text-pump-purple hover:bg-pump-purple/10 hover:text-pump-purple bg-white transition-all"
          >
            Entrar no chat deste tema
          </Button>
        </div>
      </div>
    </Card>
  );
};
