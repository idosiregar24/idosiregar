import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web App');
  const [tech, setTech] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState([]); // Array of strings
  const [projectUrl, setProjectUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
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
        const fileName = `img-${Math.random()}.${fileExt}`;
        const filePath = `project-images/${fileName}`;
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
      // Compat with old logic: first image saved to image_url
      const primaryImage = imageUrls.length > 0 ? imageUrls[0] : null;
      const projectData = { title, category, tech, year, description, image_url: primaryImage, image_urls: imageUrls, project_url: projectUrl, sort_order: sortOrder };

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
    setSortOrder(project.sort_order || 0);
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
    setSortOrder(0);
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Project URL / Live Link</label>
                <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="https://example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Sort Order (0 is first)</label>
                <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea required rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-950 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 focus:ring-0 resize-none" placeholder="Use Enters for paragraphs..." />
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
             <>
               <ul className="divide-y divide-white/5">
                 {projects.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage).map((project) => (
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
               
               {Math.ceil(projects.length / itemsPerPage) > 1 && (
                 <div className="p-6 border-t border-white/5">
                   <Pagination>
                     <PaginationContent>
                       <PaginationItem>
                         <PaginationPrevious 
                           onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                           className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                         />
                       </PaginationItem>
                       
                       {[...Array(Math.ceil(projects.length / itemsPerPage))].map((_, i) => (
                         <PaginationItem key={i}>
                           <PaginationLink 
                             onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                             isActive={currentPage === i + 1}
                           >
                             {i + 1}
                           </PaginationLink>
                         </PaginationItem>
                       ))}

                       <PaginationItem>
                         <PaginationNext 
                           onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(Math.ceil(projects.length / itemsPerPage), p + 1)) }}
                           className={currentPage === Math.ceil(projects.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
                         />
                       </PaginationItem>
                     </PaginationContent>
                   </Pagination>
                 </div>
               )}
             </>
           )}
        </div>
      </div>
    </div>
  );
};
export default AdminProjects;
