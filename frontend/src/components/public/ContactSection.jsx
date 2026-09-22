import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle, Sparkles, MessageCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from '../common/Icons';
import { submitContactForm } from '../../services/api';
import { useVisualEditor } from '../../context/VisualEditorContext';
import InlineText from '../editor/InlineText';

export default function ContactSection({ profile }) {
  const { updateProfileField, updateAboutDetail, isEditMode, isPreviewMode } = useVisualEditor();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage('Please provide a message of at least 10 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await submitContactForm(formData);
      setSuccess(true);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#2563eb', '#38bdf8', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch (err) {
        // ignore confetti errors if canvas unavailable
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message || 'Failed to send message. Please try again or email directly.';
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-transparent">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <InlineText
              value={profile?.about_details?.contact_badge ?? "Let's Connect & Collaborate"}
              placeholder="Let's Connect & Collaborate"
              onChange={(val) => updateAboutDetail('contact_badge', val)}
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            <InlineText
              value={profile?.about_details?.contact_title_1 ?? 'Have a Project or Opportunity?'}
              placeholder="Have a Project or Opportunity?"
              onChange={(val) => updateAboutDetail('contact_title_1', val)}
            />{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              <InlineText
                value={profile?.about_details?.contact_title_gradient ?? 'Send a Message'}
                placeholder="Send a Message"
                onChange={(val) => updateAboutDetail('contact_title_gradient', val)}
              />
            </span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            <InlineText
              as="span"
              value={profile?.about_details?.contact_subtitle ?? 'Inquiries sent here are delivered directly to my inbox. Feel free to reach out for software engineering collaborations, internships, or open-source discussions.'}
              placeholder="Inquiries sent here are delivered directly to my inbox. Feel free to reach out for software engineering collaborations, internships, or open-source discussions."
              onChange={(val) => updateAboutDetail('contact_subtitle', val)}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="cosmic-card rounded-3xl p-8 space-y-6">
              <h3 className="text-2xl font-bold text-white">
                <InlineText
                  value={profile?.about_details?.contact_info_title ?? 'Direct Contact Details'}
                  placeholder="Direct Contact Details"
                  onChange={(val) => updateAboutDetail('contact_info_title', val)}
                />
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                <InlineText
                  as="span"
                  value={profile?.about_details?.contact_info_desc ?? 'Whether you have an inquiry about software engineering, campus tech solutions, full-stack projects, or developer internships, I reply within 24 hours.'}
                  placeholder="Whether you have an inquiry about software engineering, campus tech solutions, full-stack projects, or developer internships, I reply within 24 hours."
                  onChange={(val) => updateAboutDetail('contact_info_desc', val)}
                />
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-400/50 hover:shadow-lg transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Email</span>
                    <InlineText
                      value={profile?.email}
                      placeholder="vikash@example.com"
                      className="text-sm font-semibold text-white group-hover:text-red-300"
                      onChange={(val) => updateProfileField('email', val)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:shadow-lg transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Phone / WhatsApp</span>
                    <InlineText
                      value={profile?.phone}
                      placeholder="+91 98765 43210"
                      className="text-sm font-semibold text-white group-hover:text-emerald-300"
                      onChange={(val) => updateProfileField('phone', val)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Location</span>
                    <InlineText
                      value={profile?.location}
                      placeholder="Punjab, India"
                      className="text-sm font-semibold text-white"
                      onChange={(val) => updateProfileField('location', val)}
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Verified Social Channels
                </span>
                <div className="flex items-center gap-3">
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-400/50 hover:bg-white/10 transition-all"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4 fill-current" />
                    </a>
                  )}

                  {profile?.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-400/50 hover:bg-white/10 transition-all"
                      title="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4 fill-current" />
                    </a>
                  )}

                  {profile?.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-red-400 hover:border-red-400/50 hover:bg-white/10 transition-all"
                      title="Twitter / X"
                    >
                      <TwitterIcon className="w-4 h-4 fill-current" />
                    </a>
                  )}

                  <a
                    href={profile?.instagram || 'https://www.instagram.com/mrvikash7493/?next=%2F'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:border-rose-400/50 hover:bg-white/10 transition-all"
                    title="Instagram @mrvikash7493"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                </div>

                {/* Live In-Page Social Links Editor (Visible in Visual Editor Mode) */}
                {isEditMode && !isPreviewMode && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5 text-xs">
                    <span className="font-bold text-cyan-300 block">Edit Social Channel URLs Directly:</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">GitHub Profile Link</span>
                      <InlineText
                        value={profile?.github}
                        placeholder="https://github.com/Vikash222"
                        onChange={(val) => updateProfileField('github', val)}
                        className="text-white font-mono text-[11px] block w-full bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">LinkedIn Profile Link</span>
                      <InlineText
                        value={profile?.linkedin}
                        placeholder="https://linkedin.com/in/..."
                        onChange={(val) => updateProfileField('linkedin', val)}
                        className="text-white font-mono text-[11px] block w-full bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Twitter / X Profile Link</span>
                      <InlineText
                        value={profile?.twitter}
                        placeholder="https://twitter.com/..."
                        onChange={(val) => updateProfileField('twitter', val)}
                        className="text-white font-mono text-[11px] block w-full bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Instagram Profile Link</span>
                      <InlineText
                        value={profile?.instagram}
                        placeholder="https://instagram.com/..."
                        onChange={(val) => updateProfileField('instagram', val)}
                        className="text-white font-mono text-[11px] block w-full bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="cosmic-card rounded-3xl p-8 sm:p-10 relative">
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/20">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Message Delivered!</h3>
                  <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                    Thank you for reaching out. Your message has been logged securely in the Admin Dashboard. I will review and respond shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Morgan"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:bg-slate-900/90 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:bg-slate-900/90 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:bg-slate-900/90 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Project Architecture Inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:bg-slate-900/90 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project scope, goals, timeline, or technical requirements..."
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:bg-slate-900/90 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:via-rose-500 hover:to-red-600 text-white font-bold text-sm shadow-xl shadow-red-500/25 transition-all hover:shadow-2xl hover:shadow-red-500/35 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Encrypted Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message Directly</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
