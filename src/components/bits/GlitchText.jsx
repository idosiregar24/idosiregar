import React, { useState, useEffect, useRef, useCallback } from 'react';

const GlitchText = ({ 
  text = 'GLITCH', 
  className = '', 
  glitchInterval = 3000,
  glitchDuration = 200,
  glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`' 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef(null);

  const glitch = useCallback(() => {
    setIsGlitching(true);
    let iterations = 0;
    const maxIterations = 6;

    const glitchLoop = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (Math.random() < 0.4) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
          })
          .join('')
      );

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(glitchLoop);
        setDisplayText(text);
        setIsGlitching(false);
      }
    }, glitchDuration / maxIterations);
  }, [text, glitchDuration, glitchChars]);

  useEffect(() => {
    intervalRef.current = setInterval(glitch, glitchInterval);
    return () => clearInterval(intervalRef.current);
  }, [glitch, glitchInterval]);

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={glitch}
    >
      <span className="relative z-10">{displayText}</span>
      {isGlitching && (
        <>
          <span 
            className="absolute top-0 left-0 z-0 opacity-70" 
            style={{ 
              color: '#BEF264', 
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)` 
            }}
          >
            {displayText}
          </span>
          <span 
            className="absolute top-0 left-0 z-0 opacity-70" 
            style={{ 
              color: '#60A5FA', 
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)` 
            }}
          >
            {displayText}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
