import React from 'react';
import SongCard from './SongCard';
import PopularArtists from './PopularArtists';
import PopularAlbums from './PopularAlbums';
import ArtistAvatar from './ArtistAvatar';
import { useMusic } from '../../context/useMusic';
import { useAuth } from '../../context/useAuth';
import {
  Sparkles,
  Music2,
  Disc,
  Loader2,
  Heart,
  Lock,
  Play,
  Pause,
  CheckCircle2,
  ArrowLeft,
  Shuffle,
} from 'lucide-react';

/**
 * 🎛️ SectionGrid Component (Main Content Manager)
 * ----------------------------------------------------
 * The central dashboard view controller that handles:
 * 1. Authentication Wall when an unauthenticated user views Liked Songs
 * 2. Artist Profile Hero Banner + Top 10 Tracklist Table (when an artist is clicked)
 * 3. Album Profile Hero Banner + Sequential Tracklist Table (when an album is clicked)
 * 4. Active Songs Grid / Carousel (Trending, Moods, Search Results, Liked Songs)
 * 5. Popular Artists Section (<PopularArtists />)
 * 6. Popular Albums Section (<PopularAlbums />)
 */
const SectionGrid = () => {
  const {
    displayedSongs,
    currentSong,
    isPlaying,
    activeMood,
    currentMoodObj,
    searchQuery,
    isLoading,
    searchSongs,
    playSong,
    selectedArtist,
    clearSelectedArtist,
    selectedAlbum,
    clearSelectedAlbum,
    likedSongIds,
    toggleLike,
    setIsShuffle,
  } = useMusic();

  const { user, openAuthModal } = useAuth();

  const isLikedView = activeMood === 'liked';
  const isArtistView = activeMood === 'artist' && selectedArtist;
  const isAlbumView = activeMood === 'album' && selectedAlbum;

  // 1. If User is viewing Liked Songs but NOT logged in -> Show Restricted Login Gate
  if (isLikedView && !user) {
    return (
      <div className="py-20 px-6 rounded-2xl bg-gradient-to-b from-rose-950/40 via-[#181818] to-[#141414] text-center border border-rose-500/20 max-w-lg mx-auto space-y-4 shadow-2xl my-8 select-none">
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
    <div className="space-y-12">
      {/* 2. ARTIST PROFILE HERO BANNER (Shows when a Singer is selected) */}
      {isArtistView && (
        <div className="space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-[#181818] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              type="button"
              onClick={clearSelectedArtist}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 text-xs font-semibold text-[#a7a7a7] hover:text-white border border-white/10 transition mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Songs</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Singer HD Photo */}
              <div className="relative aspect-square w-36 sm:w-44 rounded-full overflow-hidden shadow-2xl shadow-purple-950/60 border-4 border-white/20 shrink-0 bg-[#242424]">
                <ArtistAvatar name={selectedArtist.name} img={selectedArtist.img} />
              </div>

              {/* Singer Info & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    Verified Artist
                  </span>
                  <span className="text-xs text-[#a1a1aa] font-medium">
                    {selectedArtist.monthlyListeners} monthly listeners
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {selectedArtist.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#c4b5fd] font-medium">
                  {selectedArtist.role}
                </p>

                {/* Top Hits Tags */}
                {selectedArtist.topHits && selectedArtist.topHits.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-xs text-[#71717a] font-semibold">Top Anthems:</span>
                    {selectedArtist.topHits.map((hit) => (
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
                    <span>Play {selectedArtist.name}'s Top Hits</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Tracks List Table for Artist */}
          {displayedSongs.length > 0 && (
            <div className="bg-[#181818]/90 rounded-2xl p-4 sm:p-6 border border-white/5 space-y-3 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 px-1">
                <Music2 className="w-4 h-4 text-[#1ed760]" />
                <span>Popular Songs by {selectedArtist.name}</span>
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
        </div>
      )}

      {/* 3. ALBUM PROFILE HERO BANNER (Shows when an Album is selected) */}
      {isAlbumView && (
        <div className="space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/80 via-orange-950/60 to-[#181818] border border-amber-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              type="button"
              onClick={clearSelectedAlbum}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/80 text-xs font-semibold text-[#a7a7a7] hover:text-white border border-white/10 transition mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Songs</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              {/* Album Art with 3D Vinyl Glow */}
              <div className="relative aspect-square w-36 sm:w-44 rounded-2xl overflow-hidden shadow-2xl shadow-amber-950/70 border-2 border-white/20 shrink-0 bg-[#242424]">
                <img
                  src={selectedAlbum.img}
                  alt={selectedAlbum.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Album Info & Actions */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    <Disc className="w-3.5 h-3.5 text-amber-400" />
                    Original Soundtrack
                  </span>
                  <span className="text-xs text-[#a1a1aa] font-medium">
                    {selectedAlbum.year} • {selectedAlbum.trackCount || `${displayedSongs.length} Tracks`}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {selectedAlbum.title}
                </h1>

                <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
                  {selectedAlbum.artists}
                </p>

                {/* Top Hits Tags */}
                {selectedAlbum.topTracks && selectedAlbum.topTracks.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-xs text-[#71717a] font-semibold">Key Anthems:</span>
                    {selectedAlbum.topTracks.map((hit) => (
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

                {/* Play Full Album & Shuffle Buttons */}
                <div className="pt-3 flex items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => displayedSongs.length > 0 && playSong(displayedSongs[0])}
                    className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-green-950/50 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Play Full Album</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsShuffle();
                      if (displayedSongs.length > 0) {
                        const randomIdx = Math.floor(Math.random() * displayedSongs.length);
                        playSong(displayedSongs[randomIdx]);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/10 hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Shuffle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sequential Tracklist Table for Album */}
          {displayedSongs.length > 0 && (
            <div className="bg-[#181818]/90 rounded-2xl p-4 sm:p-6 border border-white/5 space-y-3 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 px-1">
                <Disc className="w-4 h-4 text-amber-400" />
                <span>Complete {selectedAlbum.title} Tracklist</span>
              </h3>

              <div className="space-y-1">
                {displayedSongs.map((song, idx) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isThisPlaying = isCurrent && isPlaying;
                  const isLiked = likedSongIds.includes(song.id);

                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song)}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group ${
                        isCurrent ? 'bg-white/10 text-amber-300' : 'text-white'
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
                              isCurrent ? 'text-amber-300' : 'text-white'
                            }`}
                          >
                            {song.title}
                          </p>
                          <p className="text-[11px] text-[#a7a7a7] truncate">{song.artists}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <span className="hidden md:inline text-xs text-[#a7a7a7] max-w-[140px] truncate">
                          {song.album || selectedAlbum.title}
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
        </div>
      )}

      {/* SECTION 1: LIVE SONGS / MOOD PLAYLIST / ARTIST SONGS / ALBUM SONGS / LIKED SONGS */}
      <section id="songs-section-view">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {searchQuery ? (
                <>
                  <Music2 className="w-5 h-5 text-purple-400" />
                  Search results for "{searchQuery}"
                </>
              ) : isArtistView ? (
                <>
                  <Music2 className="w-5 h-5 text-indigo-400" />
                  All Discography Tracks ({displayedSongs.length})
                </>
              ) : isAlbumView ? (
                <>
                  <Disc className="w-5 h-5 text-amber-400" />
                  All Songs from {selectedAlbum.title} ({displayedSongs.length})
                </>
              ) : isLikedView ? (
                <>
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  Your Liked Songs
                </>
              ) : activeMood === 'all' ? (
                <>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Trending Bollywood & Top Hits
                </>
              ) : (
                <>
                  <span>{currentMoodObj.emoji}</span>
                  {currentMoodObj.label} Songs
                </>
              )}
            </h2>

            {!isLoading && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#242424] text-[#a1a1aa] border border-white/5">
                {displayedSongs.length} {isLikedView ? 'saved' : 'playable'} tracks
              </span>
            )}
          </div>

          {/* Quick Play All button for Liked Songs */}
          {isLikedView && displayedSongs.length > 0 && (
            <button
              type="button"
              onClick={() => playSong(displayedSongs[0])}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black text-xs font-bold transition hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play All</span>
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 bg-[#181818]/60 rounded-2xl border border-white/5">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-[#a1a1aa] font-medium">Fetching tracks from API...</p>
          </div>
        ) : displayedSongs.length === 0 ? (
          /* Empty State */
          <div className="py-14 px-4 rounded-xl bg-[#181818] text-center border border-white/5 space-y-2">
            {isLikedView ? (
              <>
                <Heart className="w-12 h-12 text-rose-500/50 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">No liked songs yet</h3>
                <p className="text-xs text-[#a1a1aa] max-w-sm mx-auto">
                  Click the heart icon on any song card to add it to your personal favorites collection.
                </p>
              </>
            ) : (
              <>
                <Music2 className="w-12 h-12 text-[#71717a] mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">No songs found</h3>
                <p className="text-xs text-[#a1a1aa]">
                  Try searching with another name like "Arijit Singh", "Kishore Kumar", "Sad", or "Romantic".
                </p>
              </>
            )}
          </div>
        ) : (
          /* Songs Horizontal Scrollable Cards */
          <div className="flex items-start gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#282828] scrollbar-track-transparent">
            {displayedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: POPULAR ARTISTS & SINGERS */}
      <PopularArtists />

      {/* SECTION 3: POPULAR ALBUMS & SOUNDTRACKS (Vinyl Record Experience) */}
      <PopularAlbums />
    </div>
  );
};

export default SectionGrid;
