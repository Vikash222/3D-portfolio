import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Sparkles,
  Code2,
  Database,
  Shield,
  Zap,
  Bot,
  Award,
  ExternalLink,
  GraduationCap,
  Users,
  FolderGit2,
  Cpu,
} from 'lucide-react';
import MobileStoryBar from './MobileStoryBar';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineImageOverlay from '../editor/InlineImageOverlay';
import InlineLink from '../editor/InlineLink';

export default function HeroSection({ profile, onOpenChat }) {
  const { updateProfileField, updateAboutDetail } = useVisualEditor();
  const titles = [
    'Computer Science Engineering Student',
    'Full-Stack Web & REST API Architect',
    'AI Systems & Gemini LLM Integrator',
    'Hostel Kavach & Campus ERP Creator',
    'React.js, Next.js & Laravel Developer',
    'C++ OOP & System Design Explorer',
  ];

  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const fullText = titles[titleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        if (displayText === fullText) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    }, isDeleting ? 35 : typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  const heroImage =
    profile?.hero_image_url ||
    profile?.avatar_url ||
    '/assets/vikash-hero.jpg';

  const stats = [
    {
      key: 'stat1',
      label: profile?.about_details?.stat1_lbl ?? 'B.Tech CSE',
      value: profile?.about_details?.stat1_val ?? '2nd Year',
      icon: GraduationCap,
    },
    {
      key: 'stat2',
      label: profile?.about_details?.stat2_lbl ?? 'GitHub Repos',
      value: profile?.about_details?.stat2_val ?? '16+',
      icon: FolderGit2,
    },
    {
      key: 'stat3',
      label: profile?.about_details?.stat3_lbl ?? 'Code Commits',
      value: profile?.about_details?.stat3_val ?? '500+',
      icon: Code2,
    },
    {
      key: 'stat4',
      label: profile?.about_details?.stat4_lbl ?? 'Core Stack',
      value: profile?.about_details?.stat4_val ?? 'React & C++',
      icon: Cpu,
    },
  ];

  return (
    <section id="hero" className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Mobile Story Highlights Reel (Visible only on mobile devices) */}
        <MobileStoryBar
          onOpenChat={onOpenChat}
          profile={profile}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mt-2 sm:mt-0">
          {/* Left Column: Story & Headline */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold backdrop-blur-md mb-6 shadow-lg shadow-red-950/30"
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <InlineText
                value={profile?.status_badge}
                placeholder="B.Tech CSE 2nd Year @ IKGPTU • Open for Software Internships"
                onChange={(val) => updateProfileField('status_badge', val)}
              />
            </motion.div>

            {/* Main Title - Fully Inline Editable */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]"
            >
              <InlineText
                as="span"
                value={profile?.about_details?.hero_headline_1 ?? 'Building Scalable'}
                placeholder="Building Scalable"
                onChange={(val) => updateAboutDetail('hero_headline_1', val)}
              />{' '}
              <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                <InlineText
                  as="span"
                  value={profile?.about_details?.hero_headline_gradient ?? 'Software & AI Systems'}
                  placeholder="Software & AI Systems"
                  onChange={(val) => updateAboutDetail('hero_headline_gradient', val)}
                />
              </span>{' '}
              <InlineText
                as="span"
                value={profile?.about_details?.hero_headline_2 ?? 'with Purpose'}
                placeholder="with Purpose"
                onChange={(val) => updateAboutDetail('hero_headline_2', val)}
              />
            </motion.h1>

            {/* Dynamic Typewriter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-10 sm:h-12 mt-4 flex items-center"
            >
              <p className="text-lg sm:text-2xl font-mono text-slate-200 font-bold flex items-center">
                <span className="text-red-500 mr-2 font-black">&gt;</span>
                <span>{displayText}</span>
                <span className="inline-block w-2.5 h-6 ml-1 bg-red-500 animate-pulse" />
              </p>
            </motion.div>

            {/* Bio Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <InlineText
                as="p"
                className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed block"
                value={profile?.tagline}
                placeholder="Computer Science Engineering Student @ IKGPTU Main Campus, Kapurthala. Passionate full-stack developer building practical platforms like Hostel Kavach and Resume Forge AI, mastering DSA and system architecture."
                onChange={(val) => updateProfileField('tagline', val)}
              />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3.5"
            >
              <InlineLink
                href={profile?.about_details?.cta_explore_url ?? '#projects'}
                onHrefChange={(val) => updateAboutDetail('cta_explore_url', val)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/30 hover:shadow-red-600/40 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <InlineText
                  as="span"
                  value={profile?.about_details?.cta_explore_text ?? 'Explore Projects'}
                  placeholder="Explore Projects"
                  onChange={(val) => updateAboutDetail('cta_explore_text', val)}
                />
                <ArrowRight className="w-4 h-4" />
              </InlineLink>

              {profile?.resume_url && (
                <InlineLink
                  href={profile.resume_url}
                  onHrefChange={(val) => updateProfileField('resume_url', val)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm text-white bg-slate-900/80 hover:bg-slate-800 border border-white/15 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-red-400" />
                  <InlineText
                    as="span"
                    value={profile?.about_details?.cta_resume_text ?? 'Download Resume (PDF)'}
                    placeholder="Download Resume (PDF)"
                    onChange={(val) => updateAboutDetail('cta_resume_text', val)}
                  />
                </InlineLink>
              )}

              <button
                onClick={onOpenChat}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm text-white bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-red-400" />
                <InlineText
                  as="span"
                  value={profile?.about_details?.cta_ai_text ?? 'Chat with AI Twin'}
                  placeholder="Chat with AI Twin"
                  onChange={(val) => updateAboutDetail('cta_ai_text', val)}
                />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 w-full grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="cosmic-card cosmic-card-hover rounded-2xl p-4"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-1.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-extrabold text-white tracking-tight">
                      <InlineText
                        value={s.value}
                        placeholder={s.value}
                        onChange={(val) => updateAboutDetail(`${s.key}_val`, val)}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      <InlineText
                        value={s.label}
                        placeholder={s.label}
                        onChange={(val) => updateAboutDetail(`${s.key}_lbl`, val)}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Hero Portrait Image */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[420px] aspect-[4/5]"
            >
              {/* Outer decorative ambient glows */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/25 via-rose-600/20 to-red-700/25 rounded-3xl blur-2xl pointer-events-none" />

              {/* High-Performance Smooth Portrait Card (Zero-lag pure CSS hover) */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#12070b]/80 p-2.5 border-2 border-white/15 shadow-2xl hover:shadow-red-500/25 hover:border-red-400/40 transition-all duration-300 group">
                {/* Big High-Res Portrait Image */}
                <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-950">
                  <InlineImageOverlay
                    currentSrc={heroImage}
                    aspect="4:5"
                    title="Hero 3D Portrait"
                    onImageChanged={(newUrl) => {
                      updateProfileField('hero_image_url', newUrl);
                      updateProfileField('avatar_url', newUrl);
                    }}
                  />
                  <img
                    src={heroImage}
                    alt={profile?.name || 'Vikash Kumar'}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Floating Badge: Name */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-3.5 py-1.5 rounded-full bg-[#0e0408]/90 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <InlineText
                        value={profile?.name}
                        placeholder="Vikash Kumar"
                        onChange={(val) => updateProfileField('name', val)}
                      />
                    </div>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                    <div className="p-3.5 rounded-2xl bg-[#0e0408]/90 backdrop-blur-xl border border-white/15 shadow-xl flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-red-400 uppercase tracking-wider block font-bold">
                          <InlineText
                            value={profile?.about_details?.hero_portrait_tag ?? 'B.TECH CSE • IKGPTU'}
                            placeholder="B.TECH CSE • IKGPTU"
                            onChange={(val) => updateAboutDetail('hero_portrait_tag', val)}
                          />
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          <InlineText
                            value={profile?.title ?? 'Full-Stack Developer & AI Explorer'}
                            placeholder="Full-Stack Developer & AI Explorer"
                            onChange={(val) => updateProfileField('title', val)}
                          />
                        </h3>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenChat();
                        }}
                        className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-400/40 hover:border-red-300 text-red-300 hover:text-white shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Chat with AI Twin"
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
