import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Medal, Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import ep from "../assets/engeener.jpg";
import np from "../assets/IMG-20260213-WA0028.jpg";
import cp from "../assets/Screenshot 2026-03-14 at 2.24.57 PM.png";
import nssp from "../assets/Screenshot 2026-03-14 at 2.25.20 PM.png";

 <section id="projects">
  {/* your gallery / projects code */}
</section>
const achievements = [
  {
    title: "Engineer's Day Winner",
    cat: "Award",
    detail: "Won 2 Medals for innovative project creation at university level competition.",
   img: ep,
    icon: <Trophy size={18} />,
    dotColor: "#EF9F27",
    accent: "#EF9F27",
    tag: "🏆 Gold Medal",
  },
  {
    title: "Hacking Competition",
    cat: "Cybersecurity",
    detail: "Participated in university-level cybersecurity challenge and ethical hacking CTF.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
    icon: <Medal size={18} />,
    dotColor: "#378ADD",
    accent: "#00d4ff",
    tag: "🔐 Security",
  },
  {
    title: "NSS Volunteering",
    cat: "Community",
    detail: "Active involvement in flood relief, tree plantation and community service drives.",
    img: nssp,
    icon: <Star size={18} />,
    dotColor: "#E24B4A",
    accent: "#E24B4A",
    tag: "⭐ Service",
  },
  {
    title: "NIC Camp",
    cat: "Innovation",
    detail: "Selected for National Innovation Camp to develop sustainable tech solutions for social impact.",
    img: np,
    icon: <Award size={18} />,
    dotColor: "#639922",
    accent: "#97C459",
    tag: "♻️ Innovation",
  },
  {
    title: "College event",
    cat: "Industry",
    detail: "coordinate in college-organized industry exposure event.",
    img: cp,
    icon: <Medal size={18} />,
    dotColor: "#7F77DD",
    accent: "#AFA9EC",
    tag: "💼 Training",
  },
];
 
/* ─── Corner bracket ─── */
const Corner = ({ pos }) => {
  const map = {
    tl: 'top-2 left-2 border-t-2 border-l-2',
    tr: 'top-2 right-2 border-t-2 border-r-2',
    bl: 'bottom-2 left-2 border-b-2 border-l-2',
    br: 'bottom-2 right-2 border-b-2 border-r-2',
  };
  const delays = { tl: '0s', tr: '.5s', bl: '1s', br: '1.5s' };
  return (
    <div
      className={`absolute w-3.5 h-3.5 border-cyan-400 pointer-events-none ${map[pos]}`}
      style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: delays[pos] }}
    />
  );
};
 
