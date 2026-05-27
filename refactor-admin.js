const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const adminComponentsDir = path.join(srcDir, 'components', 'admin');

if (!fs.existsSync(adminComponentsDir)) {
  fs.mkdirSync(adminComponentsDir, { recursive: true });
}

const adminPath = path.join(pagesDir, 'Admin.jsx');
const adminProjectsPath = path.join(adminComponentsDir, 'AdminProjects.jsx');
const adminAchievementsPath = path.join(adminComponentsDir, 'AdminAchievements.jsx');
const adminSiteContentPath = path.join(adminComponentsDir, 'AdminSiteContent.jsx');

// I will write the components completely since they are relatively manageable when split.

// 1. AdminProjects.jsx
const adminProjectsCode = `import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web App');
  const [tech, setTech] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // Array of strings
  const [projectUrl, setProjectUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = \`\${Math.random()}.\${fileExt}\`;
        const filePath = \`project-images/\${fileName}\`;
        const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      setImageUrls(prev => [...prev, ...newUrls]);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      // Compatibility with old data: save first image to image_url, all to image_urls
      const primaryImage = imageUrls.length > 0 ? imageUrls[0] : null;
      const projectData = { title, category, tech, year, description, image_url: primaryImage, image_urls: imageUrls, project_url: projectUrl };

      if (isEditing) {
        const { error } = await supabase.from('projects').update(projectData).eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
      }

      resetForm();
      fetchProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        fetchProjects();
      } catch (error) {
        alert('Error deleting project: ' + error.message);
      }
    }
  };

  const handleEditProject = (project) => {
    setIsEditing(true);
    setCurrentId(project.id);
    setTitle(project.title);
    setCategory(project.category);
    setTech(project.tech);
    setYear(project.year);
    setDescription(project.description);
    setImageUrls(project.image_urls || (project.image_url ? [project.image_url] : []));
    setProjectUrl(project.project_url || '');
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setCategory('Web App');
    setTech('');
    setYear('');
    setDescription('');
    setImageUrls([]);
    setProjectUrl('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-1">
        <div className="bg-dark-900 border border-white/5 rounded-xl p-6 sticky top-24 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
            {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isEditing ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmitProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0">
                  <option>Web App</option>
                  <option>Mobile UI/UX</option>
                  <option>CMS</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Year/Sem</label>
                <input required value={year} onChange={e => setYear(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="e.g. Sem 3" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Tech Stack (comma separated)</label>
              <input required value={tech} onChange={e => setTech(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="React, Node, Tailwind" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Project URL / Live Link</label>
              <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="https://example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" placeholder="Description... Use Enters for paragraphs." />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Project Images</label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded border border-white/10 overflow-hidden group">
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-md relative hover:bg-white/5 transition-colors h-24">
                 <div className="space-y-1 text-center flex flex-col justify-center items-center">
                   <div className="flex text-sm text-white/50">
                     <label className="relative cursor-pointer rounded-md font-medium text-white hover:underline focus-within:outline-none">
                       <span>Upload {imageUrls.length > 0 ? 'more images' : 'images'}</span>
                       <input type="file" multiple className="sr-only" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                     </label>
                   </div>
                 </div>
                 {uploading && <div className="absolute inset-0 bg-dark-950/80 flex items-center justify-center rounded-md"><Loader2 className="animate-spin text-white" /></div>}
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 btn-primary py-2 text-sm cursor-pointer">
                {isEditing ? 'Update Project' : 'Save Project'}
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
              <h3 className="text-lg font-bold text-white">Manage Projects</h3>
              <span className="text-xs font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md">{projects.length} Total</span>
           </div>
           {loading ? (
             <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-white/50" /></div>
           ) : projects.length === 0 ? (
             <div className="p-12 text-center text-white/50">
                <p className="text-sm">No projects found. Add your first project using the form.</p>
             </div>
           ) : (
             <ul className="divide-y divide-white/5">
               {projects.map((project) => (
                 <li key={project.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-white/[0.02] transition-colors">
                    <div className="w-full sm:w-48 aspect-video rounded-md bg-dark-950 border border-white/10 overflow-hidden shrink-0">
                       {project.image_urls && project.image_urls.length > 0 ? (
                         <img src={project.image_urls[0]} alt={project.title} className="w-full h-full object-cover opacity-80" />
                       ) : project.image_url ? (
                         <img src={project.image_url} alt={project.title} className="w-full h-full object-cover opacity-80" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-white/30"><ImageIcon className="w-6 h-6" /></div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <h4 className="font-bold text-base text-white leading-none mb-1.5">{project.title}</h4>
                             <div className="flex gap-2 items-center text-xs text-white/50">
                                <span className="bg-white/5 px-2 py-0.5 rounded">{project.category}</span>
                                <span>•</span>
                                <span>{project.year}</span>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => handleEditProject(project)} className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer" title="Edit"><Edit2 className="w-4 h-4" /></button>
                             <button onClick={() => handleDeleteProject(project.id)} className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <p className="text-sm text-white/50 line-clamp-2 mt-2">{project.description}</p>
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
export default AdminProjects;`;


// 2. AdminAchievements.jsx
const adminAchievementsCode = `import React, { useState, useEffect } from 'react';
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
      const fileName = \`achievement-\${Math.random()}.\${fileExt}\`;
      const filePath = \`project-images/\${fileName}\`;
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
              <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" placeholder="Description..." />
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
export default AdminAchievements;`;


// 3. Admin.jsx layout wrapper
const newAdminCode = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Loader2 } from 'lucide-react';
import AdminProjects from '../components/admin/AdminProjects';
import AdminAchievements from '../components/admin/AdminAchievements';

// I'm importing the whole AdminSiteContent that we will extract
import AdminSiteContent from '../components/admin/AdminSiteContent';

const Admin = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'achievements', 'site-content'

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
            className={\`py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer \${activeTab === 'projects' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'}\`}
          >
            Portfolio Projects
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={\`py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer \${activeTab === 'achievements' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'}\`}
          >
            Achievements & Exp
          </button>
          <button 
            onClick={() => setActiveTab('site-content')}
            className={\`py-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer \${activeTab === 'site-content' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white'}\`}
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

export default Admin;`;

// We also need to extract AdminSiteContent.jsx from the old Admin.jsx
// I will read the old Admin.jsx, and extract the required functions using string manipulation.
const oldAdminContent = fs.readFileSync(adminPath, 'utf8');

// I will just bundle the form rendering logic into AdminSiteContent.jsx
const adminSiteContentCode = \`import React, { useState, useEffect } from 'react';
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
      alert(\`Berhasil menyimpan pengaturan \${key}!\`);
    } catch (error) {
      alert(\`Gagal menyimpan pengaturan \${key}: \` + error.message);
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
      const fileName = \`profile-\${Math.random()}.\${fileExt}\`;
      const filePath = \`profile-images/\${fileName}\`;

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

\` + oldAdminContent.substring(
  oldAdminContent.indexOf('const renderNavbarForm = () => {'),
  oldAdminContent.indexOf('if (!session) return')
) + \`
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
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer \${
                activeSection === sec.id 
                  ? 'bg-white/10 text-white font-bold' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }\`}
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
\`;

fs.writeFileSync(adminProjectsPath, adminProjectsCode);
fs.writeFileSync(adminAchievementsPath, adminAchievementsCode);
fs.writeFileSync(adminSiteContentPath, adminSiteContentCode);
fs.writeFileSync(adminPath, newAdminCode);

console.log('Successfully refactored Admin.jsx');
