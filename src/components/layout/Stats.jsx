import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Stats = () => {
  const [stats, setStats] = useState([
    { label: 'Years Experience', value: '2+' },
    { label: 'Completed Projects', value: '15+' },
    { label: 'Technologies', value: '20+' },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'stats')
          .single();
        if (data && data.value && data.value.items) {
          setStats(data.value.items);
        }
      } catch (err) {
        console.error('Error fetching stats settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="apple-glass rounded-[2.5rem] p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center justify-center py-4 md:py-0"
              >
                <span className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tighter">{stat.value}</span>
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
