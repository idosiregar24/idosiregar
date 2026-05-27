import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Save, Trash2, MailOpen, MapPin, Briefcase, Code, MessageSquare, Phone } from 'lucide-react';

const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    twitter: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Contact Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'contact')
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      if (settingsData && settingsData.value) {
        setContactData({
          email: settingsData.value.email || '',
          phone: settingsData.value.phone || '',
          location: settingsData.value.location || '',
          linkedin: settingsData.value.linkedin || '',
          github: settingsData.value.github || '',
          twitter: settingsData.value.twitter || ''
        });
      }

      // Fetch Messages
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (msgError) {
         // If table doesn't exist yet, just ignore error for now, or log it
         console.warn('Messages table might not exist yet:', msgError.message);
      } else {
         setMessages(messagesData || []);
      }

    } catch (err) {
      console.error('Error fetching contact data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContact = async () => {
    try {
      setSaving(true);
      const { data: existing, error: fetchErr } = await supabase.from('site_settings').select('key').eq('key', 'contact').maybeSingle();
      if (fetchErr) throw fetchErr;
      
      if (existing) {
        const { error } = await supabase.from('site_settings').update({ value: contactData }).eq('key', 'contact');
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{ key: 'contact', value: contactData }]);
        if (error) throw error;
      }
      alert('Contact settings saved successfully!');
    } catch (err) {
      alert('Error saving contact settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      try {
        await supabase.from('messages').delete().eq('id', id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (err) {
        alert('Error deleting message: ' + err.message);
      }
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-white/50" /></div>;

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      
      {/* Contact Info Settings */}
      <div className="lg:col-span-1">
        <div className="bg-dark-900 border border-white/5 rounded-xl p-6 shadow-sm sticky top-24">
          <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
            Social & Contact Links
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><MailOpen className="w-3.5 h-3.5"/> Email</label>
              <input value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="hello@example.com" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><Phone className="w-3.5 h-3.5"/> Phone Number</label>
              <input value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="+62 812 3456 7890" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> Location</label>
              <input value={contactData.location} onChange={e => setContactData({...contactData, location: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="Jakarta, Indonesia" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><Briefcase className="w-3.5 h-3.5"/> LinkedIn URL</label>
              <input value={contactData.linkedin} onChange={e => setContactData({...contactData, linkedin: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><Code className="w-3.5 h-3.5"/> GitHub URL</label>
              <input value={contactData.github} onChange={e => setContactData({...contactData, github: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5"/> Twitter/X URL</label>
              <input value={contactData.twitter} onChange={e => setContactData({...contactData, twitter: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-white/40" placeholder="https://twitter.com/..." />
            </div>
            
            <button onClick={handleSaveContact} disabled={saving} className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2 cursor-pointer mt-4">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Contact Info
            </button>
          </div>
        </div>
      </div>

      {/* Messages Inbox */}
      <div className="lg:col-span-2">
        <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-white/5 bg-dark-950/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Inbox Messages</h3>
            <span className="text-xs font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md">{messages.length} Total</span>
          </div>
          
          {messages.length === 0 ? (
             <div className="p-12 text-center text-white/50">
                <p className="text-sm">Your inbox is empty.</p>
             </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-bold text-base text-white">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-sm text-blue-400 hover:underline">{msg.email}</a>
                     </div>
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-white/40">{new Date(msg.created_at).toLocaleString()}</span>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                  <div className="bg-dark-950 p-4 rounded-lg border border-white/5">
                     <p className="text-sm text-white/80 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AdminContact;
