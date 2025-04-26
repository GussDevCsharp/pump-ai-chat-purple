
import { Search } from "lucide-react"

interface SidebarSearchProps {
  onSearch: () => void
}

export function SidebarSearch({ onSearch }: SidebarSearchProps) {
  return (
    <button 
      className="p-2 hover:bg-pump-gray-light rounded"
      onClick={onSearch}
    >
      <Search className="w-5 h-5 text-pump-gray" />
    </button>
  )
}
