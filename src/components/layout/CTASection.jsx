import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    heading: "Let's create the next big thing.",
    description: "Have a project in mind or want to collaborate? I'm currently open to new opportunities and freelance work globally.",
    primary_button: {
      text: "Start a Conversation",
      link: "mailto:hello@idosolutions.com"
    },
    secondary_button: {
      text: "Copy Email Address",
      email: "hello@idosolutions.com"
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cta')
          .single();
        if (data && data.value) {
          setSettings(data.value);
        }
      } catch (err) {
        console.error('Error fetching CTA settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleCopyEmail = () => {
    if (!settings.secondary_button?.email) return;
    navigator.clipboard.writeText(settings.secondary_button.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cta" className="py-32 bg-black relative border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            {settings.heading}
          </h2>
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            {settings.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {settings.primary_button && (
              <a 
                href={settings.primary_button.link}
                className="w-full sm:w-auto btn-primary px-10 py-4 text-base inline-block rounded-full font-semibold"
              >
                {settings.primary_button.text}
              </a>
            )}
            {settings.secondary_button && (
              <button 
                onClick={handleCopyEmail}
                className="w-full sm:w-auto btn-outline px-10 py-4 text-base rounded-full font-semibold cursor-pointer relative"
              >
                {copied ? 'Copied to Clipboard!' : settings.secondary_button.text}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
