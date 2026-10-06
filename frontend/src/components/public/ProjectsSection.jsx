import React, { useState } from 'react';
import { ArrowRight, Star, ExternalLink, Code2 } from 'lucide-react';
import { Github } from '../icons';
import { getAssetUrl } from '../../lib/utils';

export default function ProjectsSection({ projects = [], profile }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  const categories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 bg-[#0d0e12] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800/80">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
              FEATURED ENGINEERING WORK
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white font-bold">
              Things I've Built
            </h2>
          </div>

          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white transition-colors group"
            >
              Explore Repositories on GitHub
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <Code2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 text-sm font-semibold">No projects published yet</p>
            <p className="text-slate-500 text-xs mt-1">You can add projects dynamically anytime from the Admin CMS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900/80 rounded-2xl overflow-hidden shadow-lg border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="h-52 bg-slate-950 relative overflow-hidden">
                <img
                  src={getAssetUrl(project.thumbnail_url, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80')}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-200 border border-slate-700 font-mono uppercase">
                  {project.category || 'System'}
                </div>

                {project.views_count > 0 && (
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-slate-700 flex items-center gap-1 font-mono">
                    <Star className="w-3 h-3 fill-emerald-400" /> {project.views_count}
                  </div>
                )}
              </div>

              {/* Project Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_tags?.map((t, i) => (
                      <span
                        key={i}
                        className="bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] font-mono px-2.5 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    {project.github_link && project.github_link !== '#' ? (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
                      >
                        <Github className="w-4 h-4" /> Code Repo
                      </a>
                    ) : <span />}

                    {project.live_link && project.live_link !== '#' && (
                      <a
                        href={project.live_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: primaryColor }}
                        className="hover:underline transition-colors flex items-center gap-1.5 font-semibold text-xs"
                      >
                        Live Demo <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
