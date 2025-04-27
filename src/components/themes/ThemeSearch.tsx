
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search } from 'lucide-react';
import { ChatTheme } from '@/hooks/useChatThemes';

interface ThemeSearchProps {
  themes: ChatTheme[];
  onSelectTheme: (themeId: string, themeName: string) => void;
  isLoading: boolean;
}

export const ThemeSearch = ({ themes, onSelectTheme, isLoading }: ThemeSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredThemes, setFilteredThemes] = useState<ChatTheme[]>([]);
  
  // Filter themes based on search term
  useEffect(() => {
    if (!themes) {
      setFilteredThemes([]);
      return;
    }
    
    const filtered = searchTerm.trim() === '' 
      ? themes 
      : themes.filter(theme => 
          theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (theme.description && theme.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
    setFilteredThemes(filtered);
  }, [themes, searchTerm]);
  
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="h-12 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <CommandInput 
            placeholder="Pesquisar temas e prompts..."
            className="h-11"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
        </div>
        
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {filteredThemes && filteredThemes.length > 0 ? (
            filteredThemes.map((theme) => (
              <CommandGroup key={theme.id} heading={theme.name} className="px-2">
                <CommandItem
                  className="flex items-start gap-2 p-2 cursor-pointer hover:bg-pump-purple/10"
                  onSelect={() => onSelectTheme(theme.id, theme.name)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{theme.name}</span>
                    {theme.description && (
                      <span className="text-sm text-gray-500">{theme.description}</span>
                    )}
                  </div>
                </CommandItem>
              </CommandGroup>
            ))
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
};
