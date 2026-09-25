import React from 'react';
import { Mail } from 'lucide-react';
import { Github, Linkedin } from '../icons';

export default function Footer() {
  return (
    <footer className="bg-[#2D2926] text-[#F9F6F0] py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-sm opacity-80">
          Built with ❤️ by Vikash Kumar &middot; 2025
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-[#DDA75B] transition-colors duration-300">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-[#DDA75B] transition-colors duration-300">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-[#DDA75B] transition-colors duration-300">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
