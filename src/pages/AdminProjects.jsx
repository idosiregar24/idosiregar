import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '', project_link: '' });
  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:8000/api/projects');
    setProjects(res.data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProj) {
        await axios.put(`http://localhost:8000/api/projects/${editingProj.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/projects', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProj = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await axios.delete(`http://localhost:8000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    }
  };

  const openCreate = () => {
    setEditingProj(null);
    setFormData({ title: '', description: '', image_url: '', project_link: '' });
    setIsModalOpen(true);
  };

  const openEdit = (proj) => {
    setEditingProj(proj);
    setFormData({ title: proj.title, description: proj.description, image_url: proj.image_url, project_link: proj.project_link || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProj(null);
    setFormData({ title: '', description: '', image_url: '', project_link: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Projects</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your portfolio projects.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-brand-dark/90 transition-all shadow-md shadow-brand-dark/15"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Project
        </button>
      </div>

      {/* Cards Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p className="text-sm text-gray-400">No projects yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-5">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex gap-5">
              <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {proj.image_url ? (
                  <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-base font-bold text-brand-dark mb-1">{proj.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{proj.description}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Portfolio</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(proj)} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteProj(proj.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-lg font-extrabold text-brand-dark">{editingProj ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm"
                  placeholder="e.g. DifableCare Platform"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm"
                  placeholder="https://example.com/image.png"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Project Link <span className="normal-case text-gray-300">(Optional)</span></label>
                <input
                  type="text"
                  value={formData.project_link}
                  onChange={(e) => setFormData({...formData, project_link: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm h-28 resize-none"
                  placeholder="Describe this project..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-brand-dark/90 transition-all shadow-md shadow-brand-dark/15">
                  {editingProj ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
