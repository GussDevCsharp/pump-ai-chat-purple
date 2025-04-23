
import { UserRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SidebarFooter() {
  return (
    <div className="border-t border-pump-gray/20 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pump-purple/10 flex items-center justify-center">
            <UserRound className="w-4 h-4 text-pump-purple" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Usuário</span>
            <span className="text-xs text-pump-gray">Empresa</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-pump-gray hover:text-pump-purple">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
