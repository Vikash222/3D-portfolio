import React from 'react';
import { Star, Quote, MessageSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from '../common/Icons';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';
import InlineLink from '../editor/InlineLink';

export default function TestimonialsSection({ testimonials = [], profile = null }) {
  const { updateAboutDetail } = useVisualEditor();
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden bg-transparent">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.test_badge ?? 'Verified Client & Colleague Endorsements'}
              placeholder="Verified Client & Colleague Endorsements"
              onChange={(val) => updateAboutDetail('test_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.test_title_1 ?? 'Trusted by Engineering Leaders &'}
              placeholder="Trusted by Engineering Leaders &"
              onChange={(val) => updateAboutDetail('test_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.test_title_gradient ?? 'Founders'}
                placeholder="Founders"
                onChange={(val) => updateAboutDetail('test_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.test_subtitle ?? 'Real feedback from verified peers, mentors, and team leads who have collaborated with Vikash on mission-critical software platforms.'}
              placeholder="Real feedback from verified peers, mentors, and team leads who have collaborated with Vikash on mission-critical software platforms."
              onChange={(val) => updateAboutDetail('test_subtitle', val)}
            />
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={item.id || idx}
              className="cosmic-card cosmic-card-hover rounded-2xl p-8 flex flex-col justify-between group relative"
            >
              {/* Top Row: Stars + Verified Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {item.is_verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/30">
                      <CheckCircle2 className="w-3 h-3 text-red-400" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Project Context Pill if available */}
                {item.project_context && (
                  <div className="inline-block text-[11px] font-medium text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-md mb-4 border border-white/10">
                    Project: <span className="font-semibold text-red-300">{item.project_context}</span>
                  </div>
                )}

                {/* Quote Content */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-red-400/20 mb-2" />
                  <div className="text-slate-200 text-sm leading-relaxed italic">
                    <InlineText
                      as="p"
                      value={profile?.about_details?.[`testimonial_${item.id || idx}_content`] ?? item.content}
                      placeholder={item.content}
                      onChange={(val) => updateAboutDetail(`testimonial_${item.id || idx}_content`, val)}
                    />
                  </div>
                </div>
              </div>

              {/* Author Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-red-500/40 shadow-md ring-2 ring-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white font-bold text-base flex items-center justify-center shadow-md shrink-0">
                      {item.name ? item.name.charAt(0) : 'U'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      <InlineText
                        value={profile?.about_details?.[`testimonial_${item.id || idx}_name`] ?? item.name}
                        placeholder={item.name}
                        onChange={(val) => updateAboutDetail(`testimonial_${item.id || idx}_name`, val)}
                      />
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      <InlineText
                        value={profile?.about_details?.[`testimonial_${item.id || idx}_role`] ?? item.role}
                        placeholder={item.role}
                        onChange={(val) => updateAboutDetail(`testimonial_${item.id || idx}_role`, val)}
                      />
                    </p>
                  </div>
                </div>

                {/* LinkedIn verification link */}
                <InlineLink
                  href={item.linkedin_url || '#'}
                  onHrefChange={(val) => updateAboutDetail(`testimonial_${item.id || idx}_linkedin`, val)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-colors shrink-0"
                  title="View Verified Profile on LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4 fill-current" />
                </InlineLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
