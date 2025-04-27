
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useChatAuth } from "@/hooks/useChatAuth";

interface WelcomeSectionProps {
  onNewChat: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onNewChat }) => {
  const { user } = useChatAuth();

  return (
    <div className="w-full text-left">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2 font-sans">
        Olá, {user?.user_metadata?.full_name || 'Empresário'}
      </h1>
      <div className="flex gap-4">
        <Button 
          onClick={onNewChat}
          size="lg"
          className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-lg px-5 py-2 text-base"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Novo Chat
        </Button>
      </div>
    </div>
  );
};

