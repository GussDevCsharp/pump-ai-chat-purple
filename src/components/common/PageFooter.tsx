
import React from 'react';
import { Copyright } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const PageFooter = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="mt-auto bg-pump-purple py-4 sm:py-6">
      <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-white gap-4 sm:gap-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm justify-center sm:justify-start">
          <Copyright className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{new Date().getFullYear()} ChatPump. Todos os direitos reservados.</span>
        </div>
        <div className="flex gap-4 text-xs sm:text-sm justify-center sm:justify-start">
          <a href="#" className="hover:text-white/80 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white/80 transition-colors">Termos</a>
          <a href="#" className="hover:text-white/80 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
};
