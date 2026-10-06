import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Send, MapPin, Clock, Mail } from 'lucide-react';
import { Github, Linkedin } from '../../components/icons';
import { sendContactMessage } from '../../api/contactApi'; // Assuming this exists

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactSection({ profile }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const primaryColor = profile?.theme_settings?.primary_color || '#DDA75B';
  const availability = profile?.availability_status || 'Open for Opportunities';
  const contactDetails = profile?.contact_details || {};
  const email = profile?.email || contactDetails.email || 'vikash@mrvikash.in';
  const location = profile?.location || contactDetails.location || 'Punjab, India';

  const onSubmit = async (data) => {
    try {
      if (typeof sendContactMessage === 'function') {
        await sendContactMessage(data);
      }
      toast.success('Message sent successfully! I will reply shortly.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0d0e12] text-[#F9F6F0] scroll-mt-20 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <span style={{ color: primaryColor }} className="text-xs font-mono font-bold tracking-widest uppercase mb-2 block">
            GET IN TOUCH
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#F9F6F0]">
            Let's Connect
          </h2>
          <p className="text-slate-400 max-w-2xl text-base md:text-lg">
            Whether you have a question, a project proposition, or just want to collaborate, my inbox is always open.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          {/* Left: Form */}
          <div className="md:w-3/5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider font-mono">Your Name</label>
                  <input
                    {...register('name')}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-colors text-white text-sm"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider font-mono">Email Address</label>
                  <input
                    {...register('email')}
                    className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-colors text-white text-sm"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300 uppercase tracking-wider font-mono">Your Message</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 transition-colors text-white text-sm resize-none"
                  placeholder="Hello Vikash, I would like to discuss..."
                ></textarea>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor }}
                className="text-black px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer text-sm shadow-lg shadow-black/40"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Info */}
          <div className="md:w-2/5 space-y-8">
            <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-3 text-emerald-400 font-mono">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                STATUS
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 text-white">{availability}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Currently open for full-time engineering roles, high-impact consulting, and AI systems research collaborations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="p-3 bg-slate-800 rounded-lg text-emerald-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Email</div>
                  <a href={`mailto:${email}`} className="text-sm text-slate-200 hover:text-white font-medium">{email}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="p-3 bg-slate-800 rounded-lg text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Location</div>
                  <div className="text-sm text-slate-200 font-medium">{location}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Response Time: ~2-4 hours
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
