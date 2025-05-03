
import { useState } from 'react';
import { ChatHeader } from "./ChatHeader";
import { ChatContainer } from "./ChatContainer";
import { ChatSidebar } from "./ChatSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const ChatLayout = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Additional state listener from ChatContainer
  const handleSidebarToggle = (isVisible: boolean) => {
    setSidebarVisible(isVisible);
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-offwhite dark:bg-[#1A1F2C] overflow-hidden">
        <ChatHeader
          mobileMenuButton={
            isMobile ? (
              <SidebarTrigger onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
            ) : undefined
          }
        />
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar 
            onClose={() => setMobileMenuOpen(false)} 
            sidebarVisible={sidebarVisible}
          />
          <ChatContainer 
            onSidebarToggle={handleSidebarToggle}
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible} 
          />
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};
