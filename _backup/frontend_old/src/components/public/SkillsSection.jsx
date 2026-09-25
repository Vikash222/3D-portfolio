import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Server,
  Database,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Palette,
  Box,
  FileCode,
  Zap,
  Container,
  GitBranch,
  Terminal,
  Bot,
  GitFork,
  Plus,
  Trash2,
} from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';

const ICON_MAP = {
  Code2,
  Server,
  Database,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Palette,
  Box,
  FileCode,
  Zap,
  Container,
  GitBranch,
  Terminal,
  Bot,
  GitFork,
};

export default function SkillsSection({ skills = [], profile = null }) {
  const { isEditMode, isPreviewMode, updateSkill, deleteSkill, addSkill, updateAboutDetail } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;
  const [selectedCategory, setSelectedCategory] = useState('All');


  const rawCategories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
  const categories = ['All', ...(rawCategories.length > 0 ? rawCategories : ['Languages', 'Frontend', 'Backend', 'Database', 'Tools & Platforms'])];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-lg shadow-red-950/30">
            <Cpu className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.skills_badge ?? 'Capabilities & Stack'}
              placeholder="Capabilities & Stack"
              onChange={(val) => updateAboutDetail('skills_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.skills_title_1 ?? 'Technical Arsenal &'}
              placeholder="Technical Arsenal &"
              onChange={(val) => updateAboutDetail('skills_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.skills_title_gradient ?? 'Proficiency'}
                placeholder="Proficiency"
                onChange={(val) => updateAboutDetail('skills_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-3 text-slate-300 text-base sm:text-lg">
            <InlineText
              as="span"
              value={profile?.about_details?.skills_subtitle ?? 'High mastery across modern frontend ecosystems, enterprise backend frameworks, distributed databases, and cloud infrastructure.'}
              placeholder="High mastery across modern frontend ecosystems, enterprise backend frameworks, distributed databases, and cloud infrastructure."
              onChange={(val) => updateAboutDetail('skills_subtitle', val)}
            />
          </p>
        </div>

        {/* Category Filter Tabs */}
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

        {/* Skills Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const IconComponent = ICON_MAP[skill.icon] || Code2;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={skill.id || skill.name}
                  className="cosmic-card cosmic-card-hover rounded-2xl p-5 group relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm sm:text-base">
                          <InlineText
                            value={skill.name}
                            placeholder="Skill Name"
                            onChange={(val) => updateSkill(skill.id, { ...skill, name: val })}
                          />
                        </h3>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                        <InlineText
                          value={skill.level || 'Advanced'}
                          placeholder="Advanced"
                          onChange={(val) => updateSkill(skill.id, { ...skill, level: val })}
                        />
                      </span>
                      {editable && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete skill "${skill.name}"?`)) {
                              deleteSkill(skill.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete this skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar / In-Edit Slider */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Proficiency</span>
                      <span className="text-red-400 font-bold">{skill.proficiency}%</span>
                    </div>

                    {editable ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={skill.proficiency || 80}
                          onChange={(e) =>
                            updateSkill(skill.id, {
                              ...skill,
                              proficiency: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full accent-red-500 cursor-pointer h-1.5 rounded-lg bg-white/10"
                          title="Drag to change proficiency percentage"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-red-500 via-rose-500 to-red-400 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* + Add New Skill Card in Edit Mode */}
            {editable && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  const newSkill = {
                    id: 'skill_' + Date.now(),
                    name: 'New Skill / Stack',
                    category: selectedCategory === 'All' ? 'Languages' : selectedCategory,
                    proficiency: 85,
                    level: 'Advanced',
                    icon: 'Code2',
                  };
                  if (addSkill) addSkill(newSkill);
                }}
                className="rounded-2xl p-5 border-2 border-dashed border-cyan-400/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group min-h-[130px]"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-white text-sm group-hover:text-cyan-300">
                  + Add New Skill
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {selectedCategory === 'All' ? 'Languages' : selectedCategory}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Technical Architecture & Engineering Specializations Banner */}
        <div className="mt-16 cosmic-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Engineering Specializations
              </div>
              <h3 className="text-2xl font-black text-white">
                Core Architectural Competencies
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 self-start sm:self-auto">
              16+ Repos &bull; 500+ Commits &bull; Production Deployed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Full-Stack & Modern Web */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shadow-xs">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Full-Stack & Interactive Web</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Building scalable single-page and server-rendered applications with React 19, Next.js, Vite, Tailwind CSS, and 3D Three.js WebGL graphics.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['React.js', 'Next.js', 'Tailwind CSS', 'Vite', 'Three.js WebGL'].map((t, i) => (
                  <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Backend, APIs & Databases */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shadow-xs">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Backend, APIs & Databases</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Architecting high-reliability RESTful services using Node.js, Express, and Laravel 11 with MySQL relational modeling, SQLite, and Firebase.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Node.js', 'Express', 'Laravel 11', 'MySQL', 'SQLite', 'Firebase'].map((t, i) => (
                  <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-indigo-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 3: C++ DSA & Intelligent Systems */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/40 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">C++ DSA & Intelligent Systems</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strong foundational problem-solving in C++ (OOP, DSA, DP, Graphs) integrated with Gemini LLM APIs, GPS geofencing, and network diagnostics.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['C++ DSA', 'C++ OOP', 'Gemini AI API', 'Geofencing', 'OpenCV'].map((t, i) => (
                  <span key={i} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
