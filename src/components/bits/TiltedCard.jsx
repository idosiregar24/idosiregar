import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltedCard = ({
  children,
  className = '',
  tiltIntensity = 15,
  glareOpacity = 0.15,
  perspective = 1000,
  scale = 1.02,
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (y - 0.5) * tiltIntensity * -1,
      y: (x - 0.5) * tiltIntensity,
    });

    setGlare({
      x: x * 100,
      y: y * 100,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovering ? scale : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: `${perspective}px`, transformStyle: 'preserve-3d' }}
    >
      {children}

      {/* Glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
        style={{ opacity: isHovering ? 1 : 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export default TiltedCard;
