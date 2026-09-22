import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  GraduationCap,
  Users,
  Brain,
  CheckCircle2,
  Award,
  Terminal,
  FileText,
  MapPin,
  Heart,
  Globe,
  Server,
} from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineLink from '../editor/InlineLink';

export default function AboutSection({ profile }) {
  const { updateProfileField, updateAboutDetail } = useVisualEditor();

  const pillars = [
    {
      key: 'pillar1',
      title: profile?.about_details?.pillar1_title ?? 'Full-Stack Web & APIs',
      desc: profile?.about_details?.pillar1_desc ?? 'Developing end-to-end applications using React 19, Next.js, Node.js, Express, Laravel, and relational databases (MySQL, SQLite, Firebase).',
      icon: Layers,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      key: 'pillar2',
      title: profile?.about_details?.pillar2_title ?? 'Smart Campus Automation',
      desc: profile?.about_details?.pillar2_desc ?? 'Building pragmatic software like Hostel Kavach (GPS/geofenced attendance) and SmartGate (temporary QR entry) that solve real campus problems.',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      key: 'pillar3',
      title: profile?.about_details?.pillar3_title ?? 'Backend & REST APIs',
      desc: profile?.about_details?.pillar3_desc ?? 'Architecting secure backend services with Node.js, Express, Laravel 11, and relational databases (MySQL, SQLite) with role-based access control.',
      icon: Server,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      key: 'pillar4',
      title: profile?.about_details?.pillar4_title ?? 'Algorithms & Core CS',
      desc: profile?.about_details?.pillar4_desc ?? 'Deepening foundations in Data Structures & Algorithms, Object-Oriented Programming with C++, Database Management, and System Design.',
      icon: Brain,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  const primaryInterests = [
    'Software Development',
    'Full-Stack Development',
    'Artificial Intelligence & ML',
    'Web Development & 3D WebGL',
    'Database Systems (MySQL, SQLite, Firebase)',
    'Data Structures & Algorithms (DSA)',
    'Cybersecurity & Network Diagnostics',
    'Geopolitics & Tech Strategy',
  ];

  return (
    <section id="about" className="py-28 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/30">
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.about_badge ?? ('About ' + (profile?.name || 'Vikash Kumar'))}
              placeholder="About Vikash Kumar"
              onChange={(val) => updateAboutDetail('about_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.about_title_1 ?? 'Engineering Practical Software &'}
              placeholder="Engineering Practical Software &"
              onChange={(val) => updateAboutDetail('about_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.about_title_gradient ?? 'Solving Real-World Problems'}
                placeholder="Solving Real-World Problems"
                onChange={(val) => updateAboutDetail('about_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.about_subtitle ?? 'Computer Science Engineering student passionate about crafting reliable full-stack applications, exploring AI integrations, and coordinating impact on campus.'}
              placeholder="Computer Science Engineering student passionate about crafting reliable full-stack applications, exploring AI integrations, and coordinating impact on campus."
              onChange={(val) => updateAboutDetail('about_subtitle', val)}
            />
          </p>
        </div>

        {/* 2-Column Story & Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Bio, Origin & Core Interests */}
          <div className="lg:col-span-5 space-y-6">
            <div className="cosmic-card rounded-3xl p-8 relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-red-400" />
                <InlineText
                  value={profile?.about_details?.who_i_am_title ?? 'Who I Am'}
                  placeholder="Who I Am"
                  onChange={(val) => updateAboutDetail('who_i_am_title', val)}
                />
              </h3>

              <InlineText
                as="p"
                className="text-slate-300 text-sm sm:text-base leading-relaxed block"
                value={profile?.bio}
                placeholder="I am a Computer Science Engineering student at I.K. Gujral Punjab Technical University (IKGPTU), Main Campus, Kapurthala, Punjab (2nd Year / 4th Semester), originally from Bihar, India. Passionate about building practical software products and solving real-world problems through technology."
                onChange={(val) => updateProfileField('bio', val)}
              />

              {/* Geographic Pill */}
              <div className="mt-5 p-4 rounded-2xl bg-[#12070b]/80 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    <InlineText
                      value={profile?.about_details?.geo_title ?? 'From Bihar • Studying in Punjab'}
                      placeholder="From Bihar • Studying in Punjab"
                      onChange={(val) => updateAboutDetail('geo_title', val)}
                    />
                  </span>
                  <span className="text-slate-400">
                    <InlineText
                      value={profile?.about_details?.geo_subtitle ?? 'IKGPTU Main Campus, Kapurthala, Punjab (Batch 2024 - 2028)'}
                      placeholder="IKGPTU Main Campus, Kapurthala, Punjab (Batch 2024 - 2028)"
                      onChange={(val) => updateAboutDetail('geo_subtitle', val)}
                    />
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-red-400 font-bold font-mono">
                  <InlineText
                    value={profile?.about_details?.interests_header ?? 'Primary Technical Interests'}
                    placeholder="Primary Technical Interests"
                    onChange={(val) => updateAboutDetail('interests_header', val)}
                  />
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {primaryInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 shadow-xs hover:border-red-500/30 transition-colors"
                    >
                      <InlineText
                        value={profile?.about_details?.[`interest_${idx}`] ?? interest}
                        placeholder={interest}
                        onChange={(val) => updateAboutDetail(`interest_${idx}`, val)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {profile?.resume_url && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <InlineLink
                    href={profile.resume_url}
                    onHrefChange={(val) => updateProfileField('resume_url', val)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <InlineText
                      as="span"
                      value={profile?.about_details?.about_resume_btn ?? 'Download Official Resume (PDF)'}
                      placeholder="Download Official Resume (PDF)"
                      onChange={(val) => updateAboutDetail('about_resume_btn', val)}
                    />
                  </InlineLink>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: 4 Engineering & Leadership Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="cosmic-card cosmic-card-hover rounded-3xl p-7 flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      <InlineText
                        value={p.title}
                        placeholder={p.title}
                        onChange={(val) => updateAboutDetail(`${p.key}_title`, val)}
                      />
                    </h3>
                    <div className="text-sm text-slate-300 leading-relaxed">
                      <InlineText
                        as="p"
                        value={p.desc}
                        placeholder={p.desc}
                        onChange={(val) => updateAboutDetail(`${p.key}_desc`, val)}
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-red-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Focus Area</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
