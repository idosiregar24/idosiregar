import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';
import Hero3D from '../bits/Hero3D';
import { supabase } from '../../lib/supabase';

const Hero = () => {
  const [settings, setSettings] = useState({
    badge_text: 'Available for new projects',
    badge_live: true,
    title_white: 'Designing the',
    title_muted: 'digital future.',
    description: 'Fullstack Developer & UI/UX Designer specializing in building exceptional, human-centered digital experiences with modern web technologies.',
    primary_cta: {
      text: 'Explore Projects',
      link: '#portfolio'
    },
    secondary_cta: {
      text: 'Download CV',
      link: '#'
    },
    profile_image: 'https://images.unsplash.com/photo-1555952517-2e8af1a4f6fa?auto=format&fit=crop&q=80&w=800',
    profile_name: 'Ido',
    profile_role: 'Developer'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hero')
          .single();
        if (data && data.value) {
          setSettings(data.value);
        }
      } catch (err) {
        console.error('Error fetching hero settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-black bg-grid-pattern border-b border-white/[0.05] overflow-hidden">
      
      {/* Subtle 3D Abstract Background */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <Hero3D />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-start space-y-8"
        >
          {settings.badge_text && (
            <Badge variant="outline" className="px-3 py-1.5 apple-glass rounded-full text-xs text-white/80 border-white/10">
               {settings.badge_live && <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />}
               {settings.badge_text}
            </Badge>
          )}

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            {settings.title_white} <br />
            <span className="text-white/40">{settings.title_muted}</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-lg leading-relaxed font-medium">
            {settings.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            {settings.primary_cta && (
              <button 
                onClick={() => handleScroll(settings.primary_cta.link)}
                className="w-full sm:w-auto btn-primary px-8 cursor-pointer"
              >
                {settings.primary_cta.text}
              </button>
            )}
            {settings.secondary_cta && (
              <button 
                onClick={() => handleScroll(settings.secondary_cta.link)}
                className="w-full sm:w-auto btn-outline px-8 cursor-pointer"
              >
                {settings.secondary_cta.text}
              </button>
            )}
          </div>
        </motion.div>

        {/* Right Side: Photo with VisionOS Glassmorphism */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex-1 w-full max-w-md lg:max-w-none relative"
        >
          {/* Subtle floating animation */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative"
          >
            {/* Ambient glow behind image container */}
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-[3rem] transform scale-105" />
            
            {/* The VisionOS style container */}
            <div className="relative aspect-[4/5] lg:aspect-square w-full apple-glass-heavy rounded-[3rem] p-4 flex flex-col overflow-hidden">
               
               {/* Window header decoration */}
               <div className="flex justify-center mb-4 gap-1.5 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
               </div>

               {/* Photo */}
               <div className="flex-1 rounded-[2rem] overflow-hidden bg-dark-900 border border-white/5 relative shadow-inner">
                  <img 
                    src={settings.profile_image} 
                    alt={settings.profile_name || "Ido"} 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1555952517-2e8af1a4f6fa?auto=format&fit=crop&q=80&w=800"; }} // Fallback
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
               </div>

               {/* Name Tag overlapping */}
               {(settings.profile_name || settings.profile_role) && (
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 apple-glass px-6 py-3 rounded-full flex items-center gap-3 w-max">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-white leading-none mb-1">{settings.profile_name}</span>
                       <span className="text-[10px] text-white/50 uppercase tracking-widest leading-none">{settings.profile_role}</span>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
