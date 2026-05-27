import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Loader2, Image as ImageIcon, Save, Menu, Smile, Layers, TrendingUp, Mail, Globe } from 'lucide-react';

const AdminSiteContent = () => {
  const [activeSection, setActiveSection] = useState('navbar');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const [navbarState, setNavbarState] = useState({ brand_logo_text: '', nav_items: [], action_button: { text: '', link: '' } });
  const [heroState, setHeroState] = useState({ badge_text: '', badge_live: true, title_white: '', title_muted: '', description: '', primary_cta: { text: '', link: '' }, secondary_cta: { text: '', link: '' }, profile_image: '', profile_name: '', profile_role: '' });
  const [featuresState, setFeaturesState] = useState({ title: '', subtitle: '', skills: [] });
  const [statsState, setStatsState] = useState({ items: [] });
  const [ctaState, setCtaState] = useState({ heading: '', description: '', primary_button: { text: '', link: '' }, secondary_button: { text: '', email: '' } });
  const [footerState, setFooterState] = useState({ brand_text: '', location: '', social_links: [], copyright: '' });

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoadingSettings(true);
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;

      const settingsMap = {};
      data.forEach(item => { settingsMap[item.key] = item.value; });

      if (settingsMap.navbar) setNavbarState(settingsMap.navbar);
      if (settingsMap.hero) setHeroState(settingsMap.hero);
      if (settingsMap.features) setFeaturesState(settingsMap.features);
      if (settingsMap.stats) setStatsState(settingsMap.stats);
      if (settingsMap.cta) setCtaState(settingsMap.cta);
      if (settingsMap.footer) setFooterState(settingsMap.footer);
    } catch (error) {
      console.error('Error fetching site settings:', error.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSectionSettings = async (key, value) => {
    try {
      setSavingKey(key);
      const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
      alert('Berhasil menyimpan pengaturan ' + key + '!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan ' + key + ': ' + error.message);
    } finally {
      setSavingKey(null);
    }
  };

  const handleProfileImageUpload = async (e) => {
    try {
      setUploadingProfile(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = 'profile-' + Math.random() + '.' + fileExt;
      const filePath = 'profile-images/' + fileName;

      let { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setHeroState(prev => ({ ...prev, profile_image: data.publicUrl }));
    } catch (error) {
      alert('Error uploading profile image: ' + error.message);
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleFaviconUpload = async (e) => {
    try {
      setUploadingFavicon(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = 'favicon-' + Math.random() + '.' + fileExt;
      const filePath = 'site-assets/' + fileName;

      let { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setNavbarState(prev => ({ ...prev, favicon_url: data.publicUrl }));
    } catch (error) {
      alert('Error uploading favicon: ' + error.message);
    } finally {
      setUploadingFavicon(false);
    }
  };

const renderNavbarForm = () => {
    const handleAddNavItem = () => {
      setNavbarState(prev => ({
        ...prev,
        nav_items: [...(prev.nav_items || []), { label: '', target: '' }]
      }));
    };

    const handleRemoveNavItem = (index) => {
      setNavbarState(prev => ({
        ...prev,
        nav_items: prev.nav_items.filter((_, i) => i !== index)
      }));
    };

    const handleNavItemChange = (index, field, value) => {
      setNavbarState(prev => {
        const newItems = [...prev.nav_items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, nav_items: newItems };
      });
    };

    const handleSubmitNavbar = (e) => {
      e.preventDefault();
      saveSectionSettings('navbar', navbarState);
    };

    return (
      <form onSubmit={handleSubmitNavbar} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Navbar Settings</h3>
          <p className="text-xs text-white/50">Manage your header navigation links and logo text.</p>
        </div>
        <hr className="border-white/5" />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Brand Logo Text</label>
            <input required value={navbarState.brand_logo_text || ''} onChange={e => setNavbarState(prev => ({ ...prev, brand_logo_text: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Favicon (Browser Tab Icon)</label>
            <div className="flex items-center gap-4">
              {navbarState.favicon_url && (
                <div className="w-10 h-10 bg-dark-950 border border-white/10 rounded overflow-hidden shrink-0">
                  <img src={navbarState.favicon_url} alt="Favicon" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 relative">
                 <input type="file" accept="image/*" onChange={handleFaviconUpload} disabled={uploadingFavicon} className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" />
                 {uploadingFavicon && <Loader2 className="absolute right-4 top-2.5 w-4 h-4 animate-spin text-white" />}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Navigation Items</label>
            <button type="button" onClick={handleAddNavItem} className="text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>
          
          <div className="space-y-3">
            {(navbarState.nav_items || []).map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input required placeholder="Label (e.g. Home)" value={item.label || ''} onChange={e => handleNavItemChange(idx, 'label', e.target.value)} className="flex-1 bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                <input required placeholder="Target (e.g. #portfolio)" value={item.target || ''} onChange={e => handleNavItemChange(idx, 'target', e.target.value)} className="flex-1 bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                <button type="button" onClick={() => handleRemoveNavItem(idx)} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(navbarState.nav_items || []).length === 0 && (
              <p className="text-sm text-white/30 text-center py-4 border border-dashed border-white/10 rounded-md">No navigation items. Click Add Link to create one.</p>
            )}
          </div>
        </div>

        <hr className="border-white/5" />
        
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Action Button (Right Side)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-white/50 mb-1.5">Button Text</label>
              <input required value={navbarState.action_button?.text || ''} onChange={e => setNavbarState(prev => ({ ...prev, action_button: { ...(prev.action_button || {}), text: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Hire Me" />
            </div>
            <div>
              <label className="block text-[10px] text-white/50 mb-1.5">Target Link / Anchor</label>
              <input required value={navbarState.action_button?.link || ''} onChange={e => setNavbarState(prev => ({ ...prev, action_button: { ...(prev.action_button || {}), link: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. #cta" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'navbar'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'navbar' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  const renderHeroForm = () => {
    const handleSubmitHero = (e) => {
      e.preventDefault();
      saveSectionSettings('hero', heroState);
    };

    return (
      <form onSubmit={handleSubmitHero} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Hero Section Settings</h3>
          <p className="text-xs text-white/50">Edit your main introduction section, badge, profile image, and CTAs.</p>
        </div>
        <hr className="border-white/5" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Badge Text</label>
            <input value={heroState.badge_text || ''} onChange={e => setHeroState(prev => ({ ...prev, badge_text: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Available for new projects" />
          </div>
          <div className="flex items-center pt-8">
            <label className="flex items-center gap-2.5 text-sm text-white/70 cursor-pointer select-none">
              <input type="checkbox" checked={heroState.badge_live} onChange={e => setHeroState(prev => ({ ...prev, badge_live: e.target.checked }))} className="rounded border-white/10 bg-dark-950 text-white w-4 h-4 focus:ring-0 focus:ring-offset-0" />
              <span>Show Live Status Indicator (Pulse Dot)</span>
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Title (White part)</label>
            <input required value={heroState.title_white || ''} onChange={e => setHeroState(prev => ({ ...prev, title_white: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Designing the" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Title (Muted part)</label>
            <input required value={heroState.title_muted || ''} onChange={e => setHeroState(prev => ({ ...prev, title_muted: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. digital future." />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description / Bio</label>
          <textarea required rows={4} value={heroState.description || ''} onChange={e => setHeroState(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-b border-white/5 py-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Profile Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-md relative hover:bg-white/5 transition-colors h-48">
              {heroState.profile_image ? (
                <div className="absolute inset-0 p-2">
                   <img src={heroState.profile_image} alt="Profile" className="w-full h-full object-cover rounded-md" />
                   <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <span className="text-xs font-bold text-white">Change Photo</span>
                      <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                   </div>
                </div>
              ) : (
                <div className="space-y-1 text-center flex flex-col justify-center items-center">
                  <ImageIcon className="h-8 w-8 text-white/30 mb-2" />
                  <div className="flex text-sm text-white/50">
                    <label className="relative cursor-pointer rounded-md font-medium text-white hover:underline focus-within:outline-none">
                      <span>Upload profile image</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleProfileImageUpload} disabled={uploadingProfile} />
                    </label>
                  </div>
                  <p className="text-xs text-white/30">PNG, JPG up to 5MB</p>
                </div>
              )}
              {uploadingProfile && <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center rounded-md"><Loader2 className="animate-spin text-white" /></div>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name Tag Title</label>
              <input required value={heroState.profile_name || ''} onChange={e => setHeroState(prev => ({ ...prev, profile_name: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Ido" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name Tag Subtitle / Role</label>
              <input required value={heroState.profile_role || ''} onChange={e => setHeroState(prev => ({ ...prev, profile_role: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Developer" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Primary CTA Button</label>
            <div className="space-y-3">
              <input required placeholder="Button Text" value={heroState.primary_cta?.text || ''} onChange={e => setHeroState(prev => ({ ...prev, primary_cta: { ...(prev.primary_cta || {}), text: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
              <input required placeholder="Target Link (e.g. #portfolio)" value={heroState.primary_cta?.link || ''} onChange={e => setHeroState(prev => ({ ...prev, primary_cta: { ...(prev.primary_cta || {}), link: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Secondary CTA Button</label>
            <div className="space-y-3">
              <input required placeholder="Button Text" value={heroState.secondary_cta?.text || ''} onChange={e => setHeroState(prev => ({ ...prev, secondary_cta: { ...(prev.secondary_cta || {}), text: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
              <input required placeholder="Target Link (e.g. #)" value={heroState.secondary_cta?.link || ''} onChange={e => setHeroState(prev => ({ ...prev, secondary_cta: { ...(prev.secondary_cta || {}), link: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'hero'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'hero' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  const renderFeaturesForm = () => {
    const handleAddSkill = () => {
      setFeaturesState(prev => ({
        ...prev,
        skills: [...(prev.skills || []), { name: '', tech: '', detail: '' }]
      }));
    };

    const handleRemoveSkill = (index) => {
      setFeaturesState(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    };

    const handleSkillChange = (index, field, value) => {
      setFeaturesState(prev => {
        const newSkills = [...prev.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        return { ...prev, skills: newSkills };
      });
    };

    const handleSubmitFeatures = (e) => {
      e.preventDefault();
      saveSectionSettings('features', featuresState);
    };

    return (
      <form onSubmit={handleSubmitFeatures} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Core Competencies</h3>
          <p className="text-xs text-white/50">Manage the competencies / skills section of your website.</p>
        </div>
        <hr className="border-white/5" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Section Title</label>
            <input required value={featuresState.title || ''} onChange={e => setFeaturesState(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Section Subtitle</label>
            <input required value={featuresState.subtitle || ''} onChange={e => setFeaturesState(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Skills / Competencies List</label>
            <button type="button" onClick={handleAddSkill} className="text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Competency
            </button>
          </div>

          <div className="space-y-4">
            {(featuresState.skills || []).map((skill, idx) => (
              <div key={idx} className="bg-dark-950 border border-white/10 p-4 rounded-xl relative space-y-3">
                <button type="button" onClick={() => handleRemoveSkill(idx)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase mb-1">Competency Name</label>
                    <input required placeholder="e.g. Backend Architecture" value={skill.name || ''} onChange={e => handleSkillChange(idx, 'name', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 uppercase mb-1">Tech / Frameworks Tag</label>
                    <input required placeholder="e.g. Laravel, Node.js, Redis" value={skill.tech || ''} onChange={e => handleSkillChange(idx, 'tech', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-white/50 uppercase mb-1">Detail Description</label>
                  <textarea required rows={2} placeholder="Briefly describe your skill details..." value={skill.detail || ''} onChange={e => handleSkillChange(idx, 'detail', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" />
                </div>
              </div>
            ))}
            {(featuresState.skills || []).length === 0 && (
              <p className="text-sm text-white/30 text-center py-8 border border-dashed border-white/10 rounded-md">No competencies. Click Add Competency to get started.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'features'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'features' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  const renderStatsForm = () => {
    const handleAddStat = () => {
      setStatsState(prev => ({
        ...prev,
        items: [...(prev.items || []), { label: '', value: '' }]
      }));
    };

    const handleRemoveStat = (index) => {
      setStatsState(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    };

    const handleStatChange = (index, field, value) => {
      setStatsState(prev => {
        const newItems = [...prev.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, items: newItems };
      });
    };

    const handleSubmitStats = (e) => {
      e.preventDefault();
      saveSectionSettings('stats', statsState);
    };

    return (
      <form onSubmit={handleSubmitStats} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Portfolio Statistics</h3>
          <p className="text-xs text-white/50">Edit metrics displayed in the statistics counter section.</p>
        </div>
        <hr className="border-white/5" />

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Metrics</label>
            <button type="button" onClick={handleAddStat} className="text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {(statsState.items || []).map((stat, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-dark-950 p-4 border border-white/10 rounded-lg">
                <div className="flex-1">
                  <label className="block text-[10px] text-white/50 mb-1">Value (e.g. 15+)</label>
                  <input required placeholder="Value" value={stat.value || ''} onChange={e => handleStatChange(idx, 'value', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                </div>
                <div className="flex-[2]">
                  <label className="block text-[10px] text-white/50 mb-1">Label (e.g. Completed Projects)</label>
                  <input required placeholder="Label" value={stat.label || ''} onChange={e => handleStatChange(idx, 'label', e.target.value)} className="w-full bg-dark-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                </div>
                <div className="pt-5">
                  <button type="button" onClick={() => handleRemoveStat(idx)} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {(statsState.items || []).length === 0 && (
              <p className="text-sm text-white/30 text-center py-6 border border-dashed border-white/10 rounded-md">No statistics. Click Add Stat to create one.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'stats'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'stats' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  const renderCtaForm = () => {
    const handleSubmitCta = (e) => {
      e.preventDefault();
      saveSectionSettings('cta', ctaState);
    };

    return (
      <form onSubmit={handleSubmitCta} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">CTA Section Settings</h3>
          <p className="text-xs text-white/50">Manage the "Let's create the next big thing" section headings and buttons.</p>
        </div>
        <hr className="border-white/5" />

        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Heading</label>
          <input required value={ctaState.heading || ''} onChange={e => setCtaState(prev => ({ ...prev, heading: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description</label>
          <textarea required rows={4} value={ctaState.description || ''} onChange={e => setCtaState(prev => ({ ...prev, description: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Primary Button</label>
            <div className="space-y-3">
              <input required placeholder="Button Text" value={ctaState.primary_button?.text || ''} onChange={e => setCtaState(prev => ({ ...prev, primary_button: { ...(prev.primary_button || {}), text: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
              <input required placeholder="Target Link (e.g. mailto:hello@idosolutions.com)" value={ctaState.primary_button?.link || ''} onChange={e => setCtaState(prev => ({ ...prev, primary_button: { ...(prev.primary_button || {}), link: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Secondary Button</label>
            <div className="space-y-3">
              <input required placeholder="Button Text" value={ctaState.secondary_button?.text || ''} onChange={e => setCtaState(prev => ({ ...prev, secondary_button: { ...(prev.secondary_button || {}), text: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
              <input required placeholder="Copy-to-Clipboard Email Address" value={ctaState.secondary_button?.email || ''} onChange={e => setCtaState(prev => ({ ...prev, secondary_button: { ...(prev.secondary_button || {}), email: e.target.value } }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'cta'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'cta' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  const renderFooterForm = () => {
    const handleAddSocialLink = () => {
      setFooterState(prev => ({
        ...prev,
        social_links: [...(prev.social_links || []), { label: '', url: '' }]
      }));
    };

    const handleRemoveSocialLink = (index) => {
      setFooterState(prev => ({
        ...prev,
        social_links: prev.social_links.filter((_, i) => i !== index)
      }));
    };

    const handleSocialLinkChange = (index, field, value) => {
      setFooterState(prev => {
        const newLinks = [...prev.social_links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        return { ...prev, social_links: newLinks };
      });
    };

    const handleSubmitFooter = (e) => {
      e.preventDefault();
      saveSectionSettings('footer', footerState);
    };

    return (
      <form onSubmit={handleSubmitFooter} className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Footer Settings</h3>
          <p className="text-xs text-white/50">Manage footer brand, location, social accounts, and copyright text.</p>
        </div>
        <hr className="border-white/5" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Brand Text</label>
            <input required value={footerState.brand_text || ''} onChange={e => setFooterState(prev => ({ ...prev, brand_text: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Location Info</label>
            <input required value={footerState.location || ''} onChange={e => setFooterState(prev => ({ ...prev, location: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Copyright Message Template</label>
          <input required value={footerState.copyright || ''} onChange={e => setFooterState(prev => ({ ...prev, copyright: e.target.value }))} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="Use {year} to dynamically print current year" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider">Social Links</label>
            <button type="button" onClick={handleAddSocialLink} className="text-xs text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md border border-white/10 transition-colors flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add Social Account
            </button>
          </div>

          <div className="space-y-3">
            {(footerState.social_links || []).map((link, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input required placeholder="Account Name (e.g. GitHub)" value={link.label || ''} onChange={e => handleSocialLinkChange(idx, 'label', e.target.value)} className="flex-1 bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                <input required placeholder="URL Link (e.g. https://github.com/username)" value={link.url || ''} onChange={e => handleSocialLinkChange(idx, 'url', e.target.value)} className="flex-[2] bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
                <button type="button" onClick={() => handleRemoveSocialLink(idx)} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(footerState.social_links || []).length === 0 && (
              <p className="text-sm text-white/30 text-center py-4 border border-dashed border-white/10 rounded-md">No social links. Click Add Social Account to create one.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button type="submit" disabled={savingKey === 'footer'} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer">
            {savingKey === 'footer' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    );
  };

  
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-dark-900 border border-white/5 rounded-xl p-3 space-y-1 sticky top-24 shadow-sm">
          {[
            { id: 'navbar', label: 'Navbar Settings', icon: <Menu className="w-4 h-4" /> },
            { id: 'hero', label: 'Hero Section', icon: <Smile className="w-4 h-4" /> },
            { id: 'features', label: 'Features (Skills)', icon: <Layers className="w-4 h-4" /> },
            { id: 'stats', label: 'Portfolio Stats', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'cta', label: 'CTA Section', icon: <Mail className="w-4 h-4" /> },
            { id: 'footer', label: 'Footer Settings', icon: <Globe className="w-4 h-4" /> },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={"w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer " + (
                activeSection === sec.id 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {sec.icon}
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Edit Form */}
      <div className="lg:col-span-3">
        <div className="bg-dark-900 border border-white/5 rounded-xl p-8 shadow-sm">
          {loadingSettings ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-white/50" /></div>
          ) : (
            <>
              {activeSection === 'navbar' && renderNavbarForm()}
              {activeSection === 'hero' && renderHeroForm()}
              {activeSection === 'features' && renderFeaturesForm()}
              {activeSection === 'stats' && renderStatsForm()}
              {activeSection === 'cta' && renderCtaForm()}
              {activeSection === 'footer' && renderFooterForm()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminSiteContent;
