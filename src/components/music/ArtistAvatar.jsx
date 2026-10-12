import React, { useState } from 'react';
import { Mic2, Music } from 'lucide-react';

const GRADIENTS = [
  'from-purple-600 via-indigo-600 to-blue-600',
  'from-rose-600 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-rose-600',
  'from-emerald-500 via-teal-600 to-cyan-600',
  'from-blue-600 via-cyan-600 to-teal-500',
  'from-pink-500 via-rose-500 to-amber-500',
];

const getInitials = (name) => {
  if (!name) return 'A';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getGradientForName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const ArtistAvatar = ({ name, img, className = 'w-full h-full' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const initials = getInitials(name);
  const gradient = getGradientForName(name);

  return (
    <div className={`relative overflow-hidden rounded-full ${className} select-none bg-[#242424]`}>
      {/* 1. If Image is available and hasn't errored */}
      {!hasError && img && (
        <img
          src={img}
          alt={name}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="eager"
        />
      )}

      {/* 2. Beautiful Fallback / Loading State */}
      {(!isLoaded || hasError || !img) && (
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center text-white shadow-inner p-2`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/20 mb-1 backdrop-blur-xs">
            <Mic2 className="w-4 h-4 text-white/90" />
          </div>
          <span className="text-sm font-black tracking-wider text-white drop-shadow-md">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
};

export default ArtistAvatar;
