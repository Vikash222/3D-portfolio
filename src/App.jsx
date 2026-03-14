
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import { Shield, Code, Lock, Zap, Globe } from "lucide-react";
import Chatbot from './components/Chatbot';
 
// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import MagicGallery from "./components/MagicGallery";
import Footer from "./components/Footer";
 
/* ─── Orbit config (same as Hero/About/Projects) ─── */
const ORBIT_ITEMS = [
  { Icon: Shield, bg: "rgba(53,87,125,0.85)",  angle: 0,   radius: 120, dur: 8  },
  { Icon: Code,   bg: "rgba(0,212,255,0.2)",   angle: 72,  radius: 145, dur: 11 },
  { Icon: Lock,   bg: "rgba(255,100,50,0.22)", angle: 144, radius: 115, dur: 9  },
  { Icon: Zap,    bg: "rgba(53,87,125,0.55)",  angle: 216, radius: 140, dur: 13 },
  { Icon: Globe,  bg: "rgba(0,212,255,0.15)",  angle: 288, radius: 128, dur: 10 },
];
 
const TERMINAL_LINES = [
  { text: "✓ Loading assets",                delay: 0.4,  color: "rgba(160,220,160,0.85)" },
  { text: "✓ Scanning modules",              delay: 1.2,  color: "rgba(160,220,160,0.85)" },
  { text: "✓ Establishing secure connection",delay: 2.0,  color: "rgba(160,220,160,0.85)" },
  { text: "► Initializing UI",               delay: 2.8,  color: "rgba(0,212,255,0.95)",   blink: true },
];
 
/* ─── Corner bracket ─── */
const Corner = ({ pos }) => {
  const map = {
    tl: "top-2.5 left-2.5 border-t-2 border-l-2",
    tr: "top-2.5 right-2.5 border-t-2 border-r-2",
    bl: "bottom-2.5 left-2.5 border-b-2 border-l-2",
    br: "bottom-2.5 right-2.5 border-b-2 border-r-2",
  };
  const delays = { tl: "0s", tr: ".5s", bl: "1s", br: "1.5s" };
  return (
    <div
      className={`absolute w-4 h-4 border-cyan-400 ${map[pos]}`}
      style={{ animation: "cornerPulse 2s ease-in-out infinite", animationDelay: delays[pos] }}
    />
  );
};
 
