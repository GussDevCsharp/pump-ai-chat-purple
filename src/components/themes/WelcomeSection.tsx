
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
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 font-sans">
        Olá, {user?.user_metadata?.full_name || 'Empresário'}
      </h1>
      <p className="text-lg text-pump-gray mb-6">
        Suporte 24 horas personalizado para seu negócio
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={onNewChat}
          size="lg"
          className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-lg px-7 py-3 text-lg"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Novo Chat
        </Button>
      </div>
    </div>
  );
};
