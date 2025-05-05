
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
  
  const bgGradient = color ? color : '#8E9196';

  useEffect(() => {
    const fetchThemePrompts = async () => {
      try {
        const { data, error } = await supabase
          .from("theme_prompts")
          .select("title")
          .eq("theme_id", id)
          .limit(3);
          
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
      className="flex flex-col overflow-hidden rounded-lg w-full h-full bg-white dark:bg-[#222222] border border-[#E5E5E5] dark:border-white/10 hover:shadow-md transition-all"
    >
      <div 
        className="h-3 w-full" 
        style={{ background: bgGradient }}
      />
      <div className="p-4 flex-1 flex flex-col items-start text-left">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-pump-gray dark:text-gray-300 line-clamp-2 mb-2">
            {description}
          </p>
        )}
        
        {/* Subtemas */}
        {themePrompts.length > 0 && (
          <div className="mt-2 w-full space-y-1">
            {themePrompts.map((prompt, index) => (
              <div key={index} className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-800 text-pump-gray dark:text-gray-300 rounded-md line-clamp-1">
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
