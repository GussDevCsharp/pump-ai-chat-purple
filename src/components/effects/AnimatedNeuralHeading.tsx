
import React, { useEffect, useState } from 'react';

const AnimatedNeuralHeading = ({ text }: { text: string }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const words = text.split(' ');

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    
    const animateText = async () => {
      setDisplayText('');
      let currentText = '';
      
      // Animate each word with a neural-like effect
      for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        const word = words[wordIndex];
        
        // First show scrambled letters for the current word
        for (let i = 0; i < 5; i++) {
          const id = setTimeout(() => {
            const currentWords = currentText.split(' ').filter(Boolean);
            
            // Generate scrambled version of the current word
            const scrambledWord = Array(word.length).fill('').map(() => 
              String.fromCharCode(Math.floor(Math.random() * 26) + 97)
            ).join('');
            
            // Combine previous words with the scrambled current word
            const newText = [...currentWords, scrambledWord].join(' ');
            setDisplayText(newText);
          }, 80 * i + (wordIndex * 500));
          
          timeoutIds.push(id);
        }
        
        // Then show the actual word
        const revealId = setTimeout(() => {
          currentText = words.slice(0, wordIndex + 1).join(' ');
          setDisplayText(currentText);
          
          // If this is the last word, mark animation as complete
          if (wordIndex === words.length - 1) {
            setIsAnimating(false);
          }
        }, 80 * 5 + (wordIndex * 500));
        
        timeoutIds.push(revealId);
      }
    };

    if (isAnimating) {
      animateText();
    }

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <h1 
      className={`
        relative text-5xl font-bold text-pump-purple text-center leading-tight max-w-lg
        transition-opacity duration-300 ${isAnimating ? 'opacity-90' : 'opacity-100'}
        before:content-[attr(data-text)] before:absolute before:left-0 before:top-0 
        before:w-full before:h-full before:text-pump-purple
        after:content-[attr(data-text)] after:absolute after:left-0 after:top-0
        after:w-full after:h-full after:text-pump-purple
        animate-glitch
      `}
      data-text={displayText || text.charAt(0)}
    >
      {displayText || text.charAt(0)}
    </h1>
  );
};

export default AnimatedNeuralHeading;
