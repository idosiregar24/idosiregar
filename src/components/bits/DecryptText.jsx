import React, { useState, useEffect, useCallback, useRef } from 'react';

const DecryptText = ({
  text = '',
  className = '',
  speed = 50,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*',
  trigger = 'view', // 'view' | 'hover' | 'auto'
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState(text.replace(/[^\s]/g, '_'));
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [hasDecrypted, setHasDecrypted] = useState(false);
  const ref = useRef(null);

  const decrypt = useCallback(() => {
    if (isDecrypting || hasDecrypted) return;
    setIsDecrypting(true);

    let iteration = 0;
    const totalChars = text.replace(/\s/g, '').length;
    const revealOrder = Array.from({ length: text.length }, (_, i) => i)
      .filter((i) => text[i] !== ' ')
      .sort(() => Math.random() - 0.5);

    const revealed = new Set();

    const interval = setInterval(() => {
      const newText = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (revealed.has(i)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayText(newText);

      if (iteration < revealOrder.length) {
        revealed.add(revealOrder[iteration]);
      }

      iteration++;

      if (revealed.size >= totalChars) {
        clearInterval(interval);
        setDisplayText(text);
        setIsDecrypting(false);
        setHasDecrypted(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, chars, isDecrypting, hasDecrypted, onComplete]);

  useEffect(() => {
    if (trigger === 'auto') {
      const timeout = setTimeout(decrypt, 500);
      return () => clearTimeout(timeout);
    }
  }, [trigger, decrypt]);

  useEffect(() => {
    if (trigger !== 'view') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          decrypt();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger, decrypt]);

  return (
    <span
      ref={ref}
      className={`font-mono ${className}`}
      onMouseEnter={trigger === 'hover' ? decrypt : undefined}
      style={{ whiteSpace: 'pre' }}
    >
      {displayText}
    </span>
  );
};

export default DecryptText;
