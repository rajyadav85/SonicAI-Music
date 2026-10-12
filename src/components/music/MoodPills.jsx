import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOOD_CATEGORIES } from '../../data/mockSongs';
import { useMusic } from '../../context/useMusic';

/**
 * 🏷️ MoodPills Component
 * ----------------------------------------------------
 * Horizontal filter tabs for quick mood playlists.
 */
const MoodPills = () => {
  const navigate = useNavigate();
  const { activeMood, setActiveMood, isLoading } = useMusic();

  const handleMoodClick = (catId) => {
    setActiveMood(catId);
    if (catId === 'all') {
      navigate('/');
    } else {
      navigate(`/mood/${catId}`);
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none select-none">
      {MOOD_CATEGORIES.map((cat) => {
        const isActive = activeMood === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleMoodClick(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60 ${
              isActive
                ? 'bg-white text-black scale-105 shadow-white/10 font-bold'
                : 'bg-[#232323] hover:bg-[#2e2e2e] text-[#e0e0e0] hover:text-white hover:scale-102 border border-white/5'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodPills;
