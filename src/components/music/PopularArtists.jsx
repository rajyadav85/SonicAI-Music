import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/useMusic';
import { POPULAR_ARTISTS } from '../../data/mockSongs';
import ArtistAvatar from './ArtistAvatar';
import { Users, Play, CheckCircle2, ChevronRight } from 'lucide-react';

/**
 * 🎤 PopularArtists Component
 * ----------------------------------------------------
 * Displays a horizontal carousel of popular playback singers.
 * When clicked:
 * 1. Calls selectArtist(artist) to load the singer's verified discography.
 * 2. Navigates to `/artist/:artistId`.
 */
const PopularArtists = () => {
  const navigate = useNavigate();
  const { selectedArtist, selectArtist } = useMusic();

  const handleArtistClick = (artist) => {
    selectArtist(artist, false);
    navigate(`/artist/${artist.id}`);
  };

  const handlePlayArtist = (e, artist) => {
    e.stopPropagation();
    selectArtist(artist, true);
  };

  return (
    <section id="popular-artists-section" className="space-y-4">
      {/* 📌 Section Title Header with "See All" link */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Popular Artists & Singers
          </h2>
          <p className="text-xs text-[#71717a]">
            Click on any singer to load their verified discography & top hit tracks
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/artists')}
          className="flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
        >
          <span>See All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 🎠 Horizontal Carousel of Artist Cards */}
      <div className="flex items-start gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#282828] scrollbar-track-transparent select-none">
        {POPULAR_ARTISTS.map((artist) => {
          const isThisSelected = selectedArtist?.id === artist.id;
          return (
            <div
              key={artist.id}
              onClick={() => handleArtistClick(artist)}
              className={`group w-40 sm:w-44 flex-shrink-0 bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all duration-300 cursor-pointer relative select-none border ${
                isThisSelected
                  ? 'border-purple-500/50 shadow-lg shadow-purple-950/30'
                  : 'border-transparent'
              }`}
            >
              {/* 🖼️ Singer Round Avatar with Hover Play Button */}
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 bg-[#242424]">
                <div className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                  <ArtistAvatar name={artist.name} img={artist.img} />
                </div>

                {/* 🟢 Green Spotify Play Button on Hover */}
                <button
                  type="button"
                  onClick={(e) => handlePlayArtist(e, artist)}
                  aria-label={`Play ${artist.name}`}
                  className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </button>
              </div>

              {/* 🏷️ Singer Info & Verified Badge */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-sm truncate text-white group-hover:text-white transition-colors">
                    {artist.name}
                  </h3>
                  {artist.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-400/20" />
                  )}
                </div>

                <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed">
                  {artist.role}
                </p>

                {/* 📊 Monthly Listeners Badge */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#71717a]">
                  <span className="px-2 py-0.5 rounded-full bg-[#202020] text-[#a1a1aa] font-medium border border-white/5 truncate max-w-[100px]">
                    {artist.monthlyListeners}
                  </span>
                  <span className="text-[#71717a] font-medium">Singer</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularArtists;
