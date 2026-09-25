import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, Layers, X, Plus, Edit2, Trash2, Link as LinkIcon, Settings } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineImageOverlay from '../editor/InlineImageOverlay';
import ProjectEditModal from '../editor/ProjectEditModal';

export default function ProjectsSection({ projects = [], profile = null }) {
  const { isEditMode, isPreviewMode, updateProject, deleteProject, addProject, updateAboutDetail } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [editingModalProject, setEditingModalProject] = useState(null);

  const categories = ['All', 'Full Stack', 'AI & Cloud', 'Frontend & 3D', 'Backend / API'];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg shadow-red-950/30">
            <Layers className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.projects_badge ?? 'Featured Work & Architecture'}
              placeholder="Featured Work & Architecture"
              onChange={(val) => updateAboutDetail('projects_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.projects_title_1 ?? 'Engineered For Scale,'}
              placeholder="Engineered For Scale,"
              onChange={(val) => updateAboutDetail('projects_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.projects_title_gradient ?? 'Built for Real Impact'}
                placeholder="Built for Real Impact"
                onChange={(val) => updateAboutDetail('projects_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            <InlineText
              as="span"
              value={profile?.about_details?.projects_subtitle ?? 'A curated showcase of production applications, distributed backend microservices, and interactive 3D WebGL interfaces.'}
              placeholder="A curated showcase of production applications, distributed backend microservices, and interactive 3D WebGL interfaces."
              onChange={(val) => updateAboutDetail('projects_subtitle', val)}
            />
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-lg shadow-red-500/25 border border-red-400/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                key={project.id || project.slug}
                className="cosmic-card cosmic-card-hover rounded-3xl overflow-hidden flex flex-col group relative"
              >
                {/* Image Container with Inline Overlay */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                  <InlineImageOverlay
                    currentSrc={project.image_url}
                    aspect="16:9"
                    title={`Cut & Scale Project: ${project.title}`}
                    onImageChanged={(newUrl) => updateProject({ ...project, image_url: newUrl })}
                    onImageDeleted={() => updateProject({ ...project, image_url: '' })}
                  />

                  <img
                    src={
                      project.image_url ||
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/80 text-red-300 border border-white/10 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {project.is_featured && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Edit Mode Actions Toolbar on Card */}
                {editable && (
                  <div className="px-4 py-2 bg-gradient-to-r from-red-950 via-slate-950 to-red-950 text-white flex items-center justify-between gap-2 border-b border-red-500/30">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingModalProject(project);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Live Demo URL, GitHub Repo, Category & Tags"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Edit URLs &amp; Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete project "${project.title}"?`)) {
                          deleteProject(project.id);
                        }
                      }}
                      className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 text-[11px] font-bold cursor-pointer transition-colors"
                      title="Delete Project Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Project Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                      <InlineText
                        value={project.title}
                        placeholder="Project Title"
                        onChange={(newTitle) => updateProject({ ...project, title: newTitle })}
                      />
                    </h3>

                    <div className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
                      <InlineText
                        as="p"
                        value={project.short_description || project.description}
                        placeholder="Project brief description..."
                        onChange={(newDesc) =>
                          updateProject({
                            ...project,
                            short_description: newDesc,
                            description: newDesc,
                          })
                        }
                      />
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {Array.isArray(project.tech_stack) &&
                        project.tech_stack.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Deep Dive &amp; Specs</span>
                      <span className="text-xs">&rarr;</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
                          title="View GitHub Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* + Add New Project Card in Edit Mode */}
            {editable && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  const newProject = {
                    id: 'proj_' + Date.now(),
                    title: 'New Production Project',
                    category: 'Full-Stack Web',
                    short_description: 'Write a brief description here or click Edit URLs to customize.',
                    description: 'Comprehensive architectural breakdown of this project.',
                    tech_stack: ['React', 'Node.js', 'Tailwind'],
                    live_url: '',
                    github_url: '',
                    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                  };
                  if (addProject) addProject(newProject);
                  setEditingModalProject(newProject);
                }}
                className="min-h-[350px] rounded-3xl border-2 border-dashed border-cyan-400/60 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 group shadow-inner"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 text-cyan-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-base group-hover:text-cyan-600">
                  + Add New Project Card
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Click to add a new project card right here in the grid. You can then edit its live demo URL, GitHub repo, photo, and title.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Deep Dive Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0e0609] text-white border border-white/15 shadow-2xl shadow-red-950/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 mb-3 font-mono">
                {activeModalProject.category}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{activeModalProject.title}</h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                {activeModalProject.long_description || activeModalProject.short_description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 font-mono">
                  Technologies Utilized
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(activeModalProject.tech_stack) &&
                    activeModalProject.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1 rounded-xl bg-white/5 text-slate-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {activeModalProject.live_url && (
                  <a
                    href={activeModalProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Live Demo
                  </a>
                )}
                {activeModalProject.github_url && (
                  <a
                    href={activeModalProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 font-semibold text-xs sm:text-sm"
                  >
                    <GithubIcon className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* In-Place Project Edit Modal for URLs & Details */}
      <ProjectEditModal
        isOpen={!!editingModalProject}
        project={editingModalProject}
        onClose={() => setEditingModalProject(null)}
        onSave={(updated) => {
          if (updateProject) updateProject(updated);
          setEditingModalProject(null);
        }}
        onDelete={(id) => {
          if (deleteProject) deleteProject(id);
          setEditingModalProject(null);
        }}
      />
    </section>
  );
}
