import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Brain,
  Shield,
  Layers,
  Cpu,
  Heart,
  Code2,
  Server,
  Terminal,
  Database,
  Globe,
  Flag,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  ImageIcon,
  Plus,
} from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineImageOverlay from '../editor/InlineImageOverlay';

export default function LeadershipEducationSection({ profile }) {
  const { isEditMode, isPreviewMode, updateCampItem, deleteCampItem, addCampItem, openImageCropper, updateAboutDetail } = useVisualEditor();
  const editable = isEditMode && !isPreviewMode;

  const campImageUrl = profile?.camp_image_url !== undefined && profile?.camp_image_url !== null
    ? profile.camp_image_url
    : '/assets/nic-camp.jpg';
  const campTitle = profile?.camp_title || 'National Integration Camp (NIC)';
  const campCaption = profile?.camp_caption || 'Vikash Kumar with Fellow Delegates at National Integration Camp (NIC) • Representing Youth Leadership, Unity in Diversity & Cross-State Collaboration';

  const defaultGallery = [
    {
      id: 'camp_1',
      image_url: campImageUrl,
      title: campTitle,
      tag: 'NIC Delegate',
      badge: 'Youth Leadership & National Integration Delegate',
      date: '2024',
      caption: campCaption,
    },
  ];

  const filteredGallery = Array.isArray(profile?.camp_gallery) && profile.camp_gallery.length > 0
    ? profile.camp_gallery.filter((item) => item && item.image_url)
    : [];
  const gallery = filteredGallery.length > 0 ? filteredGallery : defaultGallery;

  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentItem = gallery[activeIdx] || gallery[0] || defaultGallery[0];

  const handleNext = (e) => {
    e?.stopPropagation?.();
    setActiveIdx((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // Keyboard navigation & scroll-lock when image is in full-screen / big mode
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev + 1) % gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isLightboxOpen, gallery.length]);

  const learningTopics = [
    { name: 'Data Structures & Algorithms', desc: 'Trees, Graphs, DP, Recursion in C++', icon: Brain, color: 'text-blue-600 bg-blue-50' },
    { name: 'OOP with C++', desc: 'Inheritance, Polymorphism, Memory & Templates', icon: Code2, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'Database Management Systems', desc: 'Relational Design, Indexing, Transactions, SQL', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Software Engineering & System Design', desc: 'Scalable Microservices, High-Throughput APIs', icon: Cpu, color: 'text-violet-600 bg-violet-50' },
    { name: 'Full-Stack Development', desc: 'React 19, Next.js, Node.js, Express, Laravel', icon: Layers, color: 'text-cyan-600 bg-cyan-50' },
    { name: 'AI / Machine Learning', desc: 'Gemini LLM APIs, Computer Vision, Prompt Chains', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
    { name: 'Cybersecurity & Diagnostics', desc: 'Network Port Scanning, Packet Analysis, RBAC', icon: Shield, color: 'text-rose-600 bg-rose-50' },
    { name: 'Cloud & Modern Deployment', desc: 'Vercel, Firebase Cloud Firestore, Linux & Nginx', icon: Globe, color: 'text-blue-600 bg-blue-50' },
  ];

  const educationHistory = [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'I.K. Gujral Punjab Technical University (IKGPTU)',
      period: '2024 - 2028 (2nd Year / 4th Sem)',
      location: 'Main Campus, Kapurthala, Punjab',
      badge: 'Active Degree',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Focusing on Software Development, Full-Stack Architecture, and System Design.',
    },
    {
      degree: 'Senior Secondary Schooling (12th Standard - PCM)',
      institution: 'Delhi Public School (DPS)',
      period: 'Completed 2024',
      location: 'India',
      badge: 'PCM Stream',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Core subjects: Physics, Chemistry, and Mathematics.',
    },
    {
      degree: 'Secondary School Examination (10th Standard)',
      institution: 'Aryan Residential Public School',
      period: 'Completed 2022',
      location: 'India',
      badge: 'Secondary',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Solid foundations in Science, Mathematics, and Computer Basics.',
    },
  ];

  return (
    <section id="education-leadership" className="py-28 relative overflow-hidden bg-transparent">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/30">
            <GraduationCap className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.edu_badge ?? 'Academic Foundations & Campus Software Engineering'}
              placeholder="Academic Foundations & Campus Software Engineering"
              onChange={(val) => updateAboutDetail('edu_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.edu_title_1 ?? 'Education, Tech Innovations &'}
              placeholder="Education, Tech Innovations &"
              onChange={(val) => updateAboutDetail('edu_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.edu_title_gradient ?? 'Campus Experience'}
                placeholder="Campus Experience"
                onChange={(val) => updateAboutDetail('edu_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.edu_subtitle ?? 'Bridging rigorous computer science theory at IKGPTU Main Campus with practical full-stack software development, C++ algorithms, and collaborative campus initiatives.'}
              placeholder="Bridging rigorous computer science theory at IKGPTU Main Campus with practical full-stack software development, C++ algorithms, and collaborative campus initiatives."
              onChange={(val) => updateAboutDetail('edu_subtitle', val)}
            />
          </p>
        </div>

        {/* Education & Campus Software Collaboration Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          {/* Left Column: Complete Academic Journey */}
          <div className="lg:col-span-6 flex flex-col justify-between cosmic-card rounded-3xl p-8 hover:border-red-500/30 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-xs">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold font-mono">
                  ACADEMIC CREDENTIALS
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-6">
                Educational Qualifications
              </h3>

              {/* Education Stack Cards */}
              <div className="space-y-4 mb-8">
                {educationHistory.map((edu, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      idx === 0
                        ? 'bg-red-500/10 border-red-500/30 shadow-xs'
                        : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${edu.badgeColor}`}>
                        {edu.badge}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {edu.period}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-white mb-1">
                      <InlineText
                        value={profile?.about_details?.[`edu_${idx}_degree`] ?? edu.degree}
                        placeholder={edu.degree}
                        onChange={(val) => updateAboutDetail(`edu_${idx}_degree`, val)}
                      />
                    </h4>

                    <p className="text-xs font-bold text-red-400 mb-2">
                      <InlineText
                        value={profile?.about_details?.[`edu_${idx}_institution`] ?? edu.institution}
                        placeholder={edu.institution}
                        onChange={(val) => updateAboutDetail(`edu_${idx}_institution`, val)}
                      />
                    </p>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      <InlineText
                        as="p"
                        value={profile?.about_details?.[`edu_${idx}_description`] ?? edu.description}
                        placeholder={edu.description}
                        onChange={(val) => updateAboutDetail(`edu_${idx}_description`, val)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Coursework Badges */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <InlineText
                    value={profile?.about_details?.coursework_heading ?? 'Core Computer Science Coursework'}
                    placeholder="Core Computer Science Coursework"
                    onChange={(val) => updateAboutDetail('coursework_heading', val)}
                  />
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Data Structures & Algorithms',
                    'Object-Oriented Programming (C++)',
                    'Database Management Systems',
                    'Computer Organization',
                    'Discrete Mathematics',
                    'Software Engineering',
                    'Operating Systems'
                  ].map((course, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10"
                    >
                      <InlineText
                        value={profile?.about_details?.[`course_${idx}`] ?? course}
                        placeholder={course}
                        onChange={(val) => updateAboutDetail(`course_${idx}`, val)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">From Bihar &bull; Studying in Punjab</span>
              <span className="text-cyan-400 font-bold">IKGPTU Main Campus</span>
            </div>
          </div>

          {/* Right Column: Multi-Camp & Youth Leadership Delegation with AUTO-ADAPTING IMAGE SLIDER */}
          <div className="lg:col-span-6 cosmic-card rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xs">
                    <Flag className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white transition-colors">
                      <InlineText
                        value={currentItem.title || campTitle}
                        placeholder="National Integration Camp (NIC)"
                        onChange={(val) => updateCampItem(activeIdx, { ...currentItem, title: val })}
                      />
                    </h3>
                    <span className="text-xs font-bold text-amber-400 block mt-0.5">
                      <InlineText
                        value={currentItem.badge || 'Youth Leadership & National Integration Delegate'}
                        placeholder="Youth Leadership & National Integration Delegate"
                        onChange={(val) => updateCampItem(activeIdx, { ...currentItem, badge: val })}
                      />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                    <InlineText
                      value={currentItem.tag || 'NIC Delegate'}
                      placeholder="NIC Delegate"
                      onChange={(val) => updateCampItem(activeIdx, { ...currentItem, tag: val })}
                    />
                  </span>
                  {gallery.length > 1 && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-bold shadow-xs">
                      {activeIdx + 1}/{gallery.length}
                    </span>
                  )}
                  {editable && (
                    <button
                      type="button"
                      onClick={() => {
                        const newCamp = {
                          id: 'camp_' + Date.now(),
                          image_url: '/assets/nic-camp.jpg',
                          title: 'National Integration Camp (NIC)',
                          tag: 'NIC Delegate',
                          badge: 'Youth Leadership & Teamwork',
                          date: new Date().getFullYear().toString(),
                          caption: 'Vikash Kumar with Fellow Delegates at Camp',
                        };
                        if (addCampItem) addCampItem(newCamp);
                        setActiveIdx(gallery.length);
                      }}
                      className="px-2.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono shadow-sm flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                      title="Add another Camp Photo to the gallery"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AUTO-ADAPTING IMAGE BOX with SLIDER NAVIGATION & INLINE OVERLAY */}
              {currentItem?.image_url && (
                <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-lg bg-black/40 group">
                  <InlineImageOverlay
                    currentSrc={currentItem.image_url}
                    aspect="16:9"
                    title={`Cut & Scale: ${currentItem.title || 'Camp Photo'}`}
                    onImageChanged={(newUrl) =>
                      updateCampItem(activeIdx, { ...currentItem, image_url: newUrl })
                    }
                    onImageDeleted={() => {
                      if (gallery.length > 1) {
                        deleteCampItem(activeIdx);
                        setActiveIdx(Math.max(0, activeIdx - 1));
                      } else {
                        updateCampItem(0, { ...currentItem, image_url: '' });
                      }
                    }}
                  />

                  <img
                    key={currentItem.id || activeIdx}
                    src={currentItem.image_url}
                    alt={currentItem.title || campTitle}
                    onClick={() => {
                      if (!editable) setIsLightboxOpen(true);
                    }}
                    className={`w-full h-auto max-h-[520px] object-contain mx-auto block group-hover:scale-[1.01] transition-transform duration-300 ${!editable ? 'cursor-zoom-in' : ''}`}
                    loading="lazy"
                    title={!editable ? "Click to enlarge photo (Bada karein)" : ""}
                  />

                  {/* Top Floating Controls */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {gallery.length > 1 ? (
                      <span className="text-[11px] font-bold font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md pointer-events-auto">
                        📸 Photo {activeIdx + 1} of {gallery.length}
                      </span>
                    ) : <span />}

                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 shadow-md transition-all pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-1.5"
                      title="Enlarge Photo (Bada karein)"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px] font-mono font-bold">Enlarge</span>
                    </button>
                  </div>

                  {/* Side Navigation Arrows (if multiple photos) */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110"
                        title="Previous photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110"
                        title="Next photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Caption & Title Gradient Overlay with InlineText */}
                  <div className="bg-gradient-to-t from-slate-900/90 via-slate-900/70 to-slate-900/40 p-3.5 text-white text-center">
                    <div className="text-xs font-semibold flex items-center justify-center gap-1.5 flex-wrap">
                      <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <InlineText
                        value={currentItem.title || campTitle}
                        placeholder="Camp Title"
                        onChange={(val) => updateCampItem(activeIdx, { ...currentItem, title: val })}
                      />
                      <span className="text-amber-300 font-mono text-[10px] ml-1">
                        (
                        <InlineText
                          value={currentItem.date || '2024'}
                          placeholder="2024"
                          onChange={(val) =>
                            updateCampItem(activeIdx, { ...currentItem, date: val })
                          }
                        />
                        )
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      <InlineText
                        as="p"
                        value={currentItem.caption}
                        placeholder="Click to edit photo caption..."
                        onChange={(val) =>
                          updateCampItem(activeIdx, { ...currentItem, caption: val })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Photo Carousel Indicators & Lightbox Trigger */}
              {gallery.length > 1 && (
                <div className="mb-5 space-y-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {gallery.map((gItem, idx) => {
                      const isActive = idx === activeIdx;
                      return (
                        <button
                          key={gItem.id || idx}
                          type="button"
                          onClick={() => setActiveIdx(idx)}
                          className={`relative shrink-0 w-16 h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                            isActive
                              ? 'border-amber-500 ring-2 ring-amber-500/40 scale-105 shadow-md'
                              : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                          }`}
                        >
                          <img
                            src={gItem.image_url}
                            alt={gItem.title || `Camp ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-amber-500/15" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>View All {gallery.length} Camp Photos in Full Screen (Lightbox Gallery)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FULL-SCREEN LIGHTBOX GALLERY MODAL */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Top Bar: Title, Make Small / Minimize Button & Close Button */}
              <div
                className="flex items-center justify-between text-white max-w-6xl mx-auto w-full gap-3 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <Flag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {currentItem.title || campTitle}
                    </h4>
                    <span className="text-[11px] sm:text-xs text-amber-400 font-mono block">
                      {currentItem.tag || 'NIC Delegate'} &bull; Photo {activeIdx + 1} of {gallery.length}
                    </span>
                  </div>
                </div>

                {/* Make Small / Minimize Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
                    title="Make Small / Minimize (Chhota Karein)"
                  >
                    <Minimize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Make Small / Minimize</span>
                    <span className="sm:hidden">Small</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hover:scale-105 active:scale-95 border border-white/15"
                    title="Close (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Photo Display: clicking backdrop or photo makes it small */}
              <div className="relative max-w-6xl mx-auto w-full flex-1 flex items-center justify-center my-3 overflow-hidden">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                  <span className="text-[10px] sm:text-xs font-mono px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-lg flex items-center gap-1.5">
                    <Minimize2 className="w-3 h-3 text-amber-400" />
                    Click photo, background, or press Esc to make small
                  </span>
                </div>

                <img
                  key={currentItem.id || activeIdx}
                  src={currentItem.image_url}
                  alt={currentItem.title || campTitle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(false);
                  }}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/15 cursor-zoom-out hover:opacity-95 transition-all"
                  title="Click photo to make small / close (Chhota karein)"
                />

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev(e);
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-xl z-20"
                      title="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext(e);
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-xl z-20"
                      title="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Bottom Caption & Thumbnail Strip */}
              <div
                className="max-w-4xl mx-auto w-full text-center space-y-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                {currentItem.caption && (
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    {currentItem.caption}
                  </p>
                )}

                {gallery.length > 1 && (
                  <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                    {gallery.map((thumb, idx) => (
                      <button
                        key={thumb.id || idx}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={`w-14 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          idx === activeIdx
                            ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                            : 'border-white/20 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={thumb.image_url}
                          alt={thumb.title || `Thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Make Small / Minimize Bottom Action */}
                <div className="pt-1 flex items-center justify-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 transition-all cursor-pointer hover:scale-105"
                  >
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Click to Make Small (Chhota Karein)</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Areas Currently Learning & Mastering */}
        <div className="cosmic-card rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Active Knowledge Expansion
              </div>
              <h3 className="text-2xl font-black text-white">
                What I'm Currently Learning &amp; Mastering
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 self-start sm:self-auto">
              Daily Practice &amp; DSA Problem Solving
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningTopics.map((topic, idx) => {
              const IconComp = topic.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-red-500/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                    {topic.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
