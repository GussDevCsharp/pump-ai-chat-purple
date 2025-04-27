
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
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-sans">
        Olá {user?.user_metadata?.full_name || 'Empresário'}, sou a inteligencia da sua empresa
      </h1>
      <p className="text-base text-pump-gray mb-4">
        Suporte 24 horas personalizado para seu negócio
      </p>
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
