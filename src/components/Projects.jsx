import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "AI IVR Call Assistant",
      cat: "AI / Python",
      img: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=500",
      github: "https://github.com/Vikash222/ai-ivr-call-assistant",
      live: "#",
      desc: "AI powered voice call assistant built using Python to automate responses and simulate IVR based interactions."
    },
    {
      title: "Resume Forge AI",
      cat: "AI Tool",
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=500",
      github: "https://github.com/Vikash222/resume-forge-ai",
      live: "#",
      desc: "AI powered resume builder that helps generate ATS friendly resumes and portfolios."
    },
    {
      title: "smart-booking-system",
      cat: "Web Application",
      img: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=500",
      github: "https://github.com/Vikash222/smart-booking-system",
      live: "https://smart-booking-system-2bcc9.web.app/",
      desc: "Web based application to create professional resumes and personal portfolios quickly."
    },
    {
      title: "Vite React Project",
      cat: "Frontend Development",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500",
      github: "https://github.com/Vikash222/vite-react",
      live: "#",
      desc: "Frontend UI project built with React and Vite to explore modern web development workflows."
    },
    {
      title: "Daily Discipline Tracker",
      cat: "Productivity",
      img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=500",
      github: "https://github.com/Vikash222/daily-discipline-tracker",
      live: "#",
      desc: "A productivity and habit tracking tool designed to help users build consistent routines."
    }
  ];

  return (
    <section className="py-24 bg-[#141E30] text-white overflow-hidden min-h-screen flex flex-col justify-center relative">

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">

        <h2 className="text-center text-5xl md:text-7xl font-black uppercase tracking-tighter mb-20 italic">
          Work <span className="text-[#35577D]">Gallery</span>
        </h2>

        <div className="relative group px-4 md:px-12">

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            speed={800}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: -20,
              depth: 200,
              modifier: 1.5,
              slideShadows: false
            }}
            navigation={{ nextEl: ".s-next", prevEl: ".s-prev" }}
            pagination={{ clickable: true, dynamicBullets: true }}
            modules={[EffectCoverflow, Navigation, Autoplay, Pagination]}
            className="w-full py-16"
          >

            {projects.map((proj, i) => (
              <SwiperSlide key={i} className="max-w-[280px] md:max-w-[420px]">

                <motion.div
                  onClick={() => setSelectedProject(proj)}
                  whileHover={{ y: -10 }}
                  className="relative aspect-[3/4] bg-[#1d2a45] rounded-[3rem] overflow-hidden border border-white/5 cursor-pointer shadow-2xl group/card"
                >

                  <img
                    src={proj.img}
                    className="w-full h-full object-cover opacity-50 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-8 flex flex-col justify-end">

                    <span className="text-[#35577D] text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                      {proj.cat}
                    </span>

                    <h3 className="text-3xl font-black italic leading-none mb-6 group-hover/card:text-[#35577D] transition-colors">
                      {proj.title}
                    </h3>

                    <div className="flex gap-4">
                      <a
                        href={proj.github}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-[#35577D] transition-all"
                      >
                        <Github size={18} />
                      </a>

                      <a
                        href={proj.live}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white transition-all hover:text-black"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>

                  </div>
                </motion.div>

              </SwiperSlide>
            ))}

          </Swiper>

          <div className="s-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 cursor-pointer hover:bg-[#35577D] transition-all hidden md:flex">
            <ChevronLeft size={24} />
          </div>

          <div className="s-next absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/5 backdrop-blur-md rounded-full border border-white/10 cursor-pointer hover:bg-[#35577D] transition-all hidden md:flex">
            <ChevronRight size={24} />
          </div>

        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-[#141E30]/90 backdrop-blur-2xl z-[100]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 h-[75vh] bg-[#1d2a45] border-t border-white/10 rounded-t-[4rem] z-[101] p-10 md:p-20 overflow-y-auto"
            >

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-10 right-10 p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all"
              >
                <X />
              </button>

              <div className="max-w-4xl mx-auto">

                <span className="text-[#35577D] font-bold uppercase tracking-[0.5em] text-xs">
                  Project Spotlight
                </span>

                <h2 className="text-6xl md:text-8xl font-black italic mt-6 mb-10 tracking-tighter uppercase leading-none">
                  {selectedProject.title}
                </h2>

                <p className="text-gray-400 text-xl leading-relaxed italic mb-12 border-l-2 border-[#35577D] pl-8">
                  {selectedProject.desc}
                </p>

                <div className="flex gap-6">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    className="bg-[#35577D] text-black px-12 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-[0_0_20px_#35577D55]"
                  >
                    Source Code
                  </a>

                  <a
                    href={selectedProject.live}
                    target="_blank"
                    className="border border-white/10 px-12 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    Live Preview
                  </a>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Projects;