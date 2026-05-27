import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('Ido Refael');
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    // Fetch the name from Hero settings
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero')
          .single();
        if (data && data.value && data.value.profile_name) {
          setName(data.value.profile_name);
        }
      } catch (err) {
        console.error('Error fetching name for cursor:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target.closest('[data-project-title]');
      if (target) {
        setHoverInfo({
          title: target.getAttribute('data-project-title'),
          tech: target.getAttribute('data-project-tech')
        });
      } else {
        setHoverInfo(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: hoverInfo ? 20 : 40, stiffness: hoverInfo ? 300 : 500, mass: 0.2 }}
          className={hoverInfo 
            ? "fixed pointer-events-none z-[9999] max-w-[220px] text-center border border-white/10 bg-dark-950/90 backdrop-blur-md rounded-xl p-3 shadow-2xl"
            : "fixed pointer-events-none z-[9999] flex items-center border border-white/10 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl mix-blend-difference"
          }
          style={{
            left: mousePosition.x + (hoverInfo ? 20 : 16),
            top: mousePosition.y + (hoverInfo ? 20 : 16),
          }}
        >
          {hoverInfo ? (
            <>
              <p className="font-semibold mb-1 text-white text-sm">{hoverInfo.title}</p>
              <p className="text-[10px] text-white/50">{hoverInfo.tech ? `Tech: ${hoverInfo.tech}` : 'Click to view full details'}</p>
            </>
          ) : (
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">{name}</span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomCursor;
