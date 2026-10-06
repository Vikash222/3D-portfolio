import React from 'react';
import { Mail, Globe } from 'lucide-react';
import { Github, Linkedin } from '../icons';
import { trackSocialClick } from '../../api/adminApi';

export default function Footer({ profile, socialLinks = [] }) {
  const copyright = profile?.site_settings?.copyright || `Built with ❤️ by ${profile?.name || 'Vikash Kumar'} · ${new Date().getFullYear()}`;
  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  const handleSocialClick = (id) => {
    if (id) {
      trackSocialClick(id).catch(() => {});
    }
  };

  return (
    <footer className="bg-[#121214] text-[#F9F6F0] py-8 px-8 border-t border-slate-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-400">
          {copyright}
        </div>
        
        <div className="flex flex-wrap items-center gap-5">
          {socialLinks && socialLinks.length > 0 ? (
            socialLinks.filter((s) => s && s.is_visible !== false).map((s) => {
              const platformName = s.platform || s.platform_name || s.name || 'Social';
              const nameLower = platformName.toLowerCase();

              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleSocialClick(s.id)}
                  style={{ '--hover-color': primaryColor }}
                  className="text-slate-400 hover:text-white transition-colors duration-200 text-xs font-semibold tracking-wider flex items-center gap-1.5"
                  title={platformName}
                >
                  {nameLower.includes('github') ? (
                    <Github className="w-4 h-4" />
                  ) : nameLower.includes('linkedin') ? (
                    <Linkedin className="w-4 h-4" />
                  ) : nameLower.includes('mail') || nameLower.includes('email') ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                  <span>{platformName}</span>
                </a>
              );
            })
          ) : (
            <>
              <a href="https://github.com/Vikash222" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
