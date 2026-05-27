import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Deteksi bahasa saat ini dari cookie Google Translate
  const getInitialLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/(id|en)/);
    return match ? match[1] : 'en';
  };
  const [lang, setLang] = useState(getInitialLang());
  const [settings, setSettings] = useState({
    brand_logo_text: 'Ido Solutions',
    nav_items: [
      { label: 'Home', target: '#' },
      { label: 'Experience', target: '#features' },
      { label: 'Projects', target: '#portfolio' },
      { label: 'Achievements', target: '#achievements' },
      { label: 'Contact', target: '#cta' }
    ],
    action_button: {
      text: 'Hire Me',
      link: '#cta'
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'navbar')
          .single();
        if (data && data.value) {
          setSettings(data.value);
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }

          if (data.value.favicon_url) {
            link.href = data.value.favicon_url;
          } else {
            // Default "IS" favicon as requested
            const svgFavicon = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="black"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="50" fill="white">IS</text></svg>`;
            link.href = svgFavicon;
          }
        }
      } catch (err) {
        console.error('Error fetching navbar settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const scrollToSection = (target) => {
    if (!target) return;
    if (target === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'id' : 'en';
    setLang(nextLang);
    
    // Set cookie untuk Google Translate
    document.cookie = `googtrans=/en/${nextLang}; path=/`;
    document.cookie = `googtrans=/en/${nextLang}; path=/; domain=${window.location.hostname}`;
    
    // Reload halaman agar script Google Translate membaca cookie baru
    window.location.reload();
  };

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-8">
      <div className="w-full max-w-4xl apple-glass rounded-full flex justify-between items-center p-2 pl-6">
        
        {/* Brand Logo */}
        <div 
          onClick={() => scrollToSection('#')}
          className="flex items-center gap-2 sm:gap-3 select-none cursor-pointer pr-2 sm:pr-4 min-w-0"
        >
          <div className="w-6 h-6 shrink-0 bg-white rounded-full flex items-center justify-center">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="text-sm font-bold tracking-tight text-white truncate min-w-0">
            {settings.brand_logo_text || 'Ido Solutions'}
          </span>
        </div>

        {/* Center Navigation - Desktop */}
        <div className="hidden xl:flex items-center gap-2">
          {(settings.nav_items || []).map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.target)}
              className="whitespace-nowrap text-[13px] font-semibold transition-all px-4 py-2 rounded-full text-white/50 hover:text-white hover:bg-white/5"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Side - Action */}
        {settings.action_button && (
          <div className="hidden xl:flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="notranslate flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-xs font-bold tracking-wider cursor-pointer"
              title="Translate Page"
            >
              {lang === 'en' ? 'EN' : 'ID'}
            </button>
            <button 
              onClick={() => scrollToSection(settings.action_button.link)}
              className="whitespace-nowrap bg-white text-black px-6 py-2.5 rounded-full font-semibold text-[13px] transition-transform active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
            >
              {settings.action_button.text || 'Hire Me'}
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="xl:hidden flex flex-shrink-0 items-center gap-2 ml-auto">
          <button 
            onClick={toggleLanguage}
            className="notranslate flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-[10px] sm:text-xs font-bold tracking-wider cursor-pointer"
          >
            {lang === 'en' ? 'EN' : 'ID'}
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 12h16M4 6h16M4 18h16" />}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <Transition
        show={mobileOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-4 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 -translate-y-4 scale-95"
      >
        <div className="absolute top-[80px] left-4 right-4 apple-glass-heavy rounded-3xl p-4 shadow-2xl xl:hidden max-w-sm mx-auto max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {(settings.nav_items || []).map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.target)}
                className="flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-colors text-white/60 hover:text-white hover:bg-white/5 w-full text-left"
              >
                {item.label}
              </button>
            ))}
            {settings.action_button && (
              <div className="pt-2 mt-2 border-t border-white/10 shrink-0">
                 <button 
                   onClick={() => scrollToSection(settings.action_button.link)}
                   className="w-full bg-white text-black px-6 py-3.5 rounded-2xl font-bold text-sm transition-transform active:scale-95 cursor-pointer"
                 >
                   {settings.action_button.text || 'Hire Me'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