/* ─── Preloader ─── */
const Preloader = ({ progress }) => (
  <motion.div
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ duration: 0.6, ease: "easeInOut" }}
    className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden"
    style={{ background: "#141E30" }}
  >
    {/* BG grid */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
 
    {/* Glow blobs */}
    <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle,rgba(53,87,125,0.2) 0%,transparent 70%)" }} />
    <div className="absolute bottom-[-80px] right-[-80px] w-64 h-64 rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)" }} />
 
    {/* Full-screen scan line */}
    <div
      className="absolute left-0 w-full h-[2px] pointer-events-none z-[5]"
      style={{
        background: "linear-gradient(90deg,transparent,rgba(0,212,255,0.3),transparent)",
        animation: "scanline 3s linear infinite",
      }}
    />
 
    {/* Orbit rings */}
    {[
      { size: 280, dur: "14s", dir: "ringR",  style: "solid",  color: "rgba(0,212,255,0.12)" },
      { size: 360, dur: "22s", dir: "ringRr", style: "dashed", color: "rgba(53,87,125,0.2)"  },
      { size: 450, dur: "34s", dir: "ringR",  style: "solid",  color: "rgba(0,212,255,0.06)" },
    ].map((r, i) => (
      <div key={i} className="absolute top-1/2 left-1/2 rounded-full pointer-events-none" style={{
        width: r.size, height: r.size,
        marginLeft: -r.size / 2, marginTop: -r.size / 2,
        border: `1px ${r.style} ${r.color}`,
        animation: `${r.dir} ${r.dur} linear infinite`,
      }} />
    ))}
 
    {/* Orbit items */}
    <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0 }}>
      {ORBIT_ITEMS.map(({ Icon, bg, angle, radius, dur }, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          marginTop: -17, marginLeft: -17,
          width: 34, height: 34,
          borderRadius: 9,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: bg,
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#a0c4d8",
          "--sa": `${angle}deg`,
          "--r": `${radius}px`,
          "--dur": `${dur}s`,
          animation: "orbitSpin var(--dur) linear infinite",
        }}>
          <Icon size={14} />
        </div>
      ))}
    </div>
 
    {/* Particles */}
    {[
      { w: 3, t: "20%", l: "18%", dur: 5,   delay: 0   },
      { w: 4, t: "70%", l: "75%", dur: 4,   delay: 1.8 },
      { w: 3, t: "40%", l: "88%", dur: 6,   delay: 3   },
      { w: 5, t: "80%", l: "12%", dur: 4.5, delay: 2.2 },
    ].map((p, i) => (
      <div key={i} className="absolute rounded-full pointer-events-none" style={{
        width: p.w, height: p.w,
        top: p.t, left: p.l,
        background: "rgba(0,212,255,0.6)",
        animation: `particleFade ${p.dur}s ease-in-out infinite`,
        animationDelay: `${p.delay}s`,
      }} />
    ))}
 
    {/* Corner brackets */}
    <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
 
    {/* ── Center content ── */}
    <div className="relative z-10 text-center w-[320px] md:w-[360px]">
 
      {/* Logo frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[110px] h-[110px] mx-auto mb-6"
        style={{ animation: "floatY 3.5s ease-in-out infinite" }}
      >
        <div className="w-full h-full rounded-[22px] flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#1e3a52,#141E30)",
            border: "1px solid rgba(0,212,255,0.35)",
            animation: "glowPulse 3s ease-in-out infinite",
            
          }}

        >
          <div className="absolute left-0 w-full h-[1.5px]"
            style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,255,0.6),transparent)", animation: "scanline 2.5s linear infinite" }} />
          <div className="absolute top-[5px] left-[5px] w-[10px] h-[10px] border-t-2 border-l-2 border-cyan-400"
            style={{ animation: "cornerPulse 2s ease-in-out infinite" }} />
          <div className="absolute top-[5px] right-[5px] w-[10px] h-[10px] border-t-2 border-r-2 border-cyan-400"
            style={{ animation: "cornerPulse 2s ease-in-out infinite", animationDelay: ".5s" }} />
          <div className="absolute bottom-[5px] left-[5px] w-[10px] h-[10px] border-b-2 border-l-2 border-cyan-400"
            style={{ animation: "cornerPulse 2s ease-in-out infinite", animationDelay: "1s" }} />
          <div className="absolute bottom-[5px] right-[5px] w-[10px] h-[10px] border-b-2 border-r-2 border-cyan-400"
            style={{ animation: "cornerPulse 2s ease-in-out infinite", animationDelay: "1.5s" }} />
          <span className="relative z-10 text-5xl font-black italic font-serif text-[#35577D]">V</span>
        </div>
      </motion.div>
 
      {/* Glitch name */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mb-2"
        style={{ animation: "glitch1 5s ease-in-out infinite" }}
      >
        <span className="text-[34px] font-black italic tracking-[4px] uppercase font-serif text-white">VIKASH KUMAR</span>
        <span className="absolute inset-0 text-[34px] font-black italic tracking-[4px] uppercase font-serif pointer-events-none"
          style={{ animation: "glitch2 5s ease-in-out infinite" }}>VIKASH</span>
      </motion.div>
 
      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[9px] tracking-[4px] uppercase mb-7"
        style={{ color: "rgba(0,212,255,0.6)" }}
      >
        Cybersecurity · Fullstack Dev
      </motion.div>
 
      {/* Terminal block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[10px] p-3 mb-5 text-left"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(0,212,255,0.12)",
          fontFamily: "monospace",
          fontSize: 10,
          minHeight: 80,
        }}
      >
        <div style={{ color: "rgba(0,212,255,0.5)", marginBottom: 4 }}>$ ./boot --init portfolio.exe</div>
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay }}
            style={{ color: line.color, marginBottom: 2 }}
          >
            {line.text}
            {line.blink && (
              <span style={{ animation: "blink 1s step-end infinite" }}>_</span>
            )}
          </motion.div>
        ))}
      </motion.div>
 
      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[9px] tracking-[1px] mb-2" style={{ color: "rgba(160,196,216,0.5)" }}>
          <span>LOADING</span>
          <motion.span
            key={progress}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12 }}
          >
            {progress}%
          </motion.span>
        </div>
 
        {/* Bar track */}
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg,#35577D,#00d4ff)",
              boxShadow: "0 0 10px rgba(0,212,255,0.5)",
              transition: "width 0.08s linear",
            }}
          />
        </div>
 
        {/* Segment dots */}
        <div className="flex justify-between mt-2">
          {[25, 50, 75, 100].map((threshold) => (
            <div key={threshold} className="w-[5px] h-[5px] rounded-full transition-all duration-300" style={{
              background: progress >= threshold ? "rgba(0,212,255,0.9)" : "rgba(53,87,125,0.3)",
              border: `1px solid ${progress >= threshold ? "rgba(0,212,255,0.9)" : "rgba(53,87,125,0.4)"}`,
              boxShadow: progress >= threshold ? "0 0 6px rgba(0,212,255,0.7)" : "none",
            }} />
          ))}
        </div>
      </div>
 
      <div className="text-[8px] tracking-[2px] uppercase" style={{ color: "rgba(160,196,216,0.25)" }}>
        Secure Init v1.0 · Vikash.dev
      </div>
    </div>
  </motion.div>
);
 
/* ─── App ─── */
function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
 
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
 
  useEffect(() => {
    /* Progress ticker — slight random jitter for realism */
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 400); // brief pause at 100%
          return 100;
        }
        const jump = Math.random() < 0.3 ? Math.floor(Math.random() * 4) + 1 : 1;
        return Math.min(100, prev + jump);
      });
    }, 40);
 
    /* Smooth scroll */
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, smoothTouch: false });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
 
    return () => { clearInterval(timer); lenis.destroy(); };
  }, []);
 
  return (
    <>
    <main>
      {/* Keyframes (injected once) */}
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(var(--sa)) translateX(var(--r)) rotate(calc(-1 * var(--sa))); }
          to   { transform: rotate(calc(var(--sa) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--sa) + 360deg))); }
        }
        @keyframes scanline     { 0%{top:-5%} 100%{top:110%} }
        @keyframes cornerPulse  { 0%,100%{opacity:.25} 50%{opacity:1} }
        @keyframes ringR        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ringRr       { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes floatY       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes glowPulse    { 0%,100%{box-shadow:0 0 30px rgba(0,212,255,0.22)} 50%{box-shadow:0 0 70px rgba(0,212,255,0.55)} }
        @keyframes particleFade { 0%{opacity:0;transform:translateY(0) scale(0)} 40%{opacity:.7} 100%{opacity:0;transform:translateY(-50px) scale(1.5)} }
        @keyframes glitch1      { 0%,95%,100%{clip-path:none;transform:none} 96%{clip-path:polygon(0 10%,100% 10%,100% 25%,0 25%);transform:translateX(-4px)} 97%{clip-path:polygon(0 60%,100% 60%,100% 75%,0 75%);transform:translateX(4px)} 98%{clip-path:polygon(0 40%,100% 40%,100% 50%,0 50%);transform:translateX(-2px)} }
        @keyframes glitch2      { 0%,94%,100%{clip-path:none;opacity:0} 95%{clip-path:polygon(0 30%,100% 30%,100% 45%,0 45%);transform:translateX(5px);opacity:.7;color:#00d4ff} 97%{clip-path:polygon(0 70%,100% 70%,100% 85%,0 85%);transform:translateX(-5px);opacity:.7;color:#ff6432} 99%{opacity:0} }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
 
      <div className="bg-[#141E30] min-h-screen text-[#E0E6ED] selection:bg-[#35577D] overflow-x-hidden">
 
        {/* Preloader */}
        <AnimatePresence>
          {loading && <Preloader progress={progress} />}
        </AnimatePresence>
 
        {!loading && (
          <>
            <Navbar />
 
            {/* Scroll progress bar */}
            <motion.div
              className="fixed right-4 top-0 bottom-0 w-[2px] bg-[#35577D] origin-top z-[500]"
              style={{ scaleY, boxShadow: "0 0 20px #35577D" }}
            />
 
            {/* Background ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full animate-pulse"
                style={{ background: "rgba(53,87,125,0.15)", filter: "blur(120px)" }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full animate-pulse"
                style={{ background: "rgba(53,87,125,0.1)", filter: "blur(120px)" }} />
            </div>
 
            <main className="relative z-10">
              <SectionWrapper><Hero /></SectionWrapper>
              <SectionWrapper><About /></SectionWrapper>
              <SectionWrapper><Resume /></SectionWrapper>
              <SectionWrapper><Projects /></SectionWrapper>
              <SectionWrapper><MagicGallery /></SectionWrapper>
              <SectionWrapper><Footer /></SectionWrapper>
            </main>
          </>
        )}
      </div>
      </main>
      <Chatbot />
    </>
  );
}
 
const SectionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.div>
);
 
export default App;
 