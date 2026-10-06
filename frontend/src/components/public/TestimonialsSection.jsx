import React from 'react';
import { Star, Quote, MessageSquare, CheckCircle2, ExternalLink } from 'lucide-react';
import { Linkedin } from '../icons';

export default function TestimonialsSection({ testimonials = [], profile = null }) {
  if (!testimonials || testimonials.length === 0) return null;

  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';

  return (
    <section id="testimonials" className="py-24 bg-[#0d0e12] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Endorsements & Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-bold tracking-tight mb-4">
            Trusted by Engineering Leaders & Founders
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Real feedback from verified peers, mentors, and clients who have collaborated on production software systems.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Rating stars & Verified badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {(item.is_featured || item.is_verified) && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-7 h-7 text-slate-700 mb-2" />
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="pt-5 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: primaryColor }}
                      className="w-10 h-10 rounded-full text-black font-bold text-sm flex items-center justify-center shrink-0"
                    >
                      {item.name ? item.name.charAt(0) : 'U'}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {item.designation || item.role} {item.company && `· ${item.company}`}
                    </p>
                  </div>
                </div>

                {item.linkedin_url && (
                  <a
                    href={item.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
