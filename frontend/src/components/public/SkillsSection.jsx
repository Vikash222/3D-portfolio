import React from 'react';
import { cn } from '../../lib/utils';

export default function SkillsSection({ skills = [], profile }) {
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  // Group by category_name or category
  const groups = skills.reduce((acc, skill) => {
    const cat = skill.category_name || skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(groups);

  return (
    <section id="skills" className="py-24 bg-[#121214] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800/80">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-14">
          <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
            TECHNICAL ARSENAL & TOOLKIT
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            What I Work With
          </h2>
          <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
            A comprehensive overview of my technical stack, spanning low-level algorithms, headless backend systems, and modern AI pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="border border-slate-800 rounded-2xl p-7 bg-slate-900/50 hover:border-slate-700 transition-colors space-y-5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <h3 className="text-white font-bold text-sm tracking-wider uppercase font-mono">
                  {cat}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {groups[cat].length} Skills
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {groups[cat].map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center px-3.5 py-1.5 bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl hover:border-emerald-400 transition-colors"
                  >
                    <span
                      style={{ backgroundColor: primaryColor }}
                      className="w-1.5 h-1.5 rounded-full mr-2"
                    />
                    <span>{skill.name}</span>
                    {skill.proficiency && (
                      <span className="ml-2 text-[10px] text-slate-500 font-mono">
                        {skill.proficiency}%
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
