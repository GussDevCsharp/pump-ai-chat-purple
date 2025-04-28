
import React from 'react';
import { Copyright } from 'lucide-react';

export const PageFooter = () => {
  return (
    <footer className="mt-auto bg-pump-purple py-6">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 text-sm">
          <Copyright className="w-4 h-4" />
          <span>{new Date().getFullYear()} ChatPump. Todos os direitos reservados.</span>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-white/80 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white/80 transition-colors">Termos</a>
          <a href="#" className="hover:text-white/80 transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  );
};
