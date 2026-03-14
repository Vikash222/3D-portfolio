import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Linkedin, Github, Instagram, Twitter,
  Mail, Phone, MapPin, GraduationCap,
  ArrowUpRight, Sparkles, Heart, ExternalLink, Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';

// ✅ Apni values daalo
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STYLES = `
  @keyframes scanline    { 0%{top:-5%} 100%{top:110%} }
  @keyframes cornerPulse { 0%,100%{opacity:.25} 50%{opacity:1} }
  @keyframes ringR       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ringRr      { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes particleUp  { 0%{opacity:0;transform:translateY(0) scale(0)} 40%{opacity:.6} 100%{opacity:0;transform:translateY(-50px) scale(1.5)} }
  @keyframes bgBlob      { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
  @keyframes titleGlow   { 0%,100%{text-shadow:0 0 30px rgba(53,87,125,0.5)} 50%{text-shadow:0 0 70px rgba(53,87,125,0.9),0 0 140px rgba(0,212,255,0.35)} }
  @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes glowPulse   { 0%,100%{box-shadow:0 0 20px rgba(0,212,255,0.1)} 50%{box-shadow:0 0 45px rgba(0,212,255,0.28)} }
  @keyframes statusPing  { 0%{transform:scale(1);opacity:.8} 70%{transform:scale(2.5);opacity:0} 100%{opacity:0} }
  @keyframes heartBeat   { 0%,100%{transform:scale(1)} 25%{transform:scale(1.35)} 50%{transform:scale(1)} }
  @keyframes shimmerMove { from{transform:translateX(-100%)} to{transform:translateX(220%)} }
  @keyframes dotBlink    { 0%,100%{opacity:.3} 50%{opacity:1} }

  .footer-input {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:14px; padding:14px 18px; font-size:11px; color:#c8dce8; outline:none;
    transition:border-color .3s,box-shadow .3s; letter-spacing:1px; box-sizing:border-box; font-family:inherit;
  }
  .footer-input::placeholder{ color:rgba(160,196,216,0.3); letter-spacing:1.5px; font-size:9px; text-transform:uppercase }
  .footer-input:focus{ border-color:rgba(0,212,255,0.45); box-shadow:0 0 0 3px rgba(0,212,255,0.07) }

  .social-card {
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
    padding:22px 14px; border-radius:22px; border:1px solid rgba(255,255,255,0.07);
    background:rgba(255,255,255,0.03); cursor:pointer; text-decoration:none;
    transition:all .35s ease; position:relative; overflow:hidden;
  }
  .shimmer-layer {
    position:absolute; top:0; left:0; width:35%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);
    transform:translateX(-100%); pointer-events:none;
  }
  .social-card:hover .shimmer-layer { animation:shimmerMove .65s ease forwards }
  .info-row { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.05) }
  .info-row:last-child { border-bottom:none }
  .info-icon { width:44px; height:44px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:rgba(53,87,125,0.18); border:1px solid rgba(53,87,125,0.35); transition:all .3s }
  .info-row:hover .info-icon {
    background:rgba(53,87,125,0.45); border-color:rgba(0,212,255,0.4);
    box-shadow:0 0 16px rgba(53,87,125,0.4);
  }
`;

const Corner = ({ pos, size = 14 }) => {
  const cls = { tl:'top-2 left-2 border-t-2 border-l-2', tr:'top-2 right-2 border-t-2 border-r-2', bl:'bottom-2 left-2 border-b-2 border-l-2', br:'bottom-2 right-2 border-b-2 border-r-2' };
  const dl  = { tl:'0s', tr:'.5s', bl:'1s', br:'1.5s' };
  return <div className={`absolute border-cyan-400 pointer-events-none ${cls[pos]}`} style={{ width:size, height:size, animation:'cornerPulse 2s ease-in-out infinite', animationDelay:dl[pos] }} />;
};

