import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  Sparkles,
  Search,
  Menu,
  X,
  LogOut,
  Heart,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import { useAuth } from '../../context/useAuth';

const Navbar = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchSongs, triggerAiMood, likedSongIds, resetToHome } = useMusic();
  const { user, isAuthenticated, openAuthModal, logout, authToast } = useAuth();

  const [searchInput, setSearchInput] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to determine if input expresses an explicit mood/vibe sentiment
  const isMoodPrompt = (text) => {
    const lower = text.toLowerCase().trim();
    return /\b(mood|vibe|vibes|feeling|feel like|lag raha|sunne ka mann|romantic vibe|party vibe|chill vibe|sad vibe)\b/i.test(
      lower
    );
  };

  // ⚡ Live Real-Time Search (Debounced 350ms)
  useEffect(() => {
    const query = searchInput.trim();

    if (!query) {
      searchSongs('');
      return;
    }

    const debounceTimer = setTimeout(() => {
      // Auto-navigate to home so search results are instantly visible
      if (location.pathname !== '/') {
        navigate('/');
      }

      if (isMoodPrompt(query)) {
        triggerAiMood(query);
      } else {
        searchSongs(query);
      }
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [searchInput, location.pathname, navigate, searchSongs, triggerAiMood]);

  // Handle Form Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();

    if (!query) {
      searchSongs('');
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
    }

    if (isMoodPrompt(query)) {
      triggerAiMood(query);
    } else {
      searchSongs(query);
    }
  };

  const handleClear = () => {
    setSearchInput('');
    searchSongs('');
  };

  return (
    <>
      <header className="sticky top-0 z-30 py-3.5 bg-[#121212]/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-3 border-b border-[#242424] select-none">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-[#282828] text-[#b3b3b3] hover:text-white transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => {
              resetToHome();
              navigate('/');
            }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">AI Mood Music</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Center: Live Instant Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl relative flex items-center mx-2"
        >
          <div className="absolute left-3.5 text-[#b3b3b3] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type any songs, artist, your mood..."
            className="w-full h-10 pl-10 pr-24 rounded-full bg-[#242424] text-xs sm:text-sm text-white placeholder-[#757575] border border-transparent focus:border-purple-500/50 focus:bg-[#282828] focus:outline-none hover:bg-[#2a2a2a] transition duration-200"
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 text-[#757575] hover:text-white transition p-1 cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 h-7 px-3.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs hover:scale-105 active:scale-95 transition shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>Search</span>
          </button>
        </form>

        {/* Right: User Auth & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {isAuthenticated && user ? (
            /* Logged In User Profile Pill & Dropdown */
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full bg-[#1f1f1f] hover:bg-[#282828] border border-white/10 transition cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full bg-purple-900/50 object-cover"
                />
                <span className="hidden md:inline-block text-xs font-bold text-white max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#a7a7a7]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-white/5">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-[#71717a] truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/20">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Premium Member</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/liked-songs');
                      }}
                      className="w-full px-3 py-2 text-xs text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        <span>Liked Songs</span>
                      </span>
                      <span className="font-bold text-white">{likedSongIds.length}</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buttons: Sign Up & Log In */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="hidden sm:inline-block text-xs font-bold text-[#b3b3b3] hover:text-white hover:scale-105 px-3 py-2 transition cursor-pointer"
              >
                Sign up
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="h-9 px-4 sm:px-5 rounded-full bg-white text-black text-xs font-extrabold hover:bg-[#f0f0f0] hover:scale-105 active:scale-95 transition shadow-md cursor-pointer"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Floating Auth Notification Toast */}
      {authToast && (
        <div className="fixed top-24 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#222222] border border-white/10 shadow-2xl text-xs font-semibold text-white flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>{authToast.message}</span>
        </div>
      )}
    </>
  );
};

export default Navbar;
