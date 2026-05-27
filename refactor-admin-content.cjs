const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const adminPath = path.join(srcDir, 'pages', 'Admin.jsx');
const adminSiteContentPath = path.join(srcDir, 'components', 'admin', 'AdminSiteContent.jsx');

const oldAdminContent = fs.readFileSync(adminPath, 'utf8');

// The marker where we split:
const renderNavbarFormMarker = "const renderNavbarForm = () => {";
const endMarker = "if (!session) return";

const startIndex = oldAdminContent.indexOf(renderNavbarFormMarker);
const endIndex = oldAdminContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found!");
    process.exit(1);
}

const formMethodsContent = oldAdminContent.substring(startIndex, endIndex);

const adminSiteContentCode = `import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Loader2, Image as ImageIcon, Save, Menu, Smile, Layers, TrendingUp, Mail, Globe } from 'lucide-react';

const AdminSiteContent = () => {
  const [activeSection, setActiveSection] = useState('navbar');
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingKey, setSavingKey] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);

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

` + formMethodsContent + `
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
`;

const newAdminCode = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Loader2 } from 'lucide-react';
import AdminProjects from '../components/admin/AdminProjects';
import AdminAchievements from '../components/admin/AdminAchievements';
import AdminSiteContent from '../components/admin/AdminSiteContent';

const Admin = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) navigate('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/login');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!session) return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><Loader2 className="animate-spin text-white/50" /></div>;

  return (
    <div className="min-h-screen bg-dark-950 text-foreground pb-20">
      {/* Topbar */}
      <header className="bg-dark-900 border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <span className="font-bold tracking-tight text-white hidden sm:inline">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Sub-Header Tabs */}
      <div className="bg-dark-900 border-b border-white/5 overflow-x-auto">
        <div className="container mx-auto px-6 flex gap-6 min-w-max">
          <button 
            onClick={() => setActiveTab('projects')}
            className={"py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer " + (activeTab === 'projects' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white')}
          >
            Portfolio Projects
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={"py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer " + (activeTab === 'achievements' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white')}
          >
            Achievements & Exp
          </button>
          <button 
            onClick={() => setActiveTab('site-content')}
            className={"py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer " + (activeTab === 'site-content' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white')}
          >
            Site Content & Stats
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'achievements' && <AdminAchievements />}
        {activeTab === 'site-content' && <AdminSiteContent />}
      </div>
    </div>
  );
};

export default Admin;
`;

fs.writeFileSync(adminSiteContentPath, adminSiteContentCode);
fs.writeFileSync(adminPath, newAdminCode);

console.log('Successfully refactored Admin.jsx');
