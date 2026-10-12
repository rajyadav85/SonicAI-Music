import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../../context/useMusic';
import { POPULAR_ALBUMS } from '../../data/mockSongs';
import { Disc, Play, Sparkles, Heart, Flame, Radio, ChevronRight } from 'lucide-react';

/**
 * 🏷️ Category Filter Definitions
 */
const CATEGORIES = [
  { id: 'all', label: 'All Soundtracks', icon: Sparkles },
  { id: 'blockbuster', label: 'Mega Blockbusters', icon: Flame },
  { id: 'romantic', label: 'Romantic Classics', icon: Heart },
  { id: 'punjabi', label: 'Punjabi & Hype', icon: Radio },
];

/**
 * 💿 PopularAlbums Component
 * ----------------------------------------------------
 * Displays Bollywood blockbuster albums and soundtracks.
 * Features:
 * 1. Category Filter Pills (All, Blockbusters, Romantic, Punjabi)
 * 2. Horizontal Scrollable Album Cards with SongCard design
 * 3. 1-Click album selection -> navigates to `/album/:albumId`
 */
const PopularAlbums = () => {
  const navigate = useNavigate();
  const { selectedAlbum, selectAlbum } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAlbums =
    selectedCategory === 'all'
      ? POPULAR_ALBUMS
      : POPULAR_ALBUMS.filter((a) => a.category === selectedCategory);

  const handleAlbumClick = (album) => {
    selectAlbum(album, false);
    navigate(`/album/${album.id}`);
  };

  const handlePlayAlbum = (e, album) => {
    e.stopPropagation();
    selectAlbum(album, true);
  };

  return (
    <section id="popular-albums-section" className="space-y-4">
      {/* 📌 Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Disc className="w-5 h-5 text-purple-400" />
              Popular Albums & Soundtracks
            </h2>
            <p className="text-xs text-[#71717a]">
              Click on any iconic album to play its complete sequential soundtrack
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/albums')}
            className="sm:hidden flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 🏷️ Filter Pills with Search Gradient active state + Desktop See All */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
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

          <button
            type="button"
            onClick={() => navigate('/albums')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition shrink-0 pl-2 cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 🎠 Horizontal Carousel of Album Cards */}
      <div className="flex items-start gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-[#282828] scrollbar-track-transparent select-none">
        {filteredAlbums.map((album) => {
          const isThisSelected = selectedAlbum?.id === album.id;
          return (
            <div
              key={album.id}
              onClick={() => handleAlbumClick(album)}
              className={`group w-40 sm:w-44 flex-shrink-0 bg-[#181818] hover:bg-[#282828] p-3 rounded-lg transition-all duration-300 cursor-pointer relative select-none border ${
                isThisSelected
                  ? 'border-purple-500/50 shadow-lg shadow-purple-950/30'
                  : 'border-transparent'
              }`}
            >
              {/* 🖼️ Album Cover Thumbnail Container */}
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

                {/* 🟢 Floating Green Spotify Play Button on Hover */}
                <button
                  type="button"
                  onClick={(e) => handlePlayAlbum(e, album)}
                  aria-label={`Play ${album.title}`}
                  className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                >
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </button>
              </div>

              {/* 🏷️ Title & Artists */}
              <h3 className="font-semibold text-sm truncate mb-1 transition-colors text-white group-hover:text-white">
                {album.title}
              </h3>

              <p className="text-xs text-[#a7a7a7] line-clamp-2 leading-relaxed">
                {album.artists}
              </p>

              {/* ⏱️ Track Count & Release Year Badges */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-[#71717a]">
                <span className="px-2 py-0.5 rounded-full bg-[#202020] text-[#a1a1aa] font-medium border border-white/5 truncate max-w-[90px]">
                  {album.trackCount || 'Album'}
                </span>
                <span className="shrink-0 font-medium">{album.year}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularAlbums;
