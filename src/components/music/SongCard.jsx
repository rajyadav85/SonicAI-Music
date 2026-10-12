import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import { useAuth } from '../../context/useAuth';

/**
 * 🎵 SongCard Component
 * ----------------------------------------------------
 * Renders an individual song card with:
 * 1. Song cover thumbnail with zoom effect on hover
 * 2. Animated equalizer bars when the song is currently playing
 * 3. Green Spotify-style floating Play/Pause button
 * 4. Quick Like (Heart) button with login guard
 * 5. Song Title, Artists, and Mood/Genre badge
 * 
 * @param {Object} props.song - Song data object
 */
const SongCard = ({ song, className = '' }) => {
  // 1. Extract music player controls and auth state from context
  const { currentSong, isPlaying, playSong, likedSongIds, toggleLike } = useMusic();
  const { user, openAuthModal } = useAuth();

  // 2. Computed status flags
  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isLiked = likedSongIds.includes(song.id);

  // 3. Handle Like button click (requires login)
  const handleLikeClick = (e) => {
    e.stopPropagation(); // Stop card click from triggering playSong
    if (!user) {
      openAuthModal('login');
      return;
    }
    toggleLike(song);
  };

  return (
    <div
      onClick={() => playSong(song)}
      className={`group ${
        className || 'w-40 sm:w-44 flex-shrink-0'
      } bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all duration-300 cursor-pointer relative select-none border ${
        isCurrent ? 'border-purple-500/50 shadow-lg shadow-purple-950/30' : 'border-transparent'
      }`}
    >
      {/* 🖼️ Thumbnail Container */}
      <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424]">
        <img
          src={song.img}
          alt={song.title}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80';
          }}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isThisPlaying ? 'scale-105' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* 📊 Playing Animated Equalizer Bars */}
        {isThisPlaying && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-1">
            <span className="w-1.5 h-6 bg-[#1ed760] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-8 bg-[#1ed760] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-4 bg-[#1ed760] rounded-full animate-bounce"></span>
          </div>
        )}

        {/* 🟢 Green Spotify Play/Pause Floating Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playSong(song);
          }}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
          className={`absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer ${
            isThisPlaying
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 text-black fill-black" />
          ) : (
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          )}
        </button>

        {/* ❤️ Quick Like Heart Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition cursor-pointer ${
            isLiked ? 'text-red-500 opacity-100' : 'text-white/70 opacity-0 group-hover:opacity-100 hover:text-white'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* 🏷️ Title & Artists */}
      <h3
        className={`font-semibold text-sm truncate mb-1 transition-colors ${
          isCurrent ? 'text-[#1ed760] font-bold' : 'text-white group-hover:text-white'
        }`}
      >
        {song.title}
      </h3>

      <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed flex items-center gap-1">
        {song.isExplicit && (
          <span className="inline-block bg-[#a7a7a7] text-black font-bold text-[9px] px-1 rounded-sm leading-tight shrink-0">
            E
          </span>
        )}
        <span className="truncate">{song.artists}</span>
      </p>

      {/* ⏱️ Mood / Genre & Duration Badges */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-[#71717a]">
        <span className="capitalize px-2 py-0.5 rounded-full bg-[#202020] text-[#a1a1aa] font-medium border border-white/5 truncate max-w-[90px]">
          {song.mood || song.genre || 'Music'}
        </span>
        <span className="shrink-0">{song.duration}</span>
      </div>
    </div>
  );
};

export default SongCard;
