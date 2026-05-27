import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Briefcase, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const About = () => {
  const [aboutData, setAboutData] = useState({
    description: '',
    years_exp: '',
    projects_completed: '',
    education: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about')
          .single();

        if (data && data.value) {
          setAboutData({
            description: data.value.description || '',
            years_exp: data.value.years_exp || '',
            projects_completed: data.value.projects_completed || '',
            education: data.value.education || []
          });
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) return null; // or a loader

  return (
    <section id="about" className="py-32 bg-black relative border-t border-white/[0.05] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          
          {/* Left Column: About Me */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white">
              About Me
            </h2>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed font-medium whitespace-pre-wrap">
              {aboutData.description || 'No description provided yet.'}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
               <div className="p-6 apple-glass rounded-[2rem]">
                  <h4 className="text-3xl font-bold text-white mb-2">{aboutData.years_exp || '0'}</h4>
                  <p className="text-sm text-white/50 font-semibold">Years of Experience</p>
               </div>
               <div className="p-6 apple-glass rounded-[2rem]">
                  <h4 className="text-3xl font-bold text-white mb-2">{aboutData.projects_completed || '0'}</h4>
                  <p className="text-sm text-white/50 font-semibold">Projects Completed</p>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Education */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white flex items-center gap-4">
              Education
              <GraduationCap className="w-10 h-10 text-white/20" />
            </h2>
            
            <div className="relative border-l border-white/10 ml-4 mt-4 space-y-12 pb-4">
              {aboutData.education.map((item, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-white ring-4 ring-black" />
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white/40 tracking-wider uppercase mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {item.degree}
                    </h3>
                    <h4 className="text-base font-semibold text-white/70 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {item.institution}
                    </h4>
                    <p className="text-white/50 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
