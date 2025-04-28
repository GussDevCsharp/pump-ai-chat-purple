
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThemeSearchProps {
  onSearch: (term: string) => void
  value: string
}

export const ThemeSearch: React.FC<ThemeSearchProps> = ({ onSearch, value }) => {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearch(newValue);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pump-gray h-4 w-4" />
      <Input
        type="text"
        placeholder="Pesquisar temas..."
        className="pl-10 pr-10"
        value={searchValue}
        onChange={handleChange}
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-1 text-pump-gray hover:bg-gray-100 rounded-full"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
