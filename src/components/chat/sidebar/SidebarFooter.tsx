
import { UserCardMenu } from "@/components/common/UserCardMenu"

export function SidebarFooter() {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-pump-gray/20 p-4">
      <UserCardMenu />
    </div>
  )
}