const SOCIALS = [
  { id:'linkedin', label:'LinkedIn',   handle:'@vikash-kumar', href:'https://www.linkedin.com/in/vikash-kumar-ab436131a/', icon:<Linkedin size={28}/>,  color:'#0077B5', bg:'rgba(0,119,181,0.13)',   border:'rgba(0,119,181,0.38)',   glow:'rgba(0,119,181,0.35)',   desc:'Connect professionally', badge:'Pro Network'  },
  { id:'github',   label:'GitHub',     handle:'@vikash-dev',   href:'https://github.com/Vikash222',                         icon:<Github size={28}/>,    color:'#ffffff',  bg:'rgba(255,255,255,0.09)', border:'rgba(255,255,255,0.28)', glow:'rgba(255,255,255,0.18)', desc:'Explore my repos',       badge:'Open Source'  },
  { id:'instagram',label:'Instagram',  handle:'@mrvikash7493', href:'https://www.instagram.com/mrvikash7493/',               icon:<Instagram size={28}/>, color:'#E4405F',  bg:'rgba(228,64,95,0.11)',   border:'rgba(228,64,95,0.38)',   glow:'rgba(228,64,95,0.3)',    desc:'Follow my journey',      badge:'Life & Work'  },
  { id:'twitter',  label:'Twitter / X',handle:'@MrVikash7493', href:'https://x.com/MrVikash7493',                           icon:<Twitter size={28}/>,   color:'#1DA1F2',  bg:'rgba(29,161,242,0.11)',  border:'rgba(29,161,242,0.38)', glow:'rgba(29,161,242,0.3)',   desc:'Thoughts & updates',     badge:'Tech Talks'   },
];

const StatCard = ({ value, label, color }) => (
  <motion.div
    whileHover={{ y:-4, scale:1.04 }}
    className="rounded-2xl p-4 text-center border cursor-default transition-all duration-300"
    style={{ background:'rgba(255,255,255,0.03)', borderColor:'rgba(255,255,255,0.07)' }}
    onMouseOver={e=>{ e.currentTarget.style.borderColor=color+'44'; e.currentTarget.style.background=color+'0d'; e.currentTarget.style.boxShadow=`0 0 20px ${color}22`; }}
    onMouseOut={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow='none'; }}
  >
    <div className="text-2xl font-black italic leading-none mb-1" style={{ color }}>{value}</div>
    <div className="text-[8px] tracking-[1.5px] uppercase" style={{ color:'rgba(160,196,216,0.45)' }}>{label}</div>
  </motion.div>
);

