import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, Save, CheckCircle } from 'lucide-react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../services/api';

export default function ExperienceView() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '2023 - Present',
    location: 'Bengaluru, India',
    description: '',
    highlights: '',
    is_current: false,
    sort_order: 0,
  });

  const loadList = async () => {
    try {
      setLoading(true);
      const data = await getExperiences();
      setExperiences(data.experiences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      period: '2024 - Present',
      location: 'Remote',
      description: '',
      highlights: 'Architected microservices handling 10M+ daily events\nBuilt responsive React 19 design system',
      is_current: false,
      sort_order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      period: exp.period || '',
      location: exp.location || '',
      description: exp.description || '',
      highlights: Array.isArray(exp.highlights) ? exp.highlights.join('\n') : '',
      is_current: !!exp.is_current,
      sort_order: exp.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      highlights: formData.highlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
    };

    try {
      if (editingExp) {
        await updateExperience(editingExp.id, payload);
      } else {
        await createExperience(payload);
      }
      setIsModalOpen(false);
      loadList();
    } catch (err) {
      alert('Failed to save experience record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this career milestone?')) return;
    try {
      await deleteExperience(id);
      loadList();
    } catch (err) {
      alert('Failed to delete experience record.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Career Milestones & Timeline</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your employment history, roles, leadership contributions, and achievements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">Loading milestones...</div>
        ) : experiences.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No career records yet.</div>
        ) : (
          experiences.map((item) => (
            <div
              key={item.id}
              className="admin-card rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-cyan-500/30 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-bold text-white">{item.role}</h3>
                  <span className="text-cyan-400 font-semibold text-sm">&bull; {item.company}</span>
                  {item.is_current && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-400">
                  <span>{item.period}</span>
                  {item.location && <span> &bull; {item.location}</span>}
                </div>

                {item.description && (
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                )}

                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <ul className="space-y-1 pt-2">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="admin-card border border-white/20 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              {editingExp ? 'Edit Milestone' : 'Add Career Milestone'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">ROLE / TITLE *</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Lead Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">COMPANY *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Tech Corp"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">PERIOD *</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2022 - Present"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bengaluru / Remote"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of responsibilities..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  HIGHLIGHTS (ONE PER LINE)
                </label>
                <textarea
                  rows={4}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Reduced latency by 45%&#10;Mentored 6 engineers"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-500 bg-black/40 border-white/20"
                />
                <label htmlFor="is_current" className="text-xs text-slate-300 font-medium">
                  This is my current role
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
