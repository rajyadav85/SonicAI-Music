import React from 'react';
import { Sparkles, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#121212] text-white pt-14 pb-28 px-4 sm:px-8 select-none border-t border-[#202020] mt-16">
      {/* Top Section: Navigation Columns + Social Icons */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
        {/* Navigation Links Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 flex-1">
          {/* Column 1: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">Company</h4>
            <ul className="space-y-2 text-xs text-[#a1a1aa]">
              <li><span className="hover:text-white hover:underline transition cursor-pointer">About Us</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Jobs & Careers</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">For the Record</span></li>
            </ul>
          </div>

          {/* Column 2: Communities */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">Communities</h4>
            <ul className="space-y-2 text-xs text-[#a1a1aa]">
              <li><span className="hover:text-white hover:underline transition cursor-pointer">For Artists</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">AI Developers</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Advertising</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Investors</span></li>
            </ul>
          </div>

          {/* Column 3: Useful links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide">Useful Links</h4>
            <ul className="space-y-2 text-xs text-[#a1a1aa]">
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Support & FAQ</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Free Mobile App</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Mood Generator</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Import Music</span></li>
            </ul>
          </div>

          {/* Column 4: AI Music Plans */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
              <span>AI Music Plans</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </h4>
            <ul className="space-y-2 text-xs text-[#a1a1aa]">
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Premium Individual</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">Premium Student</span></li>
              <li><span className="hover:text-white hover:underline transition cursor-pointer">AI Music Free</span></li>
            </ul>
          </div>
        </div>

        {/* Social Media Circular Buttons (Clean SVG Icons) */}
        <div className="flex items-start gap-3">
          {/* Instagram */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#242424] hover:bg-[#333] text-white flex items-center justify-center transition hover:scale-105 cursor-pointer"
            aria-label="Instagram"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </button>

          {/* Twitter / X */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#242424] hover:bg-[#333] text-white flex items-center justify-center transition hover:scale-105 cursor-pointer"
            aria-label="Twitter"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#242424] hover:bg-[#333] text-white flex items-center justify-center transition hover:scale-105 cursor-pointer"
            aria-label="Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <hr className="border-t border-[#242424] mb-6" />

      {/* Bottom Copyright Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717a] gap-2">
        <div className="flex items-center gap-4">
          <span className="hover:underline cursor-pointer">Legal</span>
          <span className="hover:underline cursor-pointer">Privacy Center</span>
          <span className="hover:underline cursor-pointer">Cookies</span>
        </div>
        <p>&copy; 2026 AI Mood Music. Powered by AI Music Intelligence.</p>
      </div>
    </footer>
  );
};

export default Footer;