const MagicGallery = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);
  const total = achievements.length;
 
  const go = (dir) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + total) % total);
  };
 
  /* Auto-rotate every 3s */
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => go(1), 3200);
    return () => clearInterval(intervalRef.current);
  }, [paused, current]);
 
  /* Prev/Next visible cards */
  const getIdx = (offset) => (current + offset + total) % total;
 
  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 120 : -120, scale: 0.88, rotateY: d > 0 ? 18 : -18 }),
    center: { opacity: 1, x: 0, scale: 1, rotateY: 0, zIndex: 10 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -120 : 120, scale: 0.88, rotateY: d > 0 ? -18 : 18, zIndex: 0 }),
  };
 
  return (
    <>
      <style>{`
        @keyframes scanline     { 0%{top:-5%} 100%{top:110%} }
        @keyframes cornerPulse  { 0%,100%{opacity:.25} 50%{opacity:1} }
        @keyframes ringR        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ringRr       { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes particleUp   { 0%{opacity:0;transform:translateY(0) scale(0)} 40%{opacity:.6} 100%{opacity:0;transform:translateY(-50px) scale(1.5)} }
        @keyframes bgBlob       { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes titleGlow    { 0%,100%{text-shadow:0 0 30px rgba(53,87,125,0.4)} 50%{text-shadow:0 0 70px rgba(53,87,125,0.8),0 0 120px rgba(0,212,255,0.3)} }
        @keyframes dotBlink     { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes progressBar  { from{width:0%} to{width:100%} }
        @keyframes floatCard    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes glowPulse    { 0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.1)} 50%{box-shadow:0 0 50px rgba(0,212,255,0.28)} }
      `}</style>
 
      <section id="gallery" className="py-24 bg-[#141E30] text-white overflow-hidden relative">
 
        {/* BG grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
 
        {/* Glow blobs */}
        <div className="absolute top-[-80px] left-[10%] w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(53,87,125,0.2) 0%,transparent 70%)', animation: 'bgBlob 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-60px] right-[10%] w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', animation: 'bgBlob 11s ease-in-out infinite reverse' }} />
 
        {/* Orbit rings */}
        {[
          { size: 560, dur: '38s', dir: 'ringR',  style: 'solid',  color: 'rgba(0,212,255,0.06)'  },
          { size: 720, dur: '55s', dir: 'ringRr', style: 'dashed', color: 'rgba(53,87,125,0.1)'   },
        ].map((r, i) => (
          <div key={i} className="absolute top-1/2 left-1/2 rounded-full pointer-events-none" style={{
            width: r.size, height: r.size,
            marginLeft: -r.size / 2, marginTop: -r.size / 2,
            border: `1px ${r.style} ${r.color}`,
            animation: `${r.dir} ${r.dur} linear infinite`,
          }} />
        ))}
 
        {/* Particles */}
        {[
          { w:3, t:'12%', l:'6%',  d:5,   dl:0   },
          { w:4, t:'72%', l:'90%', d:4,   dl:2   },
          { w:3, t:'44%', l:'94%', d:6,   dl:1   },
          { w:5, t:'82%', l:'4%',  d:4.5, dl:2.5 },
        ].map((p,i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:p.w, height:p.w, top:p.t, left:p.l, background:'rgba(0,212,255,0.6)', animation:`particleUp ${p.d}s ease-in-out infinite`, animationDelay:`${p.dl}s` }} />
        ))}
 
        {/* Full corner brackets */}
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
 
        <div className="max-w-6xl mx-auto px-6 relative z-10">
 
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase"
              style={{ animation: 'titleGlow 4s ease-in-out infinite' }}>
              Magic <span className="text-[#35577D]">Moments</span>
            </h2>
            <p className="mt-3 text-[10px] tracking-[4px] uppercase" style={{ color: 'rgba(0,212,255,0.5)' }}>
              
            </p>
          </motion.div>
 
          { /* ── 3D Rotating Carousel ── */ }
          <div
            className="relative flex items-center justify-center"
            style={{ minHeight: 520, perspective: 1200 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
 
            {/* Side preview cards */}
            {[-1, 1].map((offset) => {
              const idx = getIdx(offset);
              const item = achievements[idx];
              return (
                <div key={idx} className="absolute hidden md:block"
                  style={{
                    width: 210, height: 290,
                    [offset === -1 ? 'left' : 'right']: '2%',
                    borderRadius: 24,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transform: `scale(0.82) rotateY(${offset === -1 ? 18 : -18}deg)`,
                    opacity: 0.45,
                    transition: 'all .5s ease',
                    zIndex: 1,
                    cursor: 'pointer',
                    filter: 'grayscale(40%)',
                  }}
                  onClick={() => go(offset)}
                >
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(10,16,30,0.9),transparent 60%)' }} />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs font-black italic text-white">{item.title}</p>
                  </div>
                </div>
              );
            })}
 
            {/* Main active card */}
            <div className="relative" style={{ width: '100%', maxWidth: 560, zIndex: 10 }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.25, 0.8, 0.25, 1] }}
                  className="relative rounded-[2.5rem] overflow-hidden"
                  style={{
                    height: 480,
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: `0 0 0 1px rgba(0,212,255,0.2), 0 30px 80px rgba(0,0,0,0.6)`,
                    animation: 'floatCard 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
                  }}
                >
                  {/* Image */}
                  <img
                    src={achievements[current].img}
                    alt={achievements[current].title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ filter: 'contrast(1.05) saturate(0.9)' }}
                  />
 
                  {/* Gradient overlay */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top,rgba(8,14,26,0.97) 0%,rgba(8,14,26,0.45) 45%,transparent 100%)'
                  }} />
 
                  {/* Cyan tint */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.04) 0%,transparent 60%)' }} />
 
                  {/* Scan line */}
                  <div className="absolute left-0 w-full h-[1.5px] pointer-events-none"
                    style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)', animation: 'scanline 3s linear infinite' }} />
 
                  {/* Corner brackets */}
                  <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
 
                  {/* Status dot */}
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
                    style={{
                      background: achievements[current].dotColor,
                      boxShadow: `0 0 10px ${achievements[current].dotColor}`,
                      animation: 'dotBlink 1.5s ease-in-out infinite',
                    }} />
 
                  {/* Tag pill */}
                  <div className="absolute top-4 left-4 text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full border"
                    style={{
                      background: 'rgba(20,30,48,0.85)',
                      borderColor: 'rgba(0,212,255,0.22)',
                      backdropFilter: 'blur(8px)',
                      color: '#c8dce8',
                    }}>
                    {achievements[current].tag}
                  </div>
 
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.08)', color: achievements[current].accent }}>
                        {achievements[current].icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[3px]"
                        style={{ color: achievements[current].accent }}>
                        {achievements[current].cat}
                      </span>
                    </div>
 
                    <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-3 text-white">
                      {achievements[current].title}
                    </h3>
 
                    <p className="text-sm leading-relaxed mb-5 max-w-sm" style={{ color: 'rgba(160,196,216,0.8)' }}>
                      {achievements[current].detail}
                    </p>
 
                    {/* Animated accent line */}
                    <div className="h-[1px] rounded-full" style={{ background: achievements[current].accent, animation: 'progressBar .6s ease-out forwards', width: '40%' }} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
 
          {/* ── Controls row ── */}
          <div className="mt-10 flex items-center justify-between gap-6">
 
            {/* Prev / Next */}
            <div className="flex gap-3">
              <button
                onClick={() => go(-1)}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all hover:border-cyan-400/50"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', color: '#a0c4d8' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => go(1)}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all hover:border-cyan-400/50"
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', color: '#a0c4d8' }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
 
            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {achievements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? 28 : 7,
                    height: 7,
                    background: i === current ? achievements[current].accent : 'rgba(53,87,125,0.4)',
                    boxShadow: i === current ? `0 0 8px ${achievements[current].accent}` : 'none',
                  }}
                />
              ))}
            </div>
 
            {/* Progress bar */}
            <div className="hidden md:flex items-center gap-3 text-[10px] tracking-widest uppercase" style={{ color: 'rgba(160,196,216,0.4)' }}>
              <span style={{ color: 'rgba(0,212,255,0.7)' }}>{String(current + 1).padStart(2, '0')}</span>
              <div className="w-24 h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((current + 1) / total) * 100}%`,
                    background: `linear-gradient(90deg,#35577D,${achievements[current].accent})`,
                  }} />
              </div>
              <span>{String(total).padStart(2, '0')}</span>
            </div>
          </div>
 
          {/* ── Bottom CTA ── */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t pt-10 gap-6"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-sm italic font-light max-w-md text-center md:text-left"
              style={{ color: 'rgba(160,196,216,0.4)', lineHeight: 1.7 }}>
              "Achievements are just milestones — the real magic happens when we collaborate on something bigger."
            </p>
           
          </div>
        </div>
      </section>
    </>
  );
};
 
export default MagicGallery;
 