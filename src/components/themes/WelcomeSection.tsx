
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useChatAuth } from "@/hooks/useChatAuth";
import { useTheme } from "@/hooks/useTheme";

interface WelcomeSectionProps {
  onNewChat: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNewChat }) => {
  const { user } = useChatAuth();
  const { isDark } = useTheme();

  return (
    <div className="w-full text-left flex justify-between items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2 font-sans">
        Olá, {user?.user_metadata?.full_name || 'Empresário'}
      </h1>
      <Button 
        onClick={onNewChat}
        size="lg"
        className={`${isDark 
          ? 'bg-pump-gray hover:bg-pump-gray/90 text-white' 
          : 'bg-white text-pump-gray border border-gray-300 hover:bg-gray-100'} rounded-lg px-5 py-2 text-base transition-all duration-200`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Novo Chat
      </Button>
    </div>
  );
};
