import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const Footer = () => {
  const [settings, setSettings] = useState({
    brand_text: 'Ido Refael Siregar',
    location: 'Jakarta, ID',
    social_links: [
      { label: 'GitHub', url: 'https://github.com' },
      { label: 'LinkedIn', url: 'https://linkedin.com' },
      { label: 'X (Twitter)', url: 'https://x.com' },
      { label: 'Instagram', url: 'https://instagram.com' }
    ],
    copyright: 'Designed with precision. © {year} Ido Refael Siregar.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'footer')
          .single();
        if (data && data.value) {
          setSettings(data.value);
        }
      } catch (err) {
        console.error('Error fetching footer settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const getFormattedCopyright = () => {
    const year = new Date().getFullYear();
    const copyrightTemplate = settings.copyright || 'Designed with precision. © {year} Ido Refael Siregar.';
    return copyrightTemplate.replace('{year}', year);
  };

  return (
    <footer className="bg-black py-16 border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-3 select-none">
             <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white leading-none mb-1">
                  {settings.brand_text}
                </span>
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-none">
                  {settings.location}
                </span>
             </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-white/50">
            {(settings.social_links || []).map((link) => (
              <a 
                key={link.label} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-xs font-medium text-white/30 text-center md:text-right">
             <p>{getFormattedCopyright()}</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
