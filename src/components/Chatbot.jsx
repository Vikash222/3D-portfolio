import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Zap } from 'lucide-react';
import myPic from '../assets/vikash-portrait.jpg';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const QUICK_REPLIES = [
  "Who is Vikash?",
  "What are his skills?",
  "How to contact?",
  "Show his projects",
];

const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, padding: '4px 6px' }}>
    {[0, 1, 2].map(i => (
      <motion.span key={i}
        style={{ width: 5, height: 5, borderRadius: '50%', background: '#00d4ff', display: 'block' }}
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const CornerBracket = ({ pos }) => {
  const styles = {
    tl: 'top-[6px] left-[6px] border-t-2 border-l-2',
    tr: 'top-[6px] right-[6px] border-t-2 border-r-2',
    bl: 'bottom-[6px] left-[6px] border-b-2 border-l-2',
    br: 'bottom-[6px] right-[6px] border-b-2 border-r-2',
  };
  const delays = { tl: 0, tr: 0.5, bl: 1, br: 1.5 };
  return (
    <motion.div
      className={`absolute w-3 h-3 border-cyan-400/50 ${styles[pos]}`}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, delay: delays[pos] }}
    />
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([
    {
      role: 'bot',
      text: "Hi! Welcome to Vikash's portfolio 👋\nFeel free to ask me anything about Vikash!",
      time: new Date(),
    }
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [unread, setUnread]       = useState(0);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
      setUnread(0);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return;
    setShowQuick(false);
    setMessages(prev => [...prev, { role: 'user', text, time: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant embedded on Vikash Kumar's portfolio website. Your job is to help VISITORS learn about Vikash.

═══════════════════════════════════════
CRITICAL IDENTITY RULES — READ CAREFULLY
═══════════════════════════════════════
- The person sending messages is a VISITOR browsing the portfolio — they are NOT Vikash.
- Vikash Kumar is the OWNER of this portfolio — he is a third person being talked ABOUT.
- NEVER say "Hi Vikash", "Hello Vikash", or address the visitor as "Vikash" under ANY circumstance.
- Always refer to Vikash in THIRD PERSON: "Vikash is...", "He is...", "Vikash has..."
- If someone says "Hi" or "Hello", respond with: "Hi there! 👋 How can I help you learn about Vikash?"

═══════════════════════════════════════
ABOUT VIKASH KUMAR (third person — the portfolio owner)
═══════════════════════════════════════
- Full Name: Vikash Kumar
- Degree: B.Tech CSE student at IKGPTU, Jalandhar, India
- Skills: Python Development, iOS Deployment
- Looking for: Development Internships actively
- GitHub: github.com/Vikash222
- LinkedIn: linkedin.com/in/vikash-kumar-ab436131a
- Instagram: @mrvikash7493
- Email: heyvikash@icloud.com
- Location: Jalandhar, Punjab, India

═══════════════════════════════════════
LANGUAGE DETECTION RULES — VERY IMPORTANT
═══════════════════════════════════════
- DETECT the language of EACH message independently.
- If the visitor writes in ENGLISH → respond in ENGLISH only. No Hindi words at all.
- If the visitor writes in HINDI → respond in HINDI or Hinglish (Hindi + English mix).
- If the visitor writes in HINGLISH → respond in Hinglish.
- Examples:
  * "Who is Vikash?" → Reply in English
  * "Vikash kaun hai?" → Reply in Hinglish
  * "What are his skills?" → Reply in English
  * "Uski skills kya hain?" → Reply in Hinglish
  * "Hi" → Reply in English: "Hi there! 👋 How can I help you learn about Vikash?"
  * "Hii" or "Helo" → Reply in Hinglish: "Hii! 👋 Vikash ke portfolio mein aapka swagat hai! Kya jaanna chahte ho?"
- NEVER mix languages when visitor clearly uses one language.
- NEVER default to Hindi — always match visitor's language.

═══════════════════════════════════════
BEHAVIOR RULES
═══════════════════════════════════════
- Keep all answers short: 2 to 4 lines maximum.
- Use emojis naturally but sparingly.
- Only answer questions related to Vikash's portfolio, skills, projects, education, and contact.
- If asked something unrelated, politely say: "I can only help with questions about Vikash's portfolio 😊"
- Never make up information about Vikash that is not listed above.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
      });

      const botText = completion.choices[0]?.message?.content
        ?? "Sorry, I couldn't get a response. Please try again!";

      setMessages(prev => [...prev, { role: 'bot', text: botText, time: new Date() }]);
      if (!isOpen) setUnread(n => n + 1);

    } catch (err) {
      console.error('Groq error:', err);
      const msg = err?.message?.includes('401')
        ? '❌ Invalid API key! Check your .env file.'
        : err?.message?.includes('429')
        ? '⚠️ Rate limit hit! Please wait a moment.'
        : '😅 Something went wrong. Please try again!';
      setMessages(prev => [...prev, { role: 'bot', text: msg, time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) =>
    d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const formatText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

  return (
    <>
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(var(--sa)) translateX(var(--r)) rotate(calc(-1 * var(--sa))); }
          to   { transform: rotate(calc(var(--sa) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--sa) + 360deg))); }
        }
        @keyframes scanline    { 0%{top:-5%} 100%{top:110%} }
        @keyframes ringRotate    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)}  }
        @keyframes ringRotateRev { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
        @keyframes glowPulse {
          0%,100%{box-shadow:0 0 0 1px rgba(0,212,255,0.08),0 24px 64px rgba(0,0,0,0.8),0 0 30px rgba(0,212,255,0.08)}
          50%    {box-shadow:0 0 0 1px rgba(0,212,255,0.15),0 24px 64px rgba(0,0,0,0.8),0 0 60px rgba(0,212,255,0.2)}
        }
        @keyframes float {
          0%,100%{transform:translateY(0px) rotateX(1deg) rotateY(0deg)}
          33%    {transform:translateY(-6px) rotateX(-1deg) rotateY(1deg)}
          66%    {transform:translateY(-3px) rotateX(1deg) rotateY(-1deg)}
        }
        .orbit-item {
          position:absolute; top:50%; left:50%;
          margin:-16px 0 0 -16px; width:32px; height:32px;
          border-radius:8px; display:flex; align-items:center; justify-content:center;
          font-size:14px; background:rgba(14,24,41,0.92);
          border:1px solid rgba(0,212,255,0.2); backdrop-filter:blur(8px);
          animation:orbitSpin var(--dur) linear infinite;
        }
        .ring-orbit {
          position:absolute; top:50%; left:50%;
          border-radius:50%; border:1px solid; pointer-events:none;
        }
        .chat-window {
          animation:float 6s ease-in-out infinite, glowPulse 3s ease-in-out infinite;
          transform-style:preserve-3d;
        }
        .scan-line {
          position:absolute; left:0; width:100%; height:2px;
          background:linear-gradient(90deg,transparent,rgba(0,212,255,0.45),transparent);
          animation:scanline 3.5s linear infinite; pointer-events:none;
        }
        .messages-scroll::-webkit-scrollbar { width:3px }
        .messages-scroll::-webkit-scrollbar-track { background:transparent }
        .messages-scroll::-webkit-scrollbar-thumb { background:rgba(0,212,255,0.15); border-radius:4px }
      `}</style>

      <div className="fixed bottom-6 right-6 z-[999]" style={{ perspective: '1200px' }}>

        {/* Orbit rings + icons */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.4 }}
              className="absolute pointer-events-none"
              style={{ top: '50%', left: '50%', zIndex: -1 }}
            >
              <div className="ring-orbit" style={{ width:480, height:480, marginLeft:-240, marginTop:-240, borderColor:'rgba(0,212,255,0.1)', animation:'ringRotate 28s linear infinite' }}/>
              <div className="ring-orbit" style={{ width:560, height:560, marginLeft:-280, marginTop:-280, borderStyle:'dashed', borderColor:'rgba(53,87,125,0.18)', animation:'ringRotateRev 40s linear infinite' }}/>
              {[
                { icon:'🛡️', angle:0,   radius:210, dur:8  },
                { icon:'⚡',  angle:120, radius:250, dur:11 },
                { icon:'🔒', angle:240, radius:225, dur:9  },
                { icon:'💻', angle:60,  radius:250, dur:13 },
                { icon:'🌐', angle:300, radius:220, dur:10 },
              ].map((item, i) => (
                <div key={i} className="orbit-item"
                  style={{ '--sa':`${item.angle}deg`, '--r':`${item.radius}px`, '--dur':`${item.dur}s` }}>
                  {item.icon}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity:0, y:28, scale:0.92, rotateX:8 }}
              animate={{ opacity:1, y:0,  scale:1,    rotateX:0 }}
              exit={{   opacity:0, y:28, scale:0.92, rotateX:8 }}
              transition={{ type:'spring', stiffness:280, damping:26 }}
              className="chat-window mb-4 absolute bottom-16 right-0 rounded-2xl overflow-hidden flex flex-col"
              style={{ width:320, height:490, background:'linear-gradient(160deg,#0e1829 0%,#141E30 60%,#0a1220 100%)', border:'1px solid rgba(0,212,255,0.18)' }}
            >
              <CornerBracket pos="tl"/><CornerBracket pos="tr"/>
              <CornerBracket pos="bl"/><CornerBracket pos="br"/>

              {/* Header */}
              <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 border-b overflow-hidden flex-shrink-0"
                style={{ background:'rgba(0,212,255,0.04)', borderColor:'rgba(255,255,255,0.06)' }}>
                <div className="scan-line"/>
                <div className="relative w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden"
                  style={{ border:'1.5px solid rgba(0,212,255,0.4)', boxShadow:'0 0 12px rgba(0,212,255,0.2)' }}>
                  <img src={myPic} alt="Vikash" className="w-full h-full object-cover"
                    style={{ filter:'contrast(1.05) saturate(0.9)' }}/>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2"
                    style={{ borderColor:'#0e1829' }}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold tracking-wide" style={{ fontSize:11 }}>Vikash's Assistant</p>
                  <p style={{ fontSize:10, color:'rgba(0,212,255,0.65)' }}>
                    {loading ? '✦ Typing...' : '● Online'}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded-full font-bold uppercase tracking-widest"
                  style={{ fontSize:9, background:'rgba(249,115,22,0.15)', color:'rgba(249,115,22,0.9)', border:'1px solid rgba(249,115,22,0.3)' }}>
                  AI
                </div>
                <button onClick={() => setIsOpen(false)}
                  className="ml-1 p-1 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color:'rgba(255,255,255,0.4)' }}>
                  <X size={13}/>
                </button>
              </div>

              {/* Messages */}
              <div className="messages-scroll flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
                {messages.map((m, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:8 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.22 }}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-end gap-1.5 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {m.role === 'bot' && (
                        <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center mb-1"
                          style={{ background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)' }}>
                          <Zap size={10} className="text-cyan-400"/>
                        </div>
                      )}
                      <div className="px-3 py-2 text-[11.5px] leading-relaxed"
                        style={m.role === 'user' ? {
                          background:'linear-gradient(135deg,#35577D,#2a4a6b)',
                          color:'#e8f4fd',
                          borderRadius:'14px 4px 14px 14px',
                          boxShadow:'0 2px 12px rgba(53,87,125,0.35)',
                        } : {
                          background:'rgba(255,255,255,0.05)',
                          color:'#c8dce8',
                          border:'1px solid rgba(255,255,255,0.07)',
                          borderRadius:'4px 14px 14px 14px',
                        }}
                        dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                      />
                    </div>
                    <span className="mt-0.5 px-1" style={{ fontSize:9, color:'rgba(255,255,255,0.2)' }}>
                      {formatTime(m.time)}
                    </span>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="flex items-end gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.2)' }}>
                      <Zap size={10} className="text-cyan-400"/>
                    </div>
                    <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'4px 14px 14px 14px' }}>
                      <TypingDots/>
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef}/>
              </div>

              {/* Quick replies */}
              <AnimatePresence>
                {showQuick && !loading && (
                  <motion.div
                    initial={{ opacity:0, height:0 }}
                    animate={{ opacity:1, height:'auto' }}
                    exit={{ opacity:0, height:0 }}
                    className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0"
                  >
                    {QUICK_REPLIES.map((q, i) => (
                      <motion.button key={i}
                        initial={{ opacity:0, scale:0.88 }}
                        animate={{ opacity:1, scale:1 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ scale:1.05 }}
                        whileTap={{ scale:0.96 }}
                        onClick={() => sendMessage(q)}
                        className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                        style={{ background:'rgba(0,212,255,0.07)', border:'1px solid rgba(0,212,255,0.22)', color:'rgba(0,212,255,0.85)', fontFamily:'inherit' }}
                      >
                        {q}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              <div className="px-3 pb-3 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,212,255,0.15)' }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Ask anything about Vikash..."
                    className="flex-1 bg-transparent outline-none text-white text-[11.5px]"
                    style={{ fontFamily:'inherit' }}
                  />
                  <motion.button
                    whileTap={{ scale:0.88 }}
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-30"
                    style={{ background: input.trim() ? 'linear-gradient(135deg,#35577D,rgba(249,115,22,0.4))' : 'rgba(255,255,255,0.05)', border:'1px solid rgba(0,212,255,0.3)' }}
                  >
                    <Send size={11} className="text-cyan-300"/>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          whileHover={{ scale:1.08 }}
          whileTap={{ scale:0.92 }}
          onClick={() => setIsOpen(o => !o)}
          className="relative flex items-center justify-center rounded-2xl"
          style={{ width:52, height:52, background: isOpen ? 'rgba(14,24,41,0.95)' : 'linear-gradient(135deg,#35577D 0%,#1e3a5f 100%)', border:'1px solid rgba(0,212,255,0.3)', boxShadow:'0 0 20px rgba(0,212,255,0.12),0 8px 24px rgba(0,0,0,0.5)' }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={isOpen ? 'x' : 'chat'}
              initial={{ rotate:-90, opacity:0, scale:0.7 }}
              animate={{ rotate:0,   opacity:1, scale:1   }}
              exit={{   rotate:90,  opacity:0, scale:0.7 }}
              transition={{ duration:0.18 }}
            >
              {isOpen
                ? <X size={20} style={{ color:'rgba(255,255,255,0.5)' }}/>
                : <MessageCircle size={20} className="text-cyan-300"/>
              }
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {!isOpen && unread > 0 && (
              <motion.div
                initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center font-bold border-2 text-white"
                style={{ fontSize:9, borderColor:'#141E30' }}
              >
                {unread}
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ boxShadow:['0 0 0 0px rgba(0,212,255,0.5)','0 0 0 12px rgba(0,212,255,0)'] }}
              transition={{ duration:2.2, repeat:Infinity }}
            />
          )}
        </motion.button>
      </div>
    </>
  );
};

export default Chatbot;