import myPic from '../assets/vikash-portrait.jpg';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, Facebook, Twitter, Instagram, Globe, Shield, Code, Lock, Zap, Linkedin } from 'lucide-react';
 
// Orbit items: icon + color + animation duration
const ORBIT_ITEMS = [
  { icon: <Shield size={18} />, color: '#35577D', dur: 8,  angle: 0,   radius: 155 },
  { icon: <Lock size={18} />,   color: '#00d4ff33', dur: 11, angle: 120, radius: 175 },
  { icon: <Zap size={18} />,    color: '#ff642022', dur: 9,  angle: 240, radius: 140 },
  { icon: <Code size={18} />,   color: '#35577D99', dur: 13, angle: 60,  radius: 195 },
  { icon: <Globe size={18} />,  color: '#00d4ff22', dur: 10, angle: 300, radius: 165 },
];
 
const ScanLine = () => (
  <div className="absolute left-0 w-full h-[2px] pointer-events-none"
    style={{
      background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)',
      animation: 'scanline 3s linear infinite',
    }}
  />
);
 
const CornerBracket = ({ pos }) => {
  const styles = {
    tl: 'top-2 left-2 border-t-2 border-l-2',
    tr: 'top-2 right-2 border-t-2 border-r-2',
    bl: 'bottom-2 left-2 border-b-2 border-l-2',
    br: 'bottom-2 right-2 border-b-2 border-r-2',
  };
  return (
    <div
      className={`absolute w-4 h-4 border-cyan-400 ${styles[pos]}`}
      style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: `${['tl','tr','bl','br'].indexOf(pos) * 0.5}s` }}
    />
  );
};
 
const Hero = () => {
  return (
    <>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(var(--start-angle)) translateX(var(--radius)) rotate(calc(-1 * var(--start-angle))); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * (var(--start-angle) + 360deg))); }
        }
        @keyframes floatY { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes scanline { 0%{top:-5%} 100%{top:110%} }
        @keyframes cornerPulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes ringRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ringRotateRev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes shimmerCard { 0%,100%{opacity:.8} 50%{opacity:1} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.15)} 50%{box-shadow:0 0 60px rgba(0,212,255,0.35)} }
        .orbit-item {
          position: absolute;
          top: 50%; left: 50%;
          margin: -20px 0 0 -20px;
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          animation: orbitSpin var(--dur) linear infinite;
        }
        .ring-orbit {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(0,212,255,0.15);
          pointer-events: none;
        }
      `}</style>
 
      <section className="relative min-h-screen bg-[#141E30] text-white overflow-hidden flex items-center justify-center pt-20">
 
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
 
        {/* Background glow blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(53,87,125,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 left-20 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />
 
        {/* Top-right decorative spinner (original) */}
        <div className="absolute top-20 right-[20%] z-0">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity }}
            className="relative w-24 h-24 border-2 border-cyan-400 rounded-full"
          >
            <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-orange-500 rounded-full" />
          </motion.div>
          <div className="absolute top-16 -right-12 w-6 h-6 bg-cyan-400 rounded-full" />
        </div>
 
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-12 items-center gap-8 relative z-10">
 
          {/* LEFT */}
          <div className="md:col-span-4 space-y-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-8xl font-serif font-light leading-tight">
                Hi, <br />I'm <span className="text-[#35577D] font-bold">Vikash</span>
              </h1>
              <p className="text-xl md:text-2xl mt-4 text-gray-400 font-light tracking-wide">
                Python Developer & <br /> IOS Deployment Learner
              </p>
            </motion.div>
<a href="#contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="group flex items-center gap-4 bg-[#35577D] px-8 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-red-500/20"
            >
              Get In Touch
              <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-2 transition-transform">
                <ArrowRight size={18} />
              </div>
            </motion.button>
            </a>
 
            <div className="hidden md:flex flex-col gap-6 pt-12 text-gray-500">

  

  <a href="https://www.linkedin.com/in/vikash-kumar-ab436131a/" target="_blank" rel="noopener noreferrer">
    <Linkedin size={18} className="hover:text-white cursor-pointer" />
  </a>

  <a href="https://www.instagram.com/mrvikash7493/profilecard/?igsh=MWdoa2Q2Mmxrbms5dw%3D%3D%20%20%204" target="_blank" rel="noopener noreferrer">
    <Instagram size={18} className="hover:text-white cursor-pointer" />
  </a>

</div>
          </div>
 
          {/* CENTER — 3D Profile */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-[320px] h-[420px]" style={{ perspective: '1000px' }}>
 
              {/* Rotating orbit rings */}
              {[300, 360, 420].map((size, i) => (
                <div key={i} className="ring-orbit" style={{
                  width: size, height: size,
                  marginLeft: -size / 2, marginTop: -size / 2,
                  animation: `${i % 2 === 0 ? 'ringRotate' : 'ringRotateRev'} ${20 + i * 10}s linear infinite`,
                  borderStyle: i === 1 ? 'dashed' : 'solid',
                  borderColor: i === 0 ? 'rgba(0,212,255,0.2)' : i === 1 ? 'rgba(53,87,125,0.3)' : 'rgba(0,212,255,0.08)',
                }} />
              ))}
 
              {/* Orbit items */}
              {ORBIT_ITEMS.map((item, i) => (
                <div key={i} className="orbit-item" style={{
                  background: item.color,
                  '--start-angle': `${item.angle}deg`,
                  '--radius': `${item.radius}px`,
                  '--dur': `${item.dur}s`,
                  color: '#a0c4d8',
                }} title={`Skill ${i + 1}`}>
                  {item.icon}
                </div>
              ))}
 
              {/* Profile image frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ animation: 'floatY 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite' }}
              >
                <div className="relative w-[200px] h-[270px] rounded-2xl overflow-hidden"
                  style={{
                    boxShadow: '0 0 0 1px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.15), 0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src={myPic}
                    alt="Vikash"
                    className="w-full h-full object-cover"
                    style={{ filter: 'contrast(1.05) saturate(0.9)' }}
                  />
                  {/* Cyan tint overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 40%, rgba(20,30,48,0.3) 100%)' }} />
                  {/* Scan line */}
                  <ScanLine />
                  {/* Corner brackets */}
                  <CornerBracket pos="tl" />
                  <CornerBracket pos="tr" />
                  <CornerBracket pos="bl" />
                  <CornerBracket pos="br" />
                </div>
 
                {/* GitHub badge */}
                <a href="https://github.com/Vikash222" target="_blank" rel="noopener noreferrer">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#141E30]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest whitespace-nowrap">
                  <Globe size={10} className="text-pink-500" /> www.github.com/vikash
                </div>
                </a>
              </motion.div>
 
              {/* Floating info cards */}
              <div className="absolute bottom-6 -left-8 text-[11px] rounded-xl px-3 py-2 border"
                style={{ background: 'rgba(20,30,48,0.9)', borderColor: 'rgba(0,212,255,0.25)', backdropFilter: 'blur(10px)', animation: 'shimmerCard 3s ease-in-out infinite' }}>
                <div style={{ color: 'rgba(0,212,255,0.6)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>Specialty</div>
                <div style={{ color: '#c8dce8', fontWeight: 500 }}>🔒 IOS</div>
              </div>
 
              <div className="absolute top-10 -right-6 text-[11px] rounded-xl px-3 py-2 border"
                style={{ background: 'rgba(20,30,48,0.9)', borderColor: 'rgba(53,87,125,0.5)', backdropFilter: 'blur(10px)', animation: 'shimmerCard 3s ease-in-out infinite 1s' }}>
                <div style={{ color: 'rgba(0,212,255,0.6)', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>Stack</div>
                <div style={{ color: '#c8dce8', fontWeight: 500 }}>⚙️ Python Dev</div>
              </div>
            </div>
          </div>
 
          {/* RIGHT */}
          <div className="md:col-span-4 space-y-8 md:pl-12">
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
              <div className="space-y-1">
                <span className="text-[#35577D] text-xs font-bold uppercase tracking-widest">Expert on</span>
                <h3 className="text-2xl font-bold leading-snug">
                  Based in jalandhar, India
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
               Actively looking for a Development Internship.
Python Developer | Exploring iOS Development
              </p>
             <a
  href="https://drive.google.com/file/d/1subtxcmGnS5KsposfPJG9ymG9SX-AZvR/view?usp=sharing"
  target="_blank"
  className="flex items-center gap-2 text-[#35577D] font-bold text-sm border-b-2 border-[#35577D] pb-1 hover:text-white hover:border-white transition-all"
> <button>
  Download CV
  </button>
  
</a>
            </motion.div>
 
            
          </div>
        </div>
      </section>
    </>
  );
};
 
export default Hero;
 