import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { supabase } from '../../lib/supabase';
import { Loader2, Award, ExternalLink } from 'lucide-react';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAchievements(data || []);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(achievements.map(a => a.category))];
  
  // If no data yet, show default categories
  if (categories.length === 1) categories.push('Multimedia & Broadcasting', 'Business & Innovation', 'Video Production');

  const filterData = (category) => {
    if (category === 'All') return achievements;
    return achievements.filter(a => a.category === category);
  };

  return (
    <section id="achievements" className="py-32 bg-black relative border-t border-white/[0.05]">
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-4">
              <Award className="w-10 h-10 text-white/50" />
              Achievements
            </h2>
            <p className="text-white/50 text-lg">My extended journey, milestones, and experiences.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-white/30 w-8 h-8" /></div>
        ) : achievements.length === 0 ? (
          <div className="apple-glass rounded-3xl p-12 text-center text-white/50">
             <p>No achievements added yet.</p>
          </div>
        ) : (
          <TabGroup>
            <TabList className="flex flex-wrap gap-2 mb-12 apple-glass p-2 rounded-full w-fit">
              {categories.map((cat) => (
                <Tab
                  key={cat}
                  className={({ selected }) =>
                    `px-5 py-2 rounded-full text-sm font-semibold transition-all outline-none cursor-pointer ${
                      selected
                        ? 'bg-white text-black shadow-sm'
                        : 'text-white/50 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {cat}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {categories.map((cat) => (
                <TabPanel key={cat} className="outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filterData(cat).map((item, idx) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                          className="apple-glass rounded-[2rem] p-6 hover:bg-white/[0.05] transition-colors border border-white/5 flex flex-col group"
                        >
                          {item.image_url && (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-dark-950 border border-white/5">
                              <img 
                                src={item.image_url} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                              />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white tracking-widest uppercase">
                              {item.category}
                            </span>
                            {item.year && (
                              <span className="text-xs text-white/40 font-semibold bg-white/[0.02] px-2 py-1 rounded">
                                {item.year}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                            {item.title}
                          </h3>
                          <p className="text-sm text-white/50 leading-relaxed font-medium whitespace-pre-wrap">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        )}
      </div>
    </section>
  );
};

export default Achievements;
