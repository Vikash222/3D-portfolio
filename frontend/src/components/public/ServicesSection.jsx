import React from 'react';
import {
  Code,
  Database,
  Box,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  Cpu,
  Globe,
  Server,
  Smartphone,
} from 'lucide-react';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';

const iconMap = {
  Code,
  Database,
  Box,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Globe,
  Server,
  Smartphone,
};

const defaultServices = [
  {
    title: 'Full-Stack Web Engineering',
    desc: 'Architecting fast, accessible, enterprise-grade web applications using React 19, Tailwind CSS, TypeScript, and modern state architectures.',
    icon: 'Code',
    color: 'from-blue-600 to-cyan-500',
    features: [
      'Component-driven design systems (shadcn/ui)',
      'Server-Side Rendering & Edge Deployment',
      'State management & real-time WebSockets',
      'Lighthouse 95+ performance optimization',
    ],
  },
  {
    title: 'Headless REST & GraphQL APIs',
    desc: 'High-throughput backend engines written in Laravel 11, PHP 8.5, and Node.js with scalable MySQL relational modeling.',
    icon: 'Database',
    color: 'from-indigo-600 to-blue-500',
    features: [
      'Sub-50ms Redis distributed caching layers',
      'Database indexing & query optimization',
      'Rate limiting, Sanctum auth, and CORS safeguards',
      'Automated OpenAPI / Swagger documentation',
    ],
  },
  {
    title: 'Interactive 3D WebGL & Canvas',
    desc: 'Elevating digital presence with immersive Three.js scenes, custom GLSL shaders, 3D interactive product showcases, and dynamic particle physics.',
    icon: 'Box',
    color: 'from-violet-600 to-indigo-600',
    features: [
      'Hardware-accelerated 60fps rendering',
      'Mouse parallax & tilt physics',
      'GLTF/GLB model loading with Draco compression',
      'Seamless integration with React state',
    ],
  },
  {
    title: '2FA Security & Enterprise AI',
    desc: 'Enterprise security hardening with Microsoft Authenticator TOTP, fine-grained access control, and Google Gemini API digital assistant integrations.',
    icon: 'ShieldCheck',
    color: 'from-emerald-600 to-teal-500',
    features: [
      'Offline RFC 6238 TOTP (Microsoft / Google)',
      'Emergency recovery code cryptosystems',
      'Gemini 2.5 / 1.5 Flash LLM API orchestrations',
      'Zero-trust token lifecycle management',
    ],
  },
];

export default function ServicesSection({
  services = [],
  profile = null,
}) {
  const { updateAboutDetail } = useVisualEditor();
  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-28 relative overflow-hidden bg-transparent">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Specialized Engineering Capabilities Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-red-950/30">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.services_badge ?? 'Specialized Engineering Capabilities'}
              placeholder="Specialized Engineering Capabilities"
              onChange={(val) => updateAboutDetail('services_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.services_title ?? 'End-to-End Solutions For High-Growth Platforms'}
              placeholder="End-to-End Solutions For High-Growth Platforms"
              onChange={(val) => updateAboutDetail('services_title', val)}
            />
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.services_subtitle ?? 'From initial system architecture to production deployment, delivering software engineered to withstand heavy scale and high expectations.'}
              placeholder="From initial system architecture to production deployment, delivering software engineered to withstand heavy scale and high expectations."
              onChange={(val) => updateAboutDetail('services_subtitle', val)}
            />
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayServices.map((svc, idx) => {
            const IconComponent =
              typeof svc.icon === 'string'
                ? iconMap[svc.icon] || Sparkles
                : svc.icon || Sparkles;

            const featuresList = Array.isArray(svc.features)
              ? svc.features
              : typeof svc.features === 'string'
              ? svc.features.split('\n').filter(Boolean)
              : [];

            return (
              <div
                key={svc.id || idx}
                className="cosmic-card cosmic-card-hover rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 group-hover:bg-red-500/20 transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-red-400 group-hover:text-red-300 transition-colors" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-red-400 transition-colors">
                    <InlineText
                      value={profile?.about_details?.[`svc_${idx}_title`] ?? svc.title}
                      placeholder={svc.title}
                      onChange={(val) => updateAboutDetail(`svc_${idx}_title`, val)}
                    />
                  </h3>

                  <div className="text-sm text-slate-300 leading-relaxed mb-6">
                    <InlineText
                      as="p"
                      value={profile?.about_details?.[`svc_${idx}_desc`] ?? (svc.desc || svc.description)}
                      placeholder={svc.desc || svc.description}
                      onChange={(val) => updateAboutDetail(`svc_${idx}_desc`, val)}
                    />
                  </div>
                </div>

                {featuresList.length > 0 && (
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    {featuresList.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <span className="font-medium">
                          <InlineText
                            value={profile?.about_details?.[`svc_${idx}_feat_${fIdx}`] ?? feat}
                            placeholder={feat}
                            onChange={(val) => updateAboutDetail(`svc_${idx}_feat_${fIdx}`, val)}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
