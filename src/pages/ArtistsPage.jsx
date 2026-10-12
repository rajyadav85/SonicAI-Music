import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/useMusic';
import { POPULAR_ARTISTS } from '../data/mockSongs';
import ArtistAvatar from '../components/music/ArtistAvatar';
import { Users, Play, CheckCircle2, Search, ArrowLeft } from 'lucide-react';

/**
 * 🎤 ArtistsPage Component (`/artists` or `/popular-artists`)
 * ----------------------------------------------------
 * Dedicated full-page view showcasing all iconic playback singers.
 */
const ArtistsPage = () => {
  const navigate = useNavigate();
  const { selectArtist } = useMusic();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredArtists = POPULAR_ARTISTS.filter(
    (a) =>
      a.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleArtistClick = (artist) => {
    selectArtist(artist);
    navigate(`/artist/${artist.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 📌 Header & Live Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
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
            <Users className="w-7 h-7 text-purple-400" />
            Popular Artists & Singers
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] mt-1">
            Explore {POPULAR_ARTISTS.length} legendary voices of Indian cinema and their top hit discographies
          </p>
        </div>

        {/* 🔍 Search in Artists Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search singer name..."
            className="w-full h-9 pl-9 pr-3 rounded-full bg-[#1e1e1e] hover:bg-[#252525] focus:bg-[#282828] text-xs text-white placeholder-[#71717a] border border-white/10 focus:border-purple-500/50 focus:outline-none transition"
          />
        </div>
      </div>

      {/* 🎴 Full Responsive Grid of Artists */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => handleArtistClick(artist)}
            className="group bg-[#181818] hover:bg-[#282828] p-3.5 rounded-2xl transition-all duration-300 cursor-pointer relative select-none border border-white/5 hover:border-purple-500/30 hover:scale-[1.02]"
          >
            {/* 🖼️ Avatar Image Container */}
            <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 bg-[#242424] shadow-md">
              <div className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <ArtistAvatar name={artist.name} img={artist.img} />
              </div>

              {/* 🟢 Green Play Button on Hover */}
              <button
                type="button"
                aria-label={`Play ${artist.name}`}
                className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              >
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </button>
            </div>

            {/* 🏷️ Info */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <h3 className="font-bold text-sm truncate text-white group-hover:text-purple-300 transition-colors">
                  {artist.name}
                </h3>
                {artist.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-400/20" />
                )}
              </div>

              <p className="text-[11px] text-[#a7a7a7] truncate font-medium">
                {artist.role}
              </p>

              <div className="pt-1">
                <span className="inline-block text-[10px] text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  {artist.monthlyListeners} Listeners
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
