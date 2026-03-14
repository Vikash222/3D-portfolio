import myaboutpic from '../assets/vikash-about.jpeg';
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Lock, Zap, Globe } from 'lucide-react';
 
const ORBIT_ITEMS = [
  { icon: <Shield size={16} />, bg: 'rgba(53,87,125,0.85)',  angle: 0,   radius: 140, dur: 8  },
  { icon: <Code  size={16} />, bg: 'rgba(0,212,255,0.22)',   angle: 72,  radius: 160, dur: 11 },
  { icon: <Lock  size={16} />, bg: 'rgba(255,100,50,0.22)',  angle: 144, radius: 125, dur: 9  },
  { icon: <Zap   size={16} />, bg: 'rgba(53,87,125,0.6)',    angle: 216, radius: 155, dur: 13 },
  { icon: <Globe size={16} />, bg: 'rgba(0,212,255,0.18)',   angle: 288, radius: 138, dur: 10 },
];
 
const CornerBracket = ({ pos }) => {
  const map = {
    tl: 'top-2 left-2 border-t-2 border-l-2',
    tr: 'top-2 right-2 border-t-2 border-r-2',
    bl: 'bottom-2 left-2 border-b-2 border-l-2',
    br: 'bottom-2 right-2 border-b-2 border-r-2',
  };
  const delays = { tl: '0s', tr: '.5s', bl: '1s', br: '1.5s' };
  return (
    <div
      className={`absolute w-4 h-4 border-cyan-400 ${map[pos]}`}
      style={{ animation: 'cornerPulse 2s ease-in-out infinite', animationDelay: delays[pos] }}
    />
  );
};
 
const FloatCard = ({ style, label, value, sub, delay = 0 }) => (
  <div
    className="absolute rounded-2xl border text-left"
    style={{
      ...style,
      background: 'rgba(18,28,44,0.92)',
      borderColor: 'rgba(0,212,255,0.22)',
      backdropFilter: 'blur(10px)',
      padding: '10px 14px',
      animation: `shimCard 3s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      whiteSpace: 'nowrap',
      zIndex: 20,
    }}
  >
    <div style={{ fontSize: 9, color: 'rgba(0,212,255,0.65)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#c8dce8', marginTop: 3 }}>{value}</div>
    {sub && <div style={{ fontSize: 9, color: 'rgba(160,196,216,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{sub}</div>}
  </div>
);
 
const Particle = ({ style, dur, delay }) => (
  <div
    className="absolute rounded-full"
    style={{
      ...style,
      background: 'rgba(0,212,255,0.6)',
      animation: `particleFade ${dur}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);
 
const About = () => {
  return (
    <>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(var(--sa)) translateX(var(--r)) rotate(calc(-1 * var(--sa))); }
          to   { transform: rotate(calc(var(--sa) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--sa) + 360deg))); }
        }
        @keyframes floatY    { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes floatYr   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(20px)} }
        @keyframes scanline  { 0%{top:-5%} 100%{top:110%} }
        @keyframes cornerPulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes ringR     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ringRr    { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes shimCard  { 0%,100%{opacity:.85} 50%{opacity:1} }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.18),0 20px 60px rgba(0,0,0,0.5)}
          50%    {box-shadow:0 0 60px rgba(0,212,255,0.38),0 20px 60px rgba(0,0,0,0.5)}
        }
        @keyframes bgBlob  { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.1) translateY(-10px)} }
        @keyframes particleFade { 0%{opacity:0;transform:scale(0)} 50%{opacity:.5} 100%{opacity:0;transform:scale(1.5)} }
        .orbit-item {
          position: absolute; top: 50%; left: 50%;
          margin: -18px 0 0 -18px;
          width: 36px; height: 36px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.12);
          animation: orbitSpin var(--dur) linear infinite;
          color: #a0c4d8;
        }
        .ring-el {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%;
          border: 1px solid rgba(0,212,255,0.18);
          pointer-events: none;
        }
      `}</style>
 
      <section id="about" className="py-24 bg-[#141E30] text-white overflow-hidden">
 
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#00d4ff 1px,transparent 1px),linear-gradient(90deg,#00d4ff 1px,transparent 1px)', backgroundSize: '50px 50px' }}
        />
 
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center relative">
 
          {/* ── LEFT: 3D Image Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            {/* Background glow blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(53,87,125,0.22) 0%,transparent 70%)', animation: 'bgBlob 7s ease-in-out infinite' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', animation: 'bgBlob 9s ease-in-out infinite reverse' }} />
 
            {/* 3D Scene */}
            <div className="relative" style={{ width: 320, height: 420, perspective: 900 }}>
 
              {/* Orbit rings */}
              {[
                { size: 280, dur: '18s', dir: 'ringR',  style: 'solid',  color: 'rgba(0,212,255,0.18)' },
                { size: 340, dur: '26s', dir: 'ringRr', style: 'dashed', color: 'rgba(53,87,125,0.35)' },
                { size: 400, dur: '38s', dir: 'ringR',  style: 'solid',  color: 'rgba(0,212,255,0.07)' },
              ].map((r, i) => (
                <div key={i} className="ring-el" style={{
                  width: r.size, height: r.size,
                  marginLeft: -r.size / 2, marginTop: -r.size / 2,
                  animation: `${r.dir} ${r.dur} linear infinite`,
                  borderStyle: r.style, borderColor: r.color,
                }} />
              ))}
 
              {/* Orbit items */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
                {ORBIT_ITEMS.map((item, i) => (
                  <div key={i} className="orbit-item" style={{
                    background: item.bg,
                    '--sa': `${item.angle}deg`,
                    '--r': `${item.radius}px`,
                    '--dur': `${item.dur}s`,
                  }}>
                    {item.icon}
                  </div>
                ))}
              </div>
 
              {/* Profile image frame */}
              <div
                className="absolute rounded-2xl overflow-hidden"
                style={{
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 200, height: 268,
                  boxShadow: '0 0 0 1px rgba(0,212,255,0.3)',
                  animation: 'floatY 4s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
                }}
              >
                <img
                  src={myaboutpic}
                  alt="Vikash"
                  className="w-full h-full object-cover"
                  style={{ filter: 'contrast(1.05) saturate(0.9)' }}
                />
                {/* Tint overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(180deg,rgba(0,212,255,0.04) 0%,transparent 40%,rgba(20,30,48,0.25) 100%)' }} />
                {/* Scan line */}
                <div className="absolute left-0 w-full h-[2px] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)', animation: 'scanline 3s linear infinite' }} />
                {/* Corner brackets */}
                <CornerBracket pos="tl" />
                <CornerBracket pos="tr" />
                <CornerBracket pos="bl" />
                <CornerBracket pos="br" />
              </div>
 
              {/* Floating cards */}
              <FloatCard
                style={{ top: -18, right: -20 }}
                label="Age" value={<span style={{ color: '#35577D' }}>20+</span>}
                sub="Years Old" delay={0.5}
              />
              <FloatCard
                style={{ bottom: -63, left: -88 }}
                label="University" value={<span style={{ color: '#00d4ff' }}>I.K. Gujral Punjab Technical University</span>}
                sub="B.Tech CSE" delay={1.3}
              />
              <FloatCard
                style={{ top: 160, left: -32 }}
                label="Location"
                value={<span style={{ color: '#a0c4d8', fontSize: 13 }}>India 🇮🇳</span>}
                delay={2}
              />
 
              {/* Particles */}
              <Particle style={{ width: 4, height: 4, top: '15%', left: '25%' }} dur={4}   delay={0} />
              <Particle style={{ width: 3, height: 3, top: '70%', left: '75%' }} dur={5}   delay={1.5} />
              <Particle style={{ width: 5, height: 5, top: '40%', left: '80%' }} dur={6}   delay={3} />
              <Particle style={{ width: 3, height: 3, top: '80%', left: '20%' }} dur={4.5} delay={2} />
            </div>
          </motion.div>
 
          {/* ── RIGHT: Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
              WHO <span className="text-[#35577D]">AM I ?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              I am Vikash Kumar, a B.Tech CSE student at I.K. Gujral Punjab Technical University. 
I enjoy building  applications, working with Python, and exploring new technologies. 
Currently, I am learning iOS development and looking for opportunities to gain real-world experience through internships.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Programming is my passion, and securing digital spaces is my mission. I love solving puzzles, exploring new tech trends, and contributing to open-source.
            </p>

            
          </motion.div>
 
        </div>
      </section>
    </>
  );
};
 
export default About;
 