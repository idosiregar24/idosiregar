import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, X } from 'lucide-react';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Multimedia & Broadcasting');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `achievement-${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { title, category, year, description, image_url: imageUrl };
      if (isEditing) {
        const { error } = await supabase.from('achievements').update(dataToSave).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('achievements').insert([dataToSave]);
        if (error) throw error;
      }
      resetForm();
      fetchAchievements();
    } catch (error) {
      alert('Error saving achievement: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const { error } = await supabase.from('achievements').delete().eq('id', id);
        if (error) throw error;
        fetchAchievements();
      } catch (error) {
        alert('Error deleting achievement: ' + error.message);
      }
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setYear(item.year || '');
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setCategory('Multimedia & Broadcasting');
    setYear('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1">
        <div className="bg-dark-900 border border-white/5 rounded-xl p-6 sticky top-24 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditing ? 'Edit Achievement' : 'Add New Achievement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Title / Role</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0">
                  <option>Multimedia & Broadcasting</option>
                  <option>Business & Innovation</option>
                  <option>Video Production</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Year/Time</label>
                <input value={year} onChange={e => setYear(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. 2024" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" placeholder="Description... Use enter for spacing" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Image / Certificate</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-md relative hover:bg-white/5 transition-colors h-40">
                {imageUrl ? (
                  <div className="absolute inset-0 p-2">
                     <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                        <span className="text-xs font-bold text-white">Change Image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                     </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center flex flex-col justify-center items-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-white/30 mb-2" />
                    <div className="flex text-sm text-white/50">
                      <label className="relative cursor-pointer rounded-md font-medium text-white hover:underline focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                )}
                {uploading && <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center rounded-md"><Loader2 className="animate-spin text-white" /></div>}
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 btn-primary py-2 text-sm cursor-pointer">
                {isEditing ? 'Update Achievement' : 'Save Achievement'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="btn-outline px-4 py-2 text-sm cursor-pointer">Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-sm">
           <div className="p-6 border-b border-white/5 bg-dark-950/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Manage Achievements</h3>
              <span className="text-xs font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md">{achievements.length} Total</span>
           </div>
           {loading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-white/50" /></div>
           ) : achievements.length === 0 ? (
             <div className="p-12 text-center text-white/50">
                <p className="text-sm">No achievements found. Add your first achievement using the form.</p>
             </div>
           ) : (
             <ul className="divide-y divide-white/5">
               {achievements.map((item) => (
                 <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-white/[0.02] transition-colors">
                    <div className="w-full sm:w-32 aspect-square rounded-md bg-dark-950 border border-white/10 overflow-hidden shrink-0">
                       {item.image_url ? (
                         <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-80" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-6 h-6" /></div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h4 className="font-bold text-base text-white leading-none mb-1.5">{item.title}</h4>
                             <div className="flex gap-2 items-center text-xs text-white/50">
                                <span className="bg-white/5 px-2 py-0.5 rounded">{item.category}</span>
                                {item.year && <><span>•</span><span>{item.year}</span></>}
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleEdit(item)} className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer" title="Edit"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => handleDelete(item.id)} className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <p className="text-sm text-white/50 line-clamp-2 mt-2">{item.description}</p>
                    </div>
                 </li>
               ))}
             </ul>
           )}
        </div>
      </div>
    </div>
  );
};
export default AdminAchievements;
