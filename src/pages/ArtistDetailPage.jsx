import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMusic } from '../context/useMusic';
import { useAuth } from '../context/useAuth';
import { POPULAR_ARTISTS } from '../data/mockSongs';
import ArtistAvatar from '../components/music/ArtistAvatar';
import SongCard from '../components/music/SongCard';
import {
  Users,
  Play,
  Pause,
  Heart,
  CheckCircle2,
  ArrowLeft,
  Music2,
  Loader2,
} from 'lucide-react';

/**
 * 🎤 ArtistDetailPage Component (`/artist/:artistId`)
 * ----------------------------------------------------
 * Dedicated page for a specific singer containing:
 * 1. Verified Artist Hero Banner
 * 2. Play Top Hits Button
 * 3. Top Anthems chips
 * 4. Numbered Tracklist Table
 * 5. Full Playable Discography Grid
 */
const ArtistDetailPage = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();

  const {
    displayedSongs,
    currentSong,
    isPlaying,
    isLoading,
    playSong,
    selectArtist,
    selectedArtist,
    searchSongs,
    likedSongIds,
    toggleLike,
  } = useMusic();

  const { user, openAuthModal } = useAuth();

  // Find target artist from dataset
  const artist = useMemo(() => {
    return (
      POPULAR_ARTISTS.find(
        (a) => a.id.toLowerCase() === (artistId || '').toLowerCase()
      ) || POPULAR_ARTISTS[0]
    );
  }, [artistId]);

  // Load artist discography if not already active
  useEffect(() => {
    if (artist && selectedArtist?.id !== artist.id) {
      selectArtist(artist);
    }
  }, [artist, selectedArtist, selectArtist]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Grand Artist Profile Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-[#181818] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/artists')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 text-xs font-semibold text-[#a7a7a7] hover:text-white border border-white/10 transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Artists</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Singer HD Photo */}
          <div className="relative aspect-square w-36 sm:w-44 rounded-full overflow-hidden shadow-2xl shadow-purple-950/60 border-4 border-white/20 shrink-0 bg-[#242424]">
            <ArtistAvatar name={artist.name} img={artist.img} />
          </div>

          {/* Singer Info & Actions */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                Verified Artist
              </span>
              <span className="text-xs text-[#a1a1aa] font-medium">
                {artist.monthlyListeners} monthly listeners
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#c4b5fd] font-medium">
              {artist.role}
            </p>

            {/* Top Hits Tags */}
            {artist.topHits && artist.topHits.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-xs text-[#71717a] font-semibold">Top Anthems:</span>
                {artist.topHits.map((hit) => (
                  <span
                    key={hit}
                    onClick={() => searchSongs(hit)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-xs text-[#e2e8f0] border border-white/10 cursor-pointer transition"
                  >
                    {hit}
                  </span>
                ))}
              </div>
            )}

            {/* Play All Button */}
            <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={() => displayedSongs.length > 0 && playSong(displayedSongs[0])}
                className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-green-950/50 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play {artist.name}'s Top Hits</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Numbered Top 10 Tracks Table */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 bg-[#181818]/60 rounded-2xl border border-white/5">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm text-[#a1a1aa] font-medium">Fetching tracks for {artist.name}...</p>
        </div>
      ) : displayedSongs.length > 0 && (
        <div className="bg-[#181818]/90 rounded-2xl p-4 sm:p-6 border border-white/5 space-y-3 shadow-xl">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 px-1">
            <Music2 className="w-4 h-4 text-[#1ed760]" />
            <span>Popular Songs by {artist.name}</span>
          </h3>

          <div className="space-y-1">
            {displayedSongs.slice(0, 10).map((song, idx) => {
              const isCurrent = currentSong?.id === song.id;
              const isThisPlaying = isCurrent && isPlaying;
              const isLiked = likedSongIds.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group ${
                    isCurrent ? 'bg-white/10 text-[#1ed760]' : 'text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span className="w-5 text-center text-xs font-bold text-[#71717a] group-hover:hidden">
                      {idx + 1}
                    </span>
                    <button
                      type="button"
                      className="w-5 hidden group-hover:flex items-center justify-center text-white"
                    >
                      {isThisPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#242424]">
                      <img
                        src={song.img}
                        alt={song.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 pr-2">
                      <p
                        className={`font-semibold text-xs sm:text-sm truncate ${
                          isCurrent ? 'text-[#1ed760]' : 'text-white'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-[11px] text-[#a7a7a7] truncate">{song.artists}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="hidden md:inline text-xs text-[#a7a7a7] max-w-[140px] truncate">
                      {song.album || 'Single'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          openAuthModal('login');
                          return;
                        }
                        toggleLike(song);
                      }}
                      className="text-[#71717a] hover:text-white transition p-1"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-red-500 text-red-500' : 'text-[#71717a]'
                        }`}
                      />
                    </button>
                    <span className="text-xs text-[#71717a] tabular-nums">{song.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. All Discography Cards Grid */}
      {displayedSongs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Complete Discography Collection ({displayedSongs.length} Tracks)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedSongs.map((song) => (
              <SongCard key={song.id} song={song} className="w-full" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtistDetailPage;
