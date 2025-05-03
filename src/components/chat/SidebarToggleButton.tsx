
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarToggleButtonProps {
  isVisible: boolean
  onToggle: () => void
}

export const SidebarToggleButton = ({ isVisible, onToggle }: SidebarToggleButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute top-4 left-56 z-20 text-pump-purple dark:text-white hover:text-pump-purple/90 dark:hover:text-white/90 bg-offwhite dark:bg-[#1A1F2C] rounded-full size-8 p-0"
      onClick={onToggle}
      title={isVisible ? "Ocultar sidebar" : "Exibir sidebar"}
    >
      {isVisible ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isVisible ? "Ocultar sidebar" : "Exibir sidebar"}
      </span>
    </Button>
  )
}
