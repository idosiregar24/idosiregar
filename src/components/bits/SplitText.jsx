import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const SplitText = ({ 
  text = '', 
  className = '', 
  charClassName = '',
  delay = 0,
  staggerTime = 0.035,
  animateFrom = { opacity: 0, y: 40, rotateX: -90 },
  animateTo = { opacity: 1, y: 0, rotateX: 0 },
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline ${className}`} style={{ perspective: '1000px' }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => {
            const globalIndex = words
              .slice(0, wordIndex)
              .reduce((acc, w) => acc + w.length + 1, 0) + charIndex;

            return (
              <motion.span
                key={`${wordIndex}-${charIndex}`}
                className={`inline-block ${charClassName}`}
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: animateFrom,
                  visible: {
                    ...animateTo,
                    transition: {
                      duration: 0.6,
                      delay: delay + globalIndex * staggerTime,
                      ease: [0.215, 0.61, 0.355, 1],
                    },
                  },
                }}
                style={{ display: 'inline-block', transformOrigin: 'bottom' }}
              >
                {char}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
