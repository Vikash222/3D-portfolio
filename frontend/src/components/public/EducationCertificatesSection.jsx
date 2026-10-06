import React from 'react';
import { GraduationCap, Award, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function EducationCertificatesSection({ educations = [], certificates = [], achievements = [], profile }) {
  if (educations.length === 0 && certificates.length === 0 && achievements.length === 0) return null;
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  return (
    <section id="education" className="py-24 bg-[#121214] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Education & Academics */}
          <div>
            <div className="mb-8">
              <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
                ACADEMIC FOUNDATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-emerald-400" /> Education
              </h2>
            </div>

            <div className="space-y-6">
              {educations.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-slate-300 font-medium">{edu.institution}</p>
                    </div>
                    {edu.grade && (
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                        {edu.grade}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.start_date} - {edu.end_date || 'Present'}</span>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {edu.description}
                    </p>
                  )}

                  {edu.certificate_link && (
                    <a
                      href={edu.certificate_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: primaryColor }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                    >
                      <span>Verification Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Certifications & Honors */}
          <div>
            <div className="mb-8">
              <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
                INDUSTRY CREDENTIALS
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400" /> Certifications & Achievements
              </h2>
            </div>

            <div className="space-y-4">
              {certificates.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {cert.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      {cert.issuer} {cert.issue_date && `· ${cert.issue_date}`}
                    </p>
                    {cert.credential_id && (
                      <p className="text-[10px] font-mono text-slate-500 pl-6">
                        Credential ID: {cert.credential_id}
                      </p>
                    )}
                  </div>

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors shrink-0"
                      title="View Credential"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}

              {achievements.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {ach.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 pl-6">
                      {ach.description}
                    </p>
                  </div>
                  {ach.external_link && (
                    <a
                      href={ach.external_link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
