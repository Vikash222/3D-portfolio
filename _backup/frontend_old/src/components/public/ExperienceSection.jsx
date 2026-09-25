import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle, Award } from 'lucide-react';

export default function ExperienceSection({ experiences = [] }) {
  return (
    <section id="experience" className="py-28 relative overflow-hidden bg-transparent">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/30">
            <Briefcase className="w-3.5 h-3.5 text-red-400" />
            Career Milestones &amp; Proven Track Record
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Work Experience &amp;{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              Engineering Leadership
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Leading cross-functional engineering teams, architecting distributed cloud backends, and pioneering next-gen 3D web interfaces.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-36 space-y-12">
          {experiences.map((item, index) => (
            <div key={item.id || index} className="relative pl-7 sm:pl-12 group">
              {/* Timeline Node Point */}
              <div
                className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 transition-all duration-300 group-hover:scale-125 ${
                  item.is_current
                    ? 'bg-red-500 border-slate-950 shadow-[0_0_16px_rgba(239,68,68,0.8)] ring-2 ring-red-400'
                    : 'bg-slate-900 border-red-500 group-hover:bg-red-500 group-hover:border-slate-950 shadow-sm'
                }`}
              />

              {/* Date tag for large screens */}
              <div className="hidden sm:block absolute -left-40 top-1 w-32 text-right">
                <span className="font-mono text-xs font-bold text-red-400 px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/10 shadow-xs">
                  {item.period}
                </span>
              </div>

              {/* Timeline Card - Cosmic Glass */}
              <div className="cosmic-card cosmic-card-hover rounded-2xl p-7 transition-all duration-300">
                {/* Date tag for small screens */}
                <div className="sm:hidden inline-flex items-center gap-1.5 text-xs font-mono text-red-400 mb-3 font-bold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.period}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                    {item.role}
                  </h3>
                  {item.is_current && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active Lead Role
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4 font-medium">
                  <span className="text-red-400 font-bold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                    {item.company}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {item.location}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    {item.description}
                  </p>
                )}

                {/* Highlights */}
                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {item.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