const Footer = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // ✅ Form data state
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      // ✅ Supabase mein save karo
      const { error: dbError } = await supabase
        .from('messages')
        .insert([{
          name:    form.name,
          email:   form.email,
          subject: form.subject,
          message: form.message,
          rating:  rating,
        }]);

      if (dbError) throw dbError;

      // ✅ Success
      setIsSubmitted(true);
      confetti({
        particleCount: 160,
        spread: 75,
        origin: { y: 0.85 },
        colors: ['#35577D', '#00d4ff', '#fff', '#EF9F27'],
      });

    } catch (err) {
      console.error('Supabase error:', err);
      setError('Something went wrong! Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>

      <footer id="contact" className="bg-[#141E30] pt-28 pb-12 border-t overflow-hidden relative font-sans"
        style={{ borderColor:'rgba(255,255,255,0.07)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px)', backgroundSize:'44px 44px' }} />

        <div className="absolute top-[-80px] left-[8%] w-96 h-96 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(53,87,125,0.18) 0%,transparent 70%)', animation:'bgBlob 9s ease-in-out infinite' }} />
        <div className="absolute bottom-[-60px] right-[6%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', animation:'bgBlob 12s ease-in-out infinite reverse' }} />

        {[{ s:520,d:'40s',a:'ringR', t:'solid', c:'rgba(0,212,255,0.05)'  },
          { s:700,d:'58s',a:'ringRr',t:'dashed',c:'rgba(53,87,125,0.08)'  }].map((r,i)=>(
          <div key={i} className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
            style={{ width:r.s,height:r.s,marginLeft:-r.s/2,marginTop:-r.s/2,border:`1px ${r.t} ${r.c}`,animation:`${r.a} ${r.d} linear infinite` }} />
        ))}

        {[{w:3,t:'10%',l:'5%',d:5,dl:0},{w:4,t:'70%',l:'92%',d:4,dl:2},{w:3,t:'45%',l:'97%',d:6,dl:1},{w:5,t:'80%',l:'3%',d:4.5,dl:2.5}].map((p,i)=>(
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:p.w,height:p.w,top:p.t,left:p.l,background:'rgba(0,212,255,0.6)',animation:`particleUp ${p.d}s ease-in-out infinite`,animationDelay:`${p.dl}s` }} />
        ))}

        <Corner pos="tl" size={16}/><Corner pos="tr" size={16}/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px]"
          style={{ background:'linear-gradient(90deg,transparent,rgba(53,87,125,0.6),rgba(0,212,255,0.4),rgba(53,87,125,0.6),transparent)' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* HEADING */}
          <motion.div initial={{ opacity:0,x:-24 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:.7 }} className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
              style={{ background:'rgba(0,212,255,0.06)',borderColor:'rgba(0,212,255,0.2)',color:'rgba(0,212,255,0.75)',fontSize:9,letterSpacing:'3px',textTransform:'uppercase' }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'dotBlink 1.5s ease-in-out infinite',boxShadow:'0 0 8px #4ade80' }} />
              Available for Opportunities
            </div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none" style={{ animation:'titleGlow 4s ease-in-out infinite' }}>
              Get In <br/><span style={{ color:'#35577D' }}>Touch.</span>
            </h2>
            <p className="mt-3 text-[10px] tracking-[4px] uppercase" style={{ color:'rgba(0,212,255,0.45)' }}>Let's build something extraordinary together</p>
          </motion.div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

            {/* LEFT */}
            <div className="lg:col-span-5 space-y-10">
              <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}>
                <p className="text-[9px] tracking-[3px] uppercase mb-5" style={{ color:'rgba(0,212,255,0.5)' }}>Direct Contact</p>
                {[
                  { icon:<Mail size={18}/>,          label:'Email',      value:'heyvikash@icloud.com',           href:'mailto:heyvikash@icloud.com' },
                  { icon:<Phone size={18}/>,         label:'Phone',      value:'+91-749xxxx836',                  href:'tel:+91-7493929836' },
                  { icon:<MapPin size={18}/>,        label:'Location',   value:'Jalandhar, Punjab, India 🇮🇳',   href:'https://www.google.com/maps/place/Jalandhar,+Punjab' },
                  { icon:<GraduationCap size={18}/>, label:'University', value:'IKGPTU · B.Tech CSE',             href:'https://ptu.ac.in/' },
                ].map((r,i)=>(
                  <div key={i} className="info-row">
                    <div className="info-icon"><span style={{ color:'#a0c4d8',display:'flex' }}>{r.icon}</span></div>
                    <div>
                      <div className="text-[8px] tracking-[2px] uppercase mb-0.5" style={{ color:'rgba(0,212,255,0.6)' }}>{r.label}</div>
                      <a href={r.href} className="text-sm font-bold hover:text-cyan-300 transition-colors" style={{ color:'#c8dce8' }}>{r.value}</a>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}>
                <p className="text-[9px] tracking-[3px] uppercase mb-4" style={{ color:'rgba(0,212,255,0.5)' }}>Quick Stats</p>
                <div className="grid grid-cols-4 gap-3">
                  <StatCard value="8+"  label="Projects" color="#35577D"/>
                  <StatCard value="20+" label="Age"      color="#00d4ff"/>
                  <StatCard value="2+"  label="Awards"   color="#EF9F27"/>
                  <StatCard value="∞"   label="Ideas"    color="#97C459"/>
                </div>
              </motion.div>

              <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.3 }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border"
                style={{ background:'rgba(74,222,128,0.05)',borderColor:'rgba(74,222,128,0.15)' }}>
                <div className="relative w-3 h-3 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-green-400" style={{ animation:'statusPing 1.5s ease-in-out infinite' }}/>
                  <div className="w-3 h-3 rounded-full bg-green-400"/>
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color:'rgba(74,222,128,0.9)' }}>Currently Active</div>
                  <div className="text-[9px] tracking-wide" style={{ color:'rgba(160,196,216,0.4)' }}>Typically replies within 24 hours</div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — Contact Form */}
            <motion.div className="lg:col-span-7"
              initial={{ opacity:0,y:24 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:.15 }}>
              <div className="relative rounded-[2rem] overflow-hidden"
                style={{ background:'rgba(29,42,69,0.6)',border:'1px solid rgba(255,255,255,0.08)',animation:'glowPulse 3s ease-in-out infinite' }}>
                <div className="absolute left-0 w-full h-[1.5px] pointer-events-none"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.45),transparent)',animation:'scanline 3s linear infinite' }}/>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px]"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(0,212,255,0.5),transparent)' }}/>
                <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>

                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black italic tracking-tight text-white">Send a Message</h3>
                      <p className="text-[9px] tracking-[2px] uppercase mt-1" style={{ color:'rgba(0,212,255,0.5)' }}>I read every message personally</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full border"
                      style={{ background:'rgba(74,222,128,0.06)',borderColor:'rgba(74,222,128,0.2)' }}>
                      <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation:'dotBlink 1.5s ease-in-out infinite',boxShadow:'0 0 8px #4ade80' }}/>
                      <span className="text-[9px] tracking-widest uppercase" style={{ color:'rgba(74,222,128,0.8)' }}>Online</span>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.form key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onSubmit={handleSubmit} className="space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* ✅ name attribute add kiya — onChange lagaya */}
                          <div className="relative">
                            <label className="absolute -top-2 left-3 px-1 text-[7px] tracking-[2px] uppercase z-10"
                              style={{ color:'rgba(0,212,255,0.7)',background:'rgba(15,22,37,0.95)' }}>Name</label>
                            <input
                              type="text" name="name" required
                              value={form.name} onChange={handleChange}
                              className="footer-input" placeholder="Your full name"
                            />
                          </div>
                          <div className="relative">
                            <label className="absolute -top-2 left-3 px-1 text-[7px] tracking-[2px] uppercase z-10"
                              style={{ color:'rgba(0,212,255,0.7)',background:'rgba(15,22,37,0.95)' }}>Email</label>
                            <input
                              type="email" name="email" required
                              value={form.email} onChange={handleChange}
                              className="footer-input" placeholder="your@email.com"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-1 text-[7px] tracking-[2px] uppercase z-10"
                            style={{ color:'rgba(0,212,255,0.7)',background:'rgba(15,22,37,0.95)' }}>Subject</label>
                          <input
                            type="text" name="subject" required
                            value={form.subject} onChange={handleChange}
                            className="footer-input" placeholder="What's this about?"
                          />
                        </div>

                        <div className="relative">
                          <label className="absolute -top-2 left-3 px-1 text-[7px] tracking-[2px] uppercase z-10"
                            style={{ color:'rgba(0,212,255,0.7)',background:'rgba(15,22,37,0.95)' }}>Message</label>
                          <textarea
                            rows="4" name="message" required
                            value={form.message} onChange={handleChange}
                            className="footer-input" placeholder="Tell me about your project or idea..."
                            style={{ resize:'none' }}
                          />
                        </div>

                        {/* ✅ Error message */}
                        {error && (
                          <div className="text-[10px] px-4 py-3 rounded-xl text-center"
                            style={{ background:'rgba(226,75,74,0.1)',border:'1px solid rgba(226,75,74,0.3)',color:'#E24B4A' }}>
                            ❌ {error}
                          </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-5 border-t"
                          style={{ borderColor:'rgba(255,255,255,0.06)' }}>
                          <div>
                            <p className="text-[8px] font-black tracking-[2px] uppercase mb-2" style={{ color:'rgba(160,196,216,0.4)' }}>Rate Portfolio</p>
                            <div className="flex gap-2">
                              {[1,2,3,4,5].map(star=>(
                                <motion.button key={star} type="button" whileHover={{ scale:1.2 }} whileTap={{ scale:0.9 }}
                                  onClick={()=>setRating(star)}
                                  style={{ color:rating>=star?'#E24B4A':'rgba(160,196,216,0.25)',background:'none',border:'none',cursor:'pointer',padding:2 }}>
                                  <Heart size={20} fill={rating>=star?'currentColor':'none'}/>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* ✅ Loading state button */}
                          <motion.button type="submit" disabled={sending}
                            whileHover={!sending ? { scale:1.04 } : {}}
                            whileTap={!sending ? { scale:0.97 } : {}}
                            className="flex items-center gap-2 px-10 py-4 rounded-full font-black text-[10px] tracking-[3px] uppercase transition-all"
                            style={{ background:sending?'rgba(53,87,125,0.5)':'#35577D',color:'#fff',boxShadow:'0 0 28px rgba(53,87,125,0.5)',border:'none',cursor:sending?'not-allowed':'pointer',opacity:sending?0.7:1 }}
                            onMouseOver={e=>{ if(!sending){ e.currentTarget.style.background='#00d4ff'; e.currentTarget.style.color='#141E30'; e.currentTarget.style.boxShadow='0 0 32px rgba(0,212,255,0.45)'; }}}
                            onMouseOut={e=>{ if(!sending){ e.currentTarget.style.background='#35577D'; e.currentTarget.style.color='#fff'; e.currentTarget.style.boxShadow='0 0 28px rgba(53,87,125,0.5)'; }}}>
                            {sending ? (
                              <><Loader2 size={14} className="animate-spin"/> Sending...</>
                            ) : (
                              <>Send Message <ArrowUpRight size={16}/></>
                            )}
                          </motion.button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div key="success" initial={{ scale:.9,opacity:0 }} animate={{ scale:1,opacity:1 }} className="text-center py-10">
                        <div className="text-6xl mb-5" style={{ animation:'floatY 3s ease-in-out infinite' }}>✨</div>
                        <Sparkles className="mx-auto mb-4" size={40} style={{ color:'#35577D' }}/>
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-3">Magic Sent!</h3>
                        <p className="text-sm" style={{ color:'rgba(160,196,216,0.55)' }}>
                          Thanks for the {rating>0?`${rating} ⭐`:'amazing'} rating!<br/>I'll reply within 24 hours.
                        </p>
                        <div className="w-16 h-[2px] mx-auto mt-6 rounded-full" style={{ background:'linear-gradient(90deg,#35577D,#00d4ff)' }}/>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* SOCIALS */}
          <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:.7 }} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1" style={{ background:'linear-gradient(90deg,transparent,rgba(53,87,125,0.5))' }}/>
              <p className="text-[9px] tracking-[4px] uppercase" style={{ color:'rgba(0,212,255,0.5)' }}>Follow & Connect</p>
              <div className="h-[1px] flex-1" style={{ background:'linear-gradient(90deg,rgba(53,87,125,0.5),transparent)' }}/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {SOCIALS.map((s,i)=>(
                <motion.a key={s.id} href={s.href} target="_blank" rel="noreferrer"
                  initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                  whileHover={{ y:-8,scale:1.03 }} whileTap={{ scale:.97 }}
                  className="social-card"
                  onMouseOver={e=>{ setHovered(s.id); e.currentTarget.style.borderColor=s.border; e.currentTarget.style.background=s.bg; e.currentTarget.style.boxShadow=`0 0 32px ${s.glow},0 16px 40px rgba(0,0,0,0.3)`; }}
                  onMouseOut={e=>{ setHovered(null); e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow='none'; }}>
                  <div className="shimmer-layer"/>
                  <div className="absolute top-3 right-3 transition-all duration-300" style={{ color:hovered===s.id?s.color:'transparent' }}><ExternalLink size={13}/></div>
                  <div className="absolute top-3 left-3 text-[7px] tracking-widest uppercase px-2 py-1 rounded-full border transition-all duration-300"
                    style={{ borderColor:hovered===s.id?s.border:'rgba(255,255,255,0.07)', color:hovered===s.id?s.color:'rgba(160,196,216,0.3)', background:hovered===s.id?s.bg:'transparent' }}>{s.badge}</div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mt-6 mb-2 transition-all duration-300"
                    style={{ background:hovered===s.id?s.bg:'rgba(255,255,255,0.05)', border:`1px solid ${hovered===s.id?s.border:'rgba(255,255,255,0.08)'}`, color:hovered===s.id?s.color:'#6a8aaa', boxShadow:hovered===s.id?`0 0 22px ${s.glow}`:'none' }}>{s.icon}</div>
                  <div className="font-black text-sm tracking-tight transition-colors duration-300" style={{ color:hovered===s.id?s.color:'#c8dce8' }}>{s.label}</div>
                  <div className="text-[9px] tracking-wide" style={{ color:'rgba(160,196,216,0.4)' }}>{s.handle}</div>
                  <div className="text-[8px] text-center mt-1 mb-2" style={{ color:'rgba(160,196,216,0.28)' }}>{s.desc}</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-t-full transition-all duration-500" style={{ background:s.color, width:hovered===s.id?'60%':'0%' }}/>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* FOOTER BAR */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t" style={{ borderColor:'rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] font-black tracking-[4px] uppercase" style={{ color:'rgba(160,196,216,0.3)' }}>© 2026 Vikash Kumar</p>
            <div className="flex items-center gap-2 text-[9px] tracking-[2px] uppercase" style={{ color:'rgba(160,196,216,0.3)' }}>
              Built with <Heart size={12} fill="#E24B4A" style={{ color:'#E24B4A',animation:'heartBeat 2s ease-in-out infinite' }}/> in India
            </div>
            <p className="text-[9px] font-black tracking-[4px] uppercase" style={{ color:'rgba(160,196,216,0.3)' }}>vikash</p>
          </div>

        </div>
        <Corner pos="bl" size={16}/><Corner pos="br" size={16}/>
      </footer>
    </>
  );
};

export default Footer;