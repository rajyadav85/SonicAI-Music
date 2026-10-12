import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useMusic } from '../../context/useMusic';
import { useAuth } from '../../context/useAuth';

const formatTime = (secs) => {
  if (isNaN(secs) || secs <= 0) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedSongIds,
    togglePlayPause,
    handleNext,
    handlePrev,
    seekTo,
    changeVolume,
    toggleMute,
    setIsShuffle,
    setIsRepeat,
    toggleLike,
  } = useMusic();

  const { user, openAuthModal } = useAuth();

  if (!currentSong) return null;

  const isLiked = likedSongIds.includes(currentSong.id);
  const totalDuration = duration > 0 ? duration : (currentSong.rawDuration || 0);
  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handleLikeClick = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    toggleLike(currentSong);
  };

  const handleSeekChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * totalDuration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value) / 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#181818]/95 backdrop-blur-2xl border-t border-[#282828] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 z-50 select-none text-white shadow-2xl">
      {/* 1. Left: Track Info & Like Button */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 w-2/5 sm:w-1/4 min-w-0 sm:min-w-[160px]">
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-[#282828] shrink-0 shadow-md">
          <img
            src={currentSong.img}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-3.5 bg-[#1ed760] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-5 bg-[#1ed760] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-2 bg-[#1ed760] rounded-full animate-bounce"></span>
            </div>
          )}
        </div>

        <div className="min-w-0 pr-1 sm:pr-2 flex-1">
          <h4 className="font-semibold text-xs sm:text-sm text-white truncate hover:underline cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-[11px] text-[#a7a7a7] truncate hover:underline cursor-pointer">
            {currentSong.artists}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLikeClick}
          className={`p-1 shrink-0 transition hover:scale-110 cursor-pointer ${
            isLiked ? 'text-red-500' : 'text-[#b3b3b3] hover:text-white'
          }`}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* 2. Center: Controls & Seekbar */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
        {/* Buttons */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Shuffle */}
          <button
            type="button"
            onClick={setIsShuffle}
            className={`hidden sm:block transition cursor-pointer ${
              isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            aria-label="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={handlePrev}
            className="text-[#b3b3b3] hover:text-white transition hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#f0f0f0] text-black flex items-center justify-center transition hover:scale-108 active:scale-95 shadow-md cursor-pointer"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            className="text-[#b3b3b3] hover:text-white transition hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={setIsRepeat}
            className={`hidden sm:block transition cursor-pointer ${
              isRepeat ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
            aria-label="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seekbar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] text-[#a7a7a7] w-8 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>

          <div className="relative flex-1 flex items-center group cursor-pointer">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercent || 0}
              onChange={handleSeekChange}
              className="w-full h-1 bg-[#4d4d4d] group-hover:bg-[#5e5e5e] rounded-full appearance-none cursor-pointer accent-[#1ed760] transition"
            />
          </div>

          <span className="text-[11px] text-[#a7a7a7] w-8 tabular-nums">
            {formatTime(totalDuration)}
          </span>
        </div>
      </div>

      {/* 3. Right: Volume & Mood/Genre Badge */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 sm:w-1/4 sm:min-w-[140px]">
        <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#242424] border border-white/5 text-[11px] text-purple-300 font-medium truncate max-w-[120px]">
          <Sparkles className="w-3 h-3 text-yellow-400 shrink-0" />
          <span className="capitalize truncate">{currentSong.mood || currentSong.genre || currentSong.language || 'Bollywood'}</span>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="text-[#b3b3b3] hover:text-white transition cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume * 100}
          onChange={handleVolumeChange}
          className="hidden sm:block w-20 h-1 bg-[#4d4d4d] hover:bg-[#5e5e5e] rounded-full appearance-none cursor-pointer accent-[#1ed760] transition"
        />
      </div>
    </div>
  );
};

export default PlayerBar;
