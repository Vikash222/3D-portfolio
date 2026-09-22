import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Users,
  FolderGit2,
  FileText,
  MessageCircle,
  Bot,
  Zap,
} from 'lucide-react';

export default function MobileStoryBar({ onOpenChat, profile }) {
  const resumeUrl =
    profile?.resume_url ||
    'https://drive.google.com/file/d/1H72SMGMsGUIPGRen11BQ0EroYX28RodC/view?usp=sharing';

  const stories = [
    {
      id: 'ai-twin',
      label: 'AI Twin',
      sub: 'Ask Me',
      icon: Bot,
      color: 'from-blue-600 via-indigo-600 to-violet-600',
      isPulse: true,
      action: onOpenChat,
    },
    {
      id: 'kavach',
      label: 'Kavach',
      sub: 'Project',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      href: '#projects',
    },
    {
      id: 'ikgptu',
      label: 'IKGPTU',
      sub: 'B.Tech',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      href: '#education-leadership',
    },
    {
      id: 'tech-stack',
      label: 'Tech Stack',
      sub: 'Skills',
      icon: Zap,
      color: 'from-emerald-500 to-teal-600',
      href: '#skills',
    },
    {
      id: 'repos',
      label: '16 Repos',
      sub: 'GitHub',
      icon: FolderGit2,
      color: 'from-slate-700 to-slate-900',
      href: '#github',
    },
    {
      id: 'resume',
      label: 'My CV',
      sub: 'PDF',
      icon: FileText,
      color: 'from-indigo-500 to-purple-600',
      external: resumeUrl,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      sub: 'Direct',
      icon: MessageCircle,
      color: 'from-emerald-400 to-green-600',
      external: 'https://wa.me/917493929836?text=Hi%20Vikash,%20I%20visited%20your%20portfolio!',
    },
  ];

  return (
    <div className="w-full md:hidden py-2 px-3 overflow-hidden">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-2 px-1">
        {stories.map((story) => {
          const Icon = story.icon;

          const content = (
            <div className="flex flex-col items-center shrink-0 w-[68px] group cursor-pointer">
              {/* Outer Gradient Ring */}
              <div className="relative">
                <div
                  className={`w-15 h-15 rounded-full p-[2.5px] bg-gradient-to-tr ${story.color} shadow-md group-hover:scale-105 active:scale-95 transition-all duration-200`}
                >
                  <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
                    <div
                      className={`w-full h-full rounded-full bg-gradient-to-tr ${story.color} flex items-center justify-center text-white`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {story.isPulse && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="mt-1.5 text-[11px] font-bold text-slate-800 tracking-tight text-center truncate max-w-[66px] leading-tight">
                {story.label}
              </span>
              <span className="text-[9px] font-medium text-slate-400 text-center leading-none">
                {story.sub}
              </span>
            </div>
          );

          if (story.action) {
            return (
              <button
                key={story.id}
                onClick={story.action}
                type="button"
                className="focus:outline-none"
              >
                {content}
              </button>
            );
          }

          if (story.external) {
            return (
              <a
                key={story.id}
                href={story.external}
                target="_blank"
                rel="noreferrer"
                className="focus:outline-none"
              >
                {content}
              </a>
            );
          }

          return (
            <a key={story.id} href={story.href} className="focus:outline-none">
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}
