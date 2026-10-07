import React from 'react';
import { Code, BookOpen, ChevronRight, Activity, Award } from 'lucide-react';

export default function AboutSection({ profile, educations }) {
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';
  const aboutText = profile?.about_description || profile?.bio || '';
  const stats = profile?.about_stats || [
    { label: 'GPA', value: '8.5', unit: '' },
    { label: 'Projects', value: '15+', unit: 'Completed' },
    { label: 'Code Commits', value: '1,200+', unit: 'GitHub' },
    { label: 'System Uptime', value: '99.9%', unit: 'Live SLA' },
  ];

  const primaryEdu = educations?.[0] || null;

  return (
    <section id="about" className="py-24 bg-[#0d0e12] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800/80">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-14">
          <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
            CORE BACKGROUND & ACADEMICS
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-bold">
            About Me
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Left Column: Bio Narrative */}
          <div className="md:w-3/5 space-y-6 text-slate-300 text-base md:text-lg leading-relaxed">
            <p className="whitespace-pre-line">
              {aboutText}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-700/80 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-200 hover:border-emerald-400 hover:text-emerald-400 transition-colors bg-slate-900/60"
                >
                  <Code className="w-3.5 h-3.5" /> View Code on GitHub
                </a>
              )}
              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-700/80 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-200 hover:border-emerald-400 hover:text-emerald-400 transition-colors bg-slate-900/60"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Resume Document
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Academic & Personal Metrics Card */}
          {(primaryEdu || (stats && stats.length > 0)) && (
            <div className="md:w-2/5 w-full">
              <div className="bg-slate-900/90 rounded-2xl p-7 border border-slate-800 shadow-xl space-y-6">
                {primaryEdu && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        ACADEMIC CREDENTIALS
                      </span>
                      {primaryEdu.grade && (
                        <span className="text-xs text-slate-400 font-mono">{primaryEdu.grade}</span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{primaryEdu.degree}</h3>
                      <p className="text-xs text-slate-400">{primaryEdu.institution}</p>
                    </div>
                  </>
                )}

                {/* Dynamic Stats Grid */}
                {stats && stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div style={{ color: primaryColor }} className="text-2xl font-bold font-mono mb-0.5">
                          {stat.value}
                        </div>
                        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                          {stat.label}
                        </div>
                        {stat.unit && (
                          <div className="text-[10px] text-slate-500 font-mono">{stat.unit}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
