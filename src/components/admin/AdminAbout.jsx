import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Plus, Trash2, Edit2, Save } from 'lucide-react';

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState({
    description: '',
    years_exp: '3+',
    projects_completed: '20+',
    education: []
  });

  const [eduForm, setEduForm] = useState({
    year: '',
    degree: '',
    institution: '',
    description: ''
  });
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [editEduIndex, setEditEduIndex] = useState(null);

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  const fetchAboutSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'about')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data && data.value) {
        setAboutData({
          description: data.value.description || '',
          years_exp: data.value.years_exp || '',
          projects_completed: data.value.projects_completed || '',
          education: data.value.education || []
        });
      }
    } catch (err) {
      console.error('Error fetching about settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    try {
      setSaving(true);
      
      const { data: existing, error: fetchErr } = await supabase.from('site_settings').select('key').eq('key', 'about').maybeSingle();
      if (fetchErr) throw fetchErr;
      
      if (existing) {
        const { error } = await supabase.from('site_settings').update({ value: aboutData }).eq('key', 'about');
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{ key: 'about', value: aboutData }]);
        if (error) throw error;
      }
      
      alert('About settings saved successfully!');
    } catch (err) {
      alert('Error saving about settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEdu = () => {
    const updatedEdu = [...aboutData.education];
    if (isEditingEdu) {
      updatedEdu[editEduIndex] = eduForm;
      setIsEditingEdu(false);
      setEditEduIndex(null);
    } else {
      updatedEdu.push(eduForm);
    }
    setAboutData({ ...aboutData, education: updatedEdu });
    setEduForm({ year: '', degree: '', institution: '', description: '' });
  };

  const handleEditEdu = (index) => {
    setEduForm(aboutData.education[index]);
    setIsEditingEdu(true);
    setEditEduIndex(index);
  };

  const handleDeleteEdu = (index) => {
    const updatedEdu = aboutData.education.filter((_, i) => i !== index);
    setAboutData({ ...aboutData, education: updatedEdu });
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-white/50" /></div>;

  return (
    <div className="space-y-10">
      
      {/* About Description & Stats */}
      <div className="bg-dark-900 border border-white/5 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-white flex items-center justify-between">
          <span>About Me</span>
          <button onClick={handleSaveAbout} disabled={saving} className="btn-primary py-2 px-4 text-sm flex items-center gap-2 cursor-pointer">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Description (Paragraphs)</label>
            <textarea 
              rows={6}
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              className="w-full bg-dark-950 border border-white/10 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" 
              placeholder="Separate paragraphs with double Enters..."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Years of Experience</label>
               <input 
                 value={aboutData.years_exp}
                 onChange={(e) => setAboutData({ ...aboutData, years_exp: e.target.value })}
                 className="w-full bg-dark-950 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40" 
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Projects Completed</label>
               <input 
                 value={aboutData.projects_completed}
                 onChange={(e) => setAboutData({ ...aboutData, projects_completed: e.target.value })}
                 className="w-full bg-dark-950 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-white/40" 
               />
             </div>
          </div>
        </div>
      </div>

      {/* Education Timeline */}
      <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-white/5 bg-dark-950/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Education Timeline</h3>
        </div>
        
        <div className="p-6 grid lg:grid-cols-2 gap-10">
          {/* Edu Form */}
          <div className="space-y-4">
             <h4 className="text-sm font-semibold text-white/70 mb-4">{isEditingEdu ? 'Edit Item' : 'Add New Item'}</h4>
             <div>
               <label className="block text-xs font-medium text-white/50 mb-1">Year</label>
               <input value={eduForm.year} onChange={e => setEduForm({...eduForm, year: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white" placeholder="2020 - 2024" />
             </div>
             <div>
               <label className="block text-xs font-medium text-white/50 mb-1">Degree/Title</label>
               <input value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white" placeholder="B.S. Computer Science" />
             </div>
             <div>
               <label className="block text-xs font-medium text-white/50 mb-1">Institution</label>
               <input value={eduForm.institution} onChange={e => setEduForm({...eduForm, institution: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white" placeholder="University Name" />
             </div>
             <div>
               <label className="block text-xs font-medium text-white/50 mb-1">Description (Optional)</label>
               <textarea rows={3} value={eduForm.description} onChange={e => setEduForm({...eduForm, description: e.target.value})} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white resize-none" />
             </div>
             <div className="pt-2 flex gap-3">
               <button onClick={handleAddEdu} disabled={!eduForm.year || !eduForm.degree} className="flex-1 bg-white text-black font-semibold py-2 rounded-md text-sm cursor-pointer disabled:opacity-50">
                 {isEditingEdu ? 'Update Item' : 'Add Item'}
               </button>
               {isEditingEdu && (
                 <button onClick={() => { setIsEditingEdu(false); setEduForm({ year: '', degree: '', institution: '', description: '' }); }} className="px-4 py-2 bg-white/5 text-white rounded-md text-sm cursor-pointer hover:bg-white/10">
                   Cancel
                 </button>
               )}
             </div>
             <p className="text-xs text-white/30 mt-4 italic">*Don't forget to click "Save Changes" in the top section to persist the timeline!</p>
          </div>

          {/* Edu List */}
          <div className="border border-white/5 rounded-xl bg-dark-950/30 p-6">
             {aboutData.education.length === 0 ? (
               <p className="text-sm text-white/50 text-center py-10">No education history added yet.</p>
             ) : (
               <div className="relative border-l border-white/10 ml-2 space-y-6">
                 {aboutData.education.map((item, idx) => (
                   <div key={idx} className="relative pl-6">
                     <div className="absolute -left-[5px] top-1 w-[10px] h-[10px] rounded-full bg-white ring-4 ring-dark-900" />
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-white/40 tracking-wider uppercase">{item.year}</span>
                        <div className="flex gap-2">
                           <button onClick={() => handleEditEdu(idx)} className="p-1 text-white/50 hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                           <button onClick={() => handleDeleteEdu(idx)} className="p-1 text-white/50 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                     <h3 className="text-sm font-bold text-white mb-0.5">{item.degree}</h3>
                     <p className="text-xs text-white/70 mb-2">{item.institution}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AdminAbout;
