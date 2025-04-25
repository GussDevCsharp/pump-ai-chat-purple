
import React, { useEffect, useState } from 'react';

const AnimatedNeuralHeading = ({ text }: { text: string }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const animateText = async () => {
      setDisplayText('');
      
      // Animate each word with a neural-like effect
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex];
        
        // First show scrambled letters
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => {
            timeoutId = setTimeout(() => {
              setDisplayText(prev => {
                const scrambled = words.map((w, idx) => 
                  idx === wordIndex 
                    ? Array(w.length).fill('').map(() => 
                        String.fromCharCode(Math.floor(Math.random() * 26) + 65)
                      ).join('')
                    : idx < wordIndex ? w : ''
                ).join(' ');
                return scrambled;
              });
              resolve(null);
            }, 50);
          });
        }
        
        // Then show the actual word
        await new Promise(resolve => {
          timeoutId = setTimeout(() => {
            setDisplayText(prev => {
              return words.slice(0, wordIndex + 1).join(' ');
            });
            resolve(null);
          }, 100);
        });
      }
      
      setIsAnimating(false);
    };

    if (isAnimating) {
      animateText();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAnimating, words]);

  return (
    <h1 
      className={`text-5xl font-bold text-pump-purple text-center leading-tight max-w-lg transition-opacity duration-300
        ${isAnimating ? 'opacity-80' : 'opacity-100'}`}
    >
      {displayText || text}
    </h1>
  );
};

export default AnimatedNeuralHeading;
