
import { useEffect, useState } from 'react';

export const useTheme = () => {
  // Verifica o localStorage na inicialização ou usa o modo claro (isDark = false) como padrão
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Se houver um tema salvo, use-o, caso contrário, comece com modo claro (offwhite)
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Aplica a classe 'dark' quando isDark for true
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return { isDark, toggleTheme };
};
