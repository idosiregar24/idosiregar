import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Features = () => {
  const [settings, setSettings] = useState({
    title: 'Core Competencies',
    subtitle: 'A comprehensive skill set bridging the gap between design and robust technical implementation.',
    skills: [
      { 
        name: 'Backend Architecture', 
        tech: 'Laravel, Node.js, PostgreSQL, Redis', 
        detail: 'Expertise in designing scalable architectures, RESTful APIs, and database optimization.'
      },
      { 
        name: 'Frontend Engineering', 
        tech: 'React, Next.js, Tailwind CSS', 
        detail: 'Building performant SPAs and SSR applications with modern React patterns.'
      },
      { 
        name: 'Cloud & DevOps', 
        tech: 'AWS, Docker, CI/CD', 
        detail: 'Containerized deployments and automated delivery pipelines.'
      },
      { 
        name: 'UI/UX Design', 
        tech: 'Figma, Design Thinking', 
        detail: 'Human-centered design, user research, and interactive prototyping.'
      }
    ]
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'features')
          .single();
        if (data && data.value) {
          setSettings(data.value);
        }
      } catch (err) {
        console.error('Error fetching features settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section id="features" className="py-32 bg-black relative border-t border-white/[0.05] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white"
          >
            {settings.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {settings.subtitle}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(settings.skills || []).map((skill, i) => (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               key={skill.name} 
               className="p-8 rounded-[2rem] apple-glass transition-all duration-500 hover:scale-[1.02] hover:bg-white/[0.05] group cursor-default"
             >
                <div className="mb-6 flex items-center justify-between">
                   <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">{skill.name}</h3>
                   <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-white/50 group-hover:bg-white/10 group-hover:text-white transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                   </div>
                </div>
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-white/[0.05] rounded-full text-xs font-semibold text-white/70 tracking-wide uppercase">
                    {skill.tech}
                  </span>
                  <p className="text-base text-white/50 leading-relaxed">
                     {skill.detail}
                  </p>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
