import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/useMusic';
import { useAuth } from '../context/useAuth';
import SongCard from '../components/music/SongCard';
import { Heart, Play, Lock, ArrowLeft, Music2 } from 'lucide-react';

/**
 * 💖 LikedSongsPage Component (`/liked-songs`)
 * ----------------------------------------------------
 * Dedicated user personal favorites collection page.
 */
const LikedSongsPage = () => {
  const navigate = useNavigate();
  const { likedSongs, playSong } = useMusic();
  const { user, openAuthModal } = useAuth();

  // 1. Restricted Login Gate for unauthenticated visitors
  if (!user) {
    return (
      <div className="py-20 px-6 rounded-3xl bg-gradient-to-b from-rose-950/40 via-[#181818] to-[#141414] text-center border border-rose-500/20 max-w-lg mx-auto space-y-4 shadow-2xl my-8 select-none animate-in fade-in duration-300">
        <div className="relative w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30 shadow-lg shadow-rose-900/30">
          <Heart className="w-8 h-8 fill-rose-500" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#181818] border border-white/20 flex items-center justify-center">
            <Lock className="w-3 h-3 text-white" />
          </span>
        </div>

        <h2 className="text-2xl font-black text-white">Log in to view your Liked Songs</h2>

        <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
          Save your favorite songs by clicking the heart icon. You need to log in to access your personal collection.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-[#f0f0f0] hover:scale-105 active:scale-95 transition shadow-lg cursor-pointer"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('signup')}
            className="px-6 py-2.5 rounded-full bg-[#242424] hover:bg-[#2c2c2c] text-white font-bold text-xs border border-white/10 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 📌 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a7a7a7] hover:text-white transition mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            Your Liked Songs Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] mt-1">
            {likedSongs.length} saved tracks in your personal music vault
          </p>
        </div>

        {likedSongs.length > 0 && (
          <button
            type="button"
            onClick={() => playSong(likedSongs[0])}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs shadow-xl shadow-green-950/50 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Play All Favorites</span>
          </button>
        )}
      </div>

      {/* 🎴 Saved Songs Grid */}
      {likedSongs.length === 0 ? (
        <div className="py-20 px-4 rounded-2xl bg-[#181818] text-center border border-white/5 space-y-3">
          <Heart className="w-12 h-12 text-rose-500/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No liked songs yet</h3>
          <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
            Click the heart icon on any song card to add it to your personal favorites collection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {likedSongs.map((song) => (
            <SongCard key={song.id} song={song} className="w-full" />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedSongsPage;
