import React, { useState, useEffect, useRef } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Sparkles,
  Save,
  CheckCircle,
  Upload,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { getProjects, createProject, updateProject, deleteProject, uploadFile } from '../../services/api';

export default function ProjectsView() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack',
    short_description: '',
    long_description: '',
    tech_stack: '',
    live_url: '',
    github_url: '',
    image_url: '',
    is_featured: false,
    sort_order: 0,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Full Stack',
      short_description: '',
      long_description: '',
      tech_stack: 'React 19, Laravel 11, MySQL, Tailwind CSS',
      live_url: '',
      github_url: '',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      is_featured: false,
      sort_order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || '',
      category: proj.category || 'Full Stack',
      short_description: proj.short_description || '',
      long_description: proj.long_description || '',
      tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '',
      live_url: proj.live_url || '',
      github_url: proj.github_url || '',
      image_url: proj.image_url || '',
      is_featured: !!proj.is_featured,
      sort_order: proj.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadFile(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
    } catch (err) {
      alert('Failed to upload image. Please ensure file is less than 10MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tech_stack: formData.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, payload);
      } else {
        await createProject(payload);
      }
      setIsModalOpen(false);
      loadProjects();
    } catch (err) {
      alert('Failed to save project. Please verify required fields.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-blue-400" />
            Projects & Snapshots Manager
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showcase high-scale web platforms, upload project snapshots, link GitHub repositories and live deployments.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm">
            No projects added yet. Click "Add New Project" to create one.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#0b101d] rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300"
            >
              <div>
                <div className="h-48 bg-slate-900 relative group overflow-hidden">
                  {proj.image_url ? (
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <FolderGit2 className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/80 text-blue-300 border border-blue-400/30 backdrop-blur-xs">
                      {proj.category}
                    </span>
                  </div>
                  {proj.is_featured && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/80 text-white border border-indigo-400/30 flex items-center gap-1 backdrop-blur-xs">
                        <Sparkles className="w-3 h-3 text-amber-300" /> Featured
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-white mb-1.5">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {proj.short_description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(proj.tech_stack) &&
                      proj.tech_stack.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    {Array.isArray(proj.tech_stack) && proj.tech_stack.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                        +{proj.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 pt-3">
                  {proj.live_url && (
                    <a
                      href={proj.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
                      title="Live Project URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
                      title="GitHub Repository"
                    >
                      <GithubIcon className="w-3.5 h-3.5 fill-current" />
                      Source
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-3">
                  <button
                    onClick={() => handleOpenEditModal(proj)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#090d16] border border-white/10 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative my-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">PROJECT TITLE *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. HyperScale Cloud Platform"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">CATEGORY *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="AI & Cloud">AI & Cloud</option>
                    <option value="Frontend & 3D">Frontend & 3D</option>
                    <option value="Backend / API">Backend / API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">SORT ORDER</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  SHORT DESCRIPTION *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="1-2 sentences for card summary..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  DETAILED ARCHITECTURE & HIGHLIGHTS
                </label>
                <textarea
                  rows={4}
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  placeholder="In-depth details for 3D modal deep dive..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  TECH STACK (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="React 19, Laravel 11, MySQL, Redis, Three.js"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LIVE DEMO URL</label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">GITHUB REPO URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Snapshot Uploader */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    PROJECT COVER / SNAPSHOT IMAGE
                  </label>
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        Upload Snapshot
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {formData.image_url && (
                  <div className="h-28 w-full rounded-lg overflow-hidden bg-black/40 border border-white/10 relative">
                    <img
                      src={formData.image_url}
                      alt="Snapshot preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or enter direct image URL (https://...)"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-black/40 border-white/20 focus:ring-0"
                />
                <label htmlFor="is_featured" className="text-xs text-slate-300 cursor-pointer">
                  Feature this project prominently on the top carousel
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
