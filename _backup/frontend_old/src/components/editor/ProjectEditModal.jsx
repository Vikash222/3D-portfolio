import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, ExternalLink, FolderGit2, Link as LinkIcon } from 'lucide-react';

export default function ProjectEditModal({
  isOpen,
  project,
  onClose,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    live_url: '',
    github_url: '',
    tags: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'Full-Stack Web',
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
      });
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...project,
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0b101f] rounded-3xl border border-cyan-500/30 shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold">Edit Project Links &amp; Details</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">PROJECT TITLE:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">LIVE DEMO URL (WEBSITE):</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://your-project.vercel.app"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">GITHUB REPO URL (SOURCE CODE):</label>
            <div className="relative">
              <FolderGit2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/Vikash222/repo-name"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">CATEGORY:</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Full-Stack Web"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">TAGS (COMMA SEPARATED):</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="React, Firebase, Tailwind"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">DESCRIPTION:</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete project "${project.title}"?`)) {
                    onDelete(project.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Project Details</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
