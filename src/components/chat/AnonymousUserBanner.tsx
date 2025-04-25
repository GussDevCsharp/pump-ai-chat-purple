
import React from 'react';

interface AnonymousUserBannerProps {
  remainingInteractions: number;
}

export const AnonymousUserBanner: React.FC<AnonymousUserBannerProps> = ({ 
  remainingInteractions 
}) => {
  return (
    <div className="bg-blue-50 p-3 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <span className="text-sm text-blue-700">
          Modo visitante: {remainingInteractions} interações restantes hoje
        </span>
      </div>
    </div>
  );
};
