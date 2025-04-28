
import React from 'react'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ThemeSearchProps {
  onSearch: (term: string) => void
  value: string
}

export const ThemeSearch: React.FC<ThemeSearchProps> = ({ onSearch, value }) => {
  return (
    <div className="relative w-full md:w-96">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pump-gray h-4 w-4" />
      <Input
        type="text"
        placeholder="Pesquisar temas..."
        className="pl-10"
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
