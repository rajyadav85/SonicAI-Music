import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Disc,
  Heart,
  Sparkles,
  Plus,
  Globe,
  Flame,
  Compass,
} from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import { useAuth } from '../../context/useAuth';

/**
 * 🧭 Sidebar Navigation Component
 * ----------------------------------------------------
 * Spotify-style persistent left sidebar with:
 * 1. Primary Navigation Links (Home, Artists, Albums, Liked Songs)
 * 2. AI Mood Assistant Prompt generator
 * 3. User Library & Quick Mood Playlists
 */
const Sidebar = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const { triggerAiMood, likedSongIds, resetToHome } = useMusic();
  const { user, openAuthModal } = useAuth();
  const [sidebarMoodInput, setSidebarMoodInput] = useState('');

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    if (sidebarMoodInput.trim()) {
      triggerAiMood(sidebarMoodInput);
      setSidebarMoodInput('');
      navigate('/');
      if (onCloseMobile) onCloseMobile();
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/artists', label: 'Popular Artists', icon: Users },
    { to: '/albums', label: 'Popular Albums', icon: Disc },
    { to: '/liked-songs', label: 'Liked Songs', icon: Heart, count: likedSongIds.length },
  ];

  const handleNavClick = (to) => {
    if (to === '/') {
      resetToHome();
    }
    if (onCloseMobile) onCloseMobile();
  };

  const quickPlaylists = [
    { id: 'chill', name: 'Chill & Relax', path: '/mood/chill', count: '14 songs', icon: Disc, color: 'text-blue-400' },
    { id: 'energy', name: 'Workout Beast Mode', path: '/mood/energy', count: '18 songs', icon: Flame, color: 'text-amber-400' },
    { id: 'focus', name: 'Deep Focus Coding', path: '/mood/focus', count: '22 songs', icon: Compass, color: 'text-emerald-400' },
  ];

  return (
    <aside className="w-72 h-full bg-[#121212] p-4 flex flex-col justify-between select-none text-white overflow-hidden border-r border-[#242424]">
      {/* Top Section: Nav Links + AI Mood Generator + Library */}
      <div className="space-y-5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#242424]">
        {/* 1. Primary Nav Links */}
        <div className="space-y-1 bg-[#181818] p-2 rounded-xl border border-white/5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => handleNavClick(link.to)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                      : 'text-[#b3b3b3] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded-full font-bold text-rose-300">
                    {link.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* 2. What's Your Mood AI Generator Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1e172e] to-[#161616] border border-purple-500/20 shadow-md space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI Mood Assistant</span>
          </div>

          <p className="text-xs text-[#d1d5db] font-medium leading-relaxed">
            Tell us how you feel or what you are doing right now:
          </p>

          <form onSubmit={handleMoodSubmit} className="space-y-2">
            <input
              type="text"
              value={sidebarMoodInput}
              onChange={(e) => setSidebarMoodInput(e.target.value)}
              placeholder="e.g. late night coding, heartbreak, workout..."
              className="w-full h-8 px-3 rounded-lg bg-[#242424] text-xs text-white placeholder-[#757575] border border-transparent focus:border-purple-500/50 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!sidebarMoodInput.trim()}
              className="w-full h-7.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Generate AI Mix</span>
            </button>
          </form>
        </div>

        {/* 3. Your Library Header */}
        <div className="flex items-center justify-between text-[#b3b3b3] hover:text-white transition px-1 pt-1">
          <span className="font-bold text-sm tracking-tight text-white">Your Library</span>
          <button
            type="button"
            onClick={() => !user && openAuthModal('signup')}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#1f1f1f] text-[#b3b3b3] hover:text-white transition cursor-pointer"
            aria-label="Add playlist"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Quick Playlists / Mood Mixes List */}
        <div className="space-y-1">
          {quickPlaylists.map((pl) => {
            const Icon = pl.icon;
            return (
              <NavLink
                key={pl.id}
                to={pl.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'bg-[#242424] text-white' : 'hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white'
                  }`
                }
              >
                <div className="w-8 h-8 rounded-md bg-[#242424] flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${pl.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-xs text-white truncate">{pl.name}</h5>
                  <p className="text-[11px] text-[#71717a] truncate">{pl.count}</p>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* 5. User Status / Create Playlist Banner Card */}
        <div className="bg-[#1a1a1a] p-3.5 rounded-xl space-y-2 border border-white/5">
          <h4 className="font-bold text-xs text-white leading-tight">
            {user ? `${user.name}'s Favorite Mixes` : 'Create your first playlist'}
          </h4>
          <p className="text-[11px] text-[#a1a1aa]">
            {user ? 'Save AI generated mixes to your library' : "It's easy, we'll help you"}
          </p>
          <button
            type="button"
            onClick={() => (!user ? openAuthModal('signup') : navigate('/mood/chill'))}
            className="bg-white text-black font-bold text-xs px-3.5 py-1 rounded-full hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            {user ? 'Explore Mixes' : 'Create playlist'}
          </button>
        </div>
      </div>

      {/* Bottom Section: Legal Links & Language Switcher */}
      <div className="pt-4 space-y-3 px-1 border-t border-[#202020]">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-[#71717a]">
          <span className="hover:text-white hover:underline cursor-pointer">Legal</span>
          <span className="hover:text-white hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white hover:underline cursor-pointer">Cookies</span>
          <span className="hover:text-white hover:underline cursor-pointer">About Ads</span>
          <span className="hover:text-white hover:underline cursor-pointer">Accessibility</span>
        </div>

        <div>
          <button
            type="button"
            className="flex items-center gap-1.5 border border-[#444] hover:border-white px-3 py-1 rounded-full text-xs font-bold text-white transition hover:scale-105 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>English</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
