
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const { id, name, description, color } = theme;
  const [themePrompts, setThemePrompts] = useState<{title: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const bgColor = color ? color : '#8E9196';
  const firstLetter = name.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchThemePrompts = async () => {
      try {
        // Removida a limitação de 3 subtemas para buscar todos
        const { data, error } = await supabase
          .from("theme_prompts")
          .select("title")
          .eq("theme_id", id);
          
        if (error) {
          console.error("Erro ao buscar subtemas:", error);
        } else {
          setThemePrompts(data || []);
        }
      } catch (err) {
        console.error("Erro ao buscar subtemas:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchThemePrompts();
  }, [id]);
  
  return (
    <button
      onClick={() => onSelect(id, name)}
      className="flex flex-col overflow-hidden rounded-lg w-full h-full card-glassmorphism card-hover"
    >
      <div className="p-4 flex-1 flex flex-col items-start text-left relative">
        <div 
          className="absolute -top-10 -left-10 w-24 h-24 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20"
          style={{ background: bgColor }}
        />
        
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold transition-transform duration-300 group-hover:scale-110" 
            style={{ background: bgColor }}
          >
            {firstLetter}
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">{name}</h3>
        </div>
        
        {description && (
          <p className="text-sm text-pump-gray dark:text-gray-300 line-clamp-2 mb-2">
            {description}
          </p>
        )}
        
        {themePrompts.length > 0 && (
          <div className="mt-2 w-full space-y-1">
            {themePrompts.map((prompt, index) => (
              <div 
                key={index} 
                className="text-xs py-1 px-2 glassmorphism text-pump-gray dark:text-gray-300 rounded-md line-clamp-1 transition-all duration-300 group-hover:translate-x-1"
              >
                {prompt.title}
              </div>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="mt-2 w-full space-y-1">
            <div className="h-5 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
            <div className="h-5 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>
          </div>
        )}
      </div>
    </button>
  );
};
