import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: '', description: '' });
  const token = localStorage.getItem('token');

  const fetchExperiences = async () => {
    const res = await axios.get('http://localhost:8000/api/experiences');
    setExperiences(res.data);
  };

  useEffect(() => { fetchExperiences(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await axios.put(`http://localhost:8000/api/experiences/${editingExp.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/experiences', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      closeModal();
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExp = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      await axios.delete(`http://localhost:8000/api/experiences/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExperiences();
    }
  };

  const openCreate = () => {
    setEditingExp(null);
    setFormData({ title: '', location: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (exp) => {
    setEditingExp(exp);
    setFormData({ title: exp.title, location: exp.location, description: exp.description });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
    setFormData({ title: '', location: '', description: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-dark">Experiences</h2>
          <p className="text-sm text-gray-400 mt-1">Manage your work experience entries.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-brand-dark/90 transition-all shadow-md shadow-brand-dark/15"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Experience
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {experiences.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center text-sm text-gray-300">
                  No experiences yet. Click "Add Experience" to get started.
                </td>
              </tr>
            )}
            {experiences.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-brand-dark">{exp.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{exp.location}</td>
                <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{exp.description}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(exp)} className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteExp(exp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-lg font-extrabold text-brand-dark">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
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
                  placeholder="e.g. Remote Broadcasting Management"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm"
                  placeholder="e.g. Jakarta"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 outline-none text-sm h-28 resize-none"
                  placeholder="Describe your role and achievements..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-brand-dark/90 transition-all shadow-md shadow-brand-dark/15">
                  {editingExp ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExperiences;
