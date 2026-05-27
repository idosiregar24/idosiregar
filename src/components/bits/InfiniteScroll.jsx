import React from 'react';
import { motion } from 'framer-motion';

const InfiniteScroll = ({
  items = [],
  speed = 30,
  direction = 'left',
  className = '',
  itemClassName = '',
  separator = '•',
  pauseOnHover = true,
}) => {
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-dark-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-dark-950 to-transparent pointer-events-none" />

      <motion.div
        className={`flex items-center gap-8 whitespace-nowrap ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <React.Fragment key={index}>
            <span className={`inline-flex items-center gap-3 shrink-0 ${itemClassName}`}>
              {item}
            </span>
            {index < duplicatedItems.length - 1 && (
              <span className="text-lime/30 text-xl shrink-0">{separator}</span>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;
