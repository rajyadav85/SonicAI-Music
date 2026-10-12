import React from 'react';
import { Sparkles, X, Play, Loader2 } from 'lucide-react';
import { useMusic } from '../../context/useMusic';

const AiBanner = () => {
  const { aiState, clearAiMood, togglePlayPause, isPlaying } = useMusic();

  if (!aiState.isActive) return null;

  if (aiState.isGenerating) {
    return (
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-pink-900/40 border border-purple-500/30 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0">
          <Loader2 className="w-6 h-6 text-purple-300 animate-spin" />
        </div>
        <div>
          <h4 className="font-bold text-white text-base flex items-center gap-2">
            AI Analyzing your mood: "{aiState.prompt}"
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          </h4>
          <p className="text-xs text-purple-200/80">
            Synthesizing emotional vibe, tempo preference, and curating your personalized playlist...
          </p>
        </div>
      </div>
    );
  }

  const { result } = aiState;
  if (!result) return null;

  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-[#181818] border border-purple-500/40 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Close Button */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>AI Mood Mix Generated</span>
        </div>

        <button
          type="button"
          onClick={clearAiMood}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#b3b3b3] hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Close AI Mix"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{result.moodEmoji}</span>
            <span>{result.title}</span>
          </h2>
          <p className="text-sm text-purple-200/90 mt-1 max-w-xl font-medium">
            {result.reason}
          </p>
          <p className="text-xs text-[#a1a1aa] mt-2 italic">
            Prompt: "{result.prompt}"
          </p>
        </div>

        {/* Play AI Mix Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          className="px-6 py-3 rounded-full bg-[#1ed760] hover:bg-[#1fdf64] text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-900/30 hover:scale-105 active:scale-95 transition shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>{isPlaying ? 'Pause Mix' : 'Play AI Mix'}</span>
        </button>
      </div>
    </div>
  );
};

export default AiBanner;
