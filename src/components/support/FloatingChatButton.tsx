
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const FloatingChatButton = () => {
  const handleSupportChat = () => {
    // TODO: Implement support chat functionality
    console.log('Opening support chat...');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleSupportChat}
        className="bg-pump-purple hover:bg-pump-purple/90 text-white rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};
