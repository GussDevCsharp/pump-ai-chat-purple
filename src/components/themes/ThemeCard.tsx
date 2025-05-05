
import React from 'react';

interface ThemeCardProps {
  theme: {
    id: string;
    name: string;
    description: string | null;
    color: string | null;
    prompt?: string | null;
  };
  onSelect: (themeId: string, themeName: string) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onSelect }) => {
  const { id, name, description, color, prompt } = theme;
  
  const bgGradient = color ? color : '#8E9196';
  
  return (
    <button
      onClick={() => onSelect(id, name)}
      className="flex flex-col overflow-hidden rounded-lg w-full bg-offwhite dark:bg-[#222222] border border-[#E5E5E5] dark:border-white/10 hover:shadow-md transition-all"
    >
      <div 
        className="h-3 w-full" 
        style={{ background: bgGradient }}
      />
      <div className="p-4 flex flex-col items-start text-left">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-pump-gray dark:text-gray-300 line-clamp-2 mb-2">
            {description}
          </p>
        )}
        {prompt && (
          <div className="mt-1 w-full">
            <div className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-800 text-pump-gray dark:text-gray-300 rounded-md line-clamp-1">
              {prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};
