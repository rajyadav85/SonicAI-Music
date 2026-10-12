import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/useMusic';
import { POPULAR_ALBUMS } from '../data/mockSongs';
import { Disc, Play, Sparkles, Heart, Flame, Radio, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Soundtracks', icon: Sparkles },
  { id: 'blockbuster', label: 'Mega Blockbusters', icon: Flame },
  { id: 'romantic', label: 'Romantic Classics', icon: Heart },
  { id: 'punjabi', label: 'Punjabi & Hype', icon: Radio },
];

/**
 * 💿 AlbumsPage Component (`/albums` or `/popular-albums`)
 * ----------------------------------------------------
 * Dedicated full-page view showcasing all iconic movie albums & soundtracks.
 */
const AlbumsPage = () => {
  const navigate = useNavigate();
  const { selectAlbum } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAlbums =
    selectedCategory === 'all'
      ? POPULAR_ALBUMS
      : POPULAR_ALBUMS.filter((a) => a.category === selectedCategory);

  const handleAlbumClick = (album) => {
    selectAlbum(album);
    navigate(`/album/${album.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 📌 Header & Category Filter Bar */}
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
            <Disc className="w-7 h-7 text-purple-400" />
            Popular Albums & Soundtracks
          </h1>
          <p className="text-xs sm:text-sm text-[#71717a] mt-1">
            Browse {POPULAR_ALBUMS.length} superhit Bollywood motion picture albums with full sequential audio
          </p>
        </div>

        {/* 🏷️ Filter Pills with Search Gradient active state */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold shadow-lg shadow-purple-950/50 scale-[1.03] border-transparent'
                    : 'bg-[#202020] hover:bg-[#282828] text-[#a1a1aa] hover:text-white border border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🎴 Full Responsive Grid of Albums */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            onClick={() => handleAlbumClick(album)}
            className="group bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all duration-300 cursor-pointer relative select-none border border-transparent hover:border-purple-500/30 hover:scale-[1.02]"
          >
            {/* 🖼️ Album Cover Thumbnail */}
            <div className="relative aspect-square w-full rounded-md overflow-hidden mb-3 bg-[#242424]">
              <img
                src={album.img}
                alt={album.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* 🟢 Floating Play Button on Hover */}
              <button
                type="button"
                aria-label={`Play ${album.title}`}
                className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              >
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </button>
            </div>

            {/* 🏷️ Info */}
            <h3 className="font-semibold text-sm truncate mb-1 transition-colors text-white group-hover:text-purple-300">
              {album.title}
            </h3>

            <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed">
              {album.artists}
            </p>

            {/* ⏱️ Badges */}
            <div className="mt-2 flex items-center justify-between text-[10px] text-[#71717a]">
              <span className="px-2 py-0.5 rounded-full bg-[#202020] text-[#a1a1aa] font-medium border border-white/5 truncate max-w-[90px]">
                {album.trackCount || 'Album'}
              </span>
              <span className="shrink-0 font-medium">{album.year}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumsPage;
