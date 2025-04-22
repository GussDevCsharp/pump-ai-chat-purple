
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCard } from '@/components/common/UserCard';

export const FormHeader = () => {
  return (
    <header className="border-b border-pump-gray/20 p-4 relative z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <img 
            src="/lovable-uploads/5f403064-9209-4921-b73b-0f70c739981a.png" 
            alt="Pump.ia"
            className="h-8"
          />
        </Link>
        <UserCard />
      </div>
    </header>
  );
};
