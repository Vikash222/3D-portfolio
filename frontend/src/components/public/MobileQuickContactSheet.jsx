import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Download,
  Share2,
  Check,
  Shield,
  ExternalLink,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileQuickContactSheet({ isOpen, onClose, profile, onNavigateAdmin }) {
  const [copied, setCopied] = useState(false);

  const phone = profile?.phone || '+91-7493929836';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const email = profile?.email || 'heyvikash@icloud.com';
  const resumeUrl =
    profile?.resume_url ||
    'https://drive.google.com/file/d/1H72SMGMsGUIPGRen11BQ0EroYX28RodC/view?usp=sharing';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vikash Kumar | B.Tech CSE & Full-Stack Developer',
          text: 'Check out Vikash Kumar\'s software portfolio, campus projects, and NSS leadership!',
          url: window.location.href,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0b101f] rounded-t-[32px] p-6 pb-10 shadow-2xl border-t border-white/10 z-10 space-y-5 text-white"
          >
            {/* Drag Handle Bar */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto" />

            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={profile?.hero_image_url || '/assets/vikash-hero.jpg'}
                    alt="Vikash Kumar"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-red-500 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#12070b]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Vikash Kumar
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>IKGPTU Main Campus</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* WhatsApp Direct */}
              <a
                href={`https://wa.me/${cleanPhone}?text=Hi%20Vikash,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold text-xs hover:bg-emerald-900/40 transition-all active:scale-98 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="block leading-tight">WhatsApp</span>
                  <span className="text-[10px] text-emerald-400/80 font-normal">Direct Chat</span>
                </div>
              </a>

              {/* Direct Call */}
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 font-bold text-xs hover:bg-red-900/40 transition-all active:scale-98 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block leading-tight">Phone Call</span>
                  <span className="text-[10px] text-red-400/80 font-normal">{phone}</span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}?subject=Internship%20/%20Project%20Inquiry%20for%20Vikash%20Kumar`}
                className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-bold text-xs hover:bg-indigo-900/40 transition-all active:scale-98 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block leading-tight">Send Email</span>
                  <span className="text-[10px] text-indigo-300/80 font-normal truncate max-w-[90px] block">
                    {email}
                  </span>
                </div>
              </a>

              {/* Download Resume */}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold text-xs hover:bg-purple-900/40 transition-all active:scale-98 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="block leading-tight">Resume PDF</span>
                  <span className="text-[10px] text-purple-300/80 font-normal">Official CV</span>
                </div>
              </a>
            </div>

            {/* Secondary actions: Share & Admin Login */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Share Portfolio</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateAdmin();
                }}
                className="py-3 px-4 rounded-xl border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Admin CMS Login"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Admin</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
