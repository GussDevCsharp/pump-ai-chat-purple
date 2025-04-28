
import React from 'react';
import { ThemeCard } from './ThemeCard';
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemeGridProps {
  themes: Array<{
    id: string;
    name: string;
    description: string | null;
    color: string | null;
  }>;
  onSelectTheme: (themeId: string, themeName: string) => void;
  isLoading: boolean;
}

export const ThemeGrid: React.FC<ThemeGridProps> = ({ themes, onSelectTheme, isLoading }) => {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-pump-gray">Carregando temas...</p>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-pump-gray">
          Nenhum tema encontrado. Você pode criar um novo tema ou iniciar uma conversa geral.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 
      grid-cols-1
      ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
      w-full`}
    >
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          onSelect={onSelectTheme}
        />
      ))}
    </div>
  );
};
