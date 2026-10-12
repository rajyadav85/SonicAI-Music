import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/useMusic';
import { MOOD_CATEGORIES } from '../data/mockSongs';
import MoodPills from '../components/music/MoodPills';
import SongCard from '../components/music/SongCard';
import { ArrowLeft, Play, Loader2 } from 'lucide-react';

/**
 * ☕ MoodPage Component (`/mood/:moodId`)
 * ----------------------------------------------------
 * Dedicated page for mood-filtered song playlists.
 */
const MoodPage = () => {
  const { moodId } = useParams();
  const navigate = useNavigate();

  const {
    displayedSongs,
    activeMood,
    setActiveMood,
    isLoading,
    playSong,
  } = useMusic();

  const moodObj =
    MOOD_CATEGORIES.find((m) => m.id === (moodId || '').toLowerCase()) ||
    MOOD_CATEGORIES[0];

  // Sync mood if route changes
  useEffect(() => {
    if (moodId && activeMood !== moodId) {
      setActiveMood(moodId);
    }
  }, [moodId, activeMood, setActiveMood]);

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
            <span className="text-3xl">{moodObj.emoji}</span>
            {moodObj.label} Playlist
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] mt-1">
            Curated tracks matching your current mood and vibe ({displayedSongs.length} playable songs)
          </p>
        </div>

        {displayedSongs.length > 0 && (
          <button
            type="button"
            onClick={() => playSong(displayedSongs[0])}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs shadow-xl shadow-green-950/50 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Play Mood Mix</span>
          </button>
        )}
      </div>

      {/* Quick Mood Pills Bar */}
      <MoodPills />

      {/* 🎴 Song Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 bg-[#181818]/60 rounded-2xl border border-white/5">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm text-[#a1a1aa] font-medium">Fetching {moodObj.label} songs...</p>
        </div>
      ) : displayedSongs.length === 0 ? (
        <div className="py-20 px-4 rounded-2xl bg-[#181818] text-center border border-white/5">
          <p className="text-sm text-[#a1a1aa]">No songs found for this mood.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {displayedSongs.map((song) => (
            <SongCard key={song.id} song={song} className="w-full" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodPage;
