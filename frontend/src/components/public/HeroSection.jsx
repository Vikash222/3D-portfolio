import React from 'react';
import { Download, Sparkles, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import profileImg from '../../assets/vikash-hero.jpg';
import { getAssetUrl } from '../../lib/utils';

export default function HeroSection({ profile }) {
  const hero = profile?.hero_settings || {};
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';
  const accentColor = profile?.theme_settings?.accent_color || '#8A9A86';

  const badgeText = hero.badge || 'CSE STUDENT · 2026';
  const titlePrefix = hero.title_prefix || "Hi, I'm";
  const highlightName = hero.highlight_name || (profile?.name ? profile.name.split(' ')[0] : 'Vikash');
  const tagline = hero.tagline || profile?.headline || 'Architecting scalable web and mobile applications, integrated with intelligent AI models.';
  const primaryBtnText = hero.primary_btn_text || 'Explore Work';
  const primaryBtnLink = hero.primary_btn_link || '#projects';
  const secondaryBtnText = hero.secondary_btn_text || 'Download Resume';
  const secondaryBtnLink = hero.secondary_btn_link || '#contact';
  const subtext = hero.status_subtext || 'Top Freelancer · Full-Stack & AI · 2+ Years Exp';

  return (
    <section className="relative bg-[#121214] pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden min-h-[90vh] flex items-center text-[#F9F6F0]">
      {/* Background Radial Glow */}
      <div
        style={{ background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)` }}
        className="absolute top-1/4 -right-24 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-emerald-400">
                {badgeText}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-[#F9F6F0] font-bold leading-[1.1] tracking-tight">
              {titlePrefix}{' '}
              <span style={{ color: primaryColor }}>{highlightName}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-sans">
              {tagline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={primaryBtnLink}
                style={{ backgroundColor: primaryColor }}
                className="px-7 py-3.5 rounded-xl font-bold text-black hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-black/40 text-sm transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={secondaryBtnLink}
                className="px-7 py-3.5 rounded-xl font-bold text-slate-200 border border-slate-700 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>{secondaryBtnText}</span>
              </a>
            </div>

            {/* Subtext info pill */}
            <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-2 font-mono">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{subtext}</span>
            </div>
          </div>

          {/* Right Content: Portrait */}
          <div className="flex-1 w-full max-w-md relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl border border-slate-700/80 bg-slate-900 group">
              <img
                src={getAssetUrl(profile?.profile_image_url, profileImg)}
                alt={profile?.name || 'Vikash Kumar'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  if (e.currentTarget.src !== profileImg) {
                    e.currentTarget.src = profileImg;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{profile?.name || 'Vikash Kumar'}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{profile?.availability_status || 'Open for Opportunities'}</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
