import React, { useState, useEffect, useCallback, useRef } from 'react';

const TextScramble = ({
  text = '',
  className = '',
  speed = 30,
  scrambleDuration = 1500,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%',
  trigger = 'view', // 'view' | 'hover' | 'auto'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef(null);
  const hasTriggered = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);

      const newText = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          const charProgress = i / text.length;
          if (progress > charProgress + 0.3) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayText(newText);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, scrambleDuration, chars, isScrambling]);

  useEffect(() => {
    if (trigger === 'auto') {
      const timeout = setTimeout(scramble, 300);
      return () => clearTimeout(timeout);
    }
  }, [trigger, scramble]);

  useEffect(() => {
    if (trigger !== 'view') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          scramble();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger, scramble]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {displayText}
    </span>
  );
};

export default TextScramble;
