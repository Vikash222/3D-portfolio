import React from 'react';
import { ArrowUp, Shield, UserCheck, Sparkles, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../common/Icons';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineLink from '../editor/InlineLink';

export default function Footer({ onNavigateAdmin, profile }) {
  const { updateAboutDetail, updateProfileField } = useVisualEditor();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#080204]/90 backdrop-blur-xl py-14 relative overflow-hidden text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-[1.5px] shadow-sm shrink-0">
            <div className="w-full h-full bg-[#12070b] rounded-[10px] overflow-hidden flex items-center justify-center">
              <img
                src={profile?.avatar_url || profile?.hero_image_url || '/assets/vikash-hero.jpg'}
                alt={profile?.name || 'Vikash Kumar'}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.vk-fallback');
                  if (fallback) fallback.style.display = 'inline';
                }}
              />
              <span className="vk-fallback font-black text-red-400 text-sm tracking-tighter hidden">VK</span>
            </div>
          </div>
          <div>
            <span className="text-sm font-black text-white block">
              <InlineText
                value={profile?.name || 'Vikash Kumar'}
                placeholder="Vikash Kumar"
                onChange={(val) => updateProfileField('name', val)}
              />
            </span>
            <span className="text-xs text-slate-400 font-medium">
              <InlineText
                value={profile?.about_details?.footer_tagline ?? 'B.Tech CSE @ IKGPTU • Full-Stack & AI Enthusiast'}
                placeholder="B.Tech CSE @ IKGPTU • Full-Stack & AI Enthusiast"
                onChange={(val) => updateAboutDetail('footer_tagline', val)}
              />
            </span>
          </div>
        </div>

        {/* Social Quick Links */}
        <div className="flex items-center gap-2">
          <InlineLink
            href={profile?.github || "https://github.com/Vikash222"}
            onHrefChange={(val) => updateProfileField('github', val)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4 fill-current" />
          </InlineLink>
          <InlineLink
            href={profile?.linkedin || 'https://www.linkedin.com/feed/'}
            onHrefChange={(val) => updateProfileField('linkedin', val)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4 fill-current" />
          </InlineLink>
          <InlineLink
            href={profile?.instagram || 'https://www.instagram.com/mrvikash7493/?next=%2F'}
            onHrefChange={(val) => updateProfileField('instagram', val)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-rose-400 transition-colors"
            title="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </InlineLink>
        </div>

        <div className="text-xs text-slate-400 text-center flex flex-wrap items-center justify-center gap-1.5">
          <InlineText
            as="span"
            value={profile?.about_details?.footer_credit ?? 'Built with React 19, Three.js, Laravel 11 & MySQL 8.0'}
            placeholder="Built with React 19, Three.js, Laravel 11 & MySQL 8.0"
            onChange={(val) => updateAboutDetail('footer_credit', val)}
          />
          <span>&bull;</span>
          <span className="font-semibold text-slate-200">
            &copy; {new Date().getFullYear()} {profile?.name || 'Vikash Kumar'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-400/40 text-slate-300 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            Admin CMS
          </button>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-400/40 text-slate-300 hover:text-red-300 transition-all cursor-pointer shadow-xs"
            title="Scroll to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
