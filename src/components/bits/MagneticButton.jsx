import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({
  children,
  className = '',
  intensity = 0.4,
  radius = 200,
  springConfig = { stiffness: 150, damping: 15, mass: 0.1 },
}) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < radius) {
      setPosition({
        x: distanceX * intensity,
        y: distanceY * intensity,
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={buttonRef}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', ...springConfig }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
