import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Loader2 } from 'lucide-react';
import AdminProjects from '../components/admin/AdminProjects';
import AdminAchievements from '../components/admin/AdminAchievements';
import AdminSiteContent from '../components/admin/AdminSiteContent';
import AdminAbout from '../components/admin/AdminAbout';
import AdminContact from '../components/admin/AdminContact';

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
            onClick={() => setActiveTab('about')}
            className={"py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer " + (activeTab === 'about' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white')}
          >
            About & Education
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={"py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer " + (activeTab === 'contact' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white')}
          >
            Contact & Messages
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
        {activeTab === 'about' && <AdminAbout />}
        {activeTab === 'contact' && <AdminContact />}
        {activeTab === 'site-content' && <AdminSiteContent />}
      </div>
    </div>
  );
};

export default Admin;
