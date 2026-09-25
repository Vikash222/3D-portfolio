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

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (typeof sendContactMessage === 'function') {
        await sendContactMessage(data);
      }
      toast.success('Message sent successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#2D2926] text-[#F9F6F0] scroll-mt-20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[#F9F6F0]">
            Let's Connect
          </h2>
          <p className="text-[#F9F6F0]/60 max-w-2xl text-lg">
            Whether you have a question, a project proposition, or just want to say hi, my inbox is always open.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16">
          {/* Left: Form */}
          <div className="md:w-3/5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F9F6F0]/80">Your Name</label>
                  <input
                    {...register('name')}
                    className="w-full bg-[#F9F6F0]/5 border border-[#F9F6F0]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#DDA75B] transition-colors text-[#F9F6F0]"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#F9F6F0]/80">Email Address</label>
                  <input
                    {...register('email')}
                    className="w-full bg-[#F9F6F0]/5 border border-[#F9F6F0]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#DDA75B] transition-colors text-[#F9F6F0]"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[#F9F6F0]/80">Your Message</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full bg-[#F9F6F0]/5 border border-[#F9F6F0]/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#DDA75B] transition-colors text-[#F9F6F0] resize-none"
                  placeholder="Hello Vikash, I'd like to discuss..."
                ></textarea>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#DDA75B] text-[#2D2926] px-8 py-3.5 rounded-lg font-bold hover:bg-[#c9954a] transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Info */}
          <div className="md:w-2/5 space-y-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4 text-[#8A9A86]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A9A86] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8A9A86]"></span>
                </span>
                AVAILABILITY
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">Available for Summer 2025</h3>
              <p className="text-[#F9F6F0]/60 text-sm leading-relaxed">
                Currently open for internship opportunities, freelance projects, and collaborative research roles starting May 2025.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase mb-6 text-[#F9F6F0]/50 border-b border-[#F9F6F0]/10 pb-2">
                DIRECT CHANNELS
              </h4>
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[#F9F6F0]/5 rounded-lg group-hover:bg-[#DDA75B] group-hover:text-[#2D2926] transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  <span className="text-[#F9F6F0]/80 group-hover:text-[#F9F6F0] font-medium transition-colors">GitHub Profile</span>
                </a>
                <a href="#" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[#F9F6F0]/5 rounded-lg group-hover:bg-[#DDA75B] group-hover:text-[#2D2926] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <span className="text-[#F9F6F0]/80 group-hover:text-[#F9F6F0] font-medium transition-colors">LinkedIn Network</span>
                </a>
                <a href="#" className="flex items-center gap-4 group">
                  <div className="p-3 bg-[#F9F6F0]/5 rounded-lg group-hover:bg-[#DDA75B] group-hover:text-[#2D2926] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-[#F9F6F0]/80 group-hover:text-[#F9F6F0] font-medium transition-colors">Electronic Mail</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#F9F6F0]/40 pt-6">
              <Clock className="w-4 h-4" /> Creative Response Time: 2-4 hrs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
