import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MusicContext } from './context';
import { MOOD_CATEGORIES, ALL_SONGS, POPULAR_ARTISTS, POPULAR_ALBUMS } from '../data/mockSongs';
import { searchSongsFromApi, MOOD_SEARCH_TERMS } from '../services/musicApi';
import { analyzeMoodPrompt } from '../services/aiService';

const LIKED_SONGS_KEY = 'ai_music_liked_songs';

export const MusicProvider = ({ children }) => {
  // 1. Core State
  const [songs, setSongs] = useState(ALL_SONGS);
  const [currentSong, setCurrentSong] = useState(ALL_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(ALL_SONGS[0]?.rawDuration || 210);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // 2. Liked Songs Storage
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(LIKED_SONGS_KEY);
      return saved ? JSON.parse(saved) : [ALL_SONGS[0], ALL_SONGS[1], ALL_SONGS[7]];
    } catch {
      return [ALL_SONGS[0], ALL_SONGS[1], ALL_SONGS[7]];
    }
  });

  // 3. Search, Mood, Selected Artist & Selected Album Filters
  const [activeMood, setActiveMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // 4. AI Mood State
  const [aiState, setAiState] = useState({
    isActive: false,
    isGenerating: false,
    prompt: '',
    result: null,
  });

  // 5. Audio Engine & References
  const audioRef = useRef(new Audio());
  const repeatRef = useRef(isRepeat);
  const songsRef = useRef(songs);
  const displayedSongsRef = useRef(songs);
  const currentSongRef = useRef(currentSong);
  const isShuffleRef = useRef(isShuffle);
  const handleNextRef = useRef(() => {});

  // Keep refs in sync
  useEffect(() => {
    repeatRef.current = isRepeat;
  }, [isRepeat]);

  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  // Keep audio.src primed with currentSong so play button works immediately
  useEffect(() => {
    const audio = audioRef.current;
    if (currentSong?.audioUrl && (!audio.src || !audio.src.includes(currentSong.audioUrl))) {
      audio.src = currentSong.audioUrl;
      audio.load();
    }
  }, [currentSong]);

  // 6. Play / Pause a Specific Song
  const playSong = useCallback((song) => {
    if (!song || !song.audioUrl) return;
    const audio = audioRef.current;

    // Toggle if clicking same song AND audio source is already loaded
    if (currentSongRef.current?.id === song.id && audio.src && audio.src.includes(song.audioUrl)) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play().catch((err) => {
          console.warn('Audio play error:', err);
          setIsPlaying(false);
        });
      }
      return;
    }

    // New song selected OR audio source needs to be set
    setCurrentSong(song);
    setDuration(song.rawDuration || 210);
    audio.src = song.audioUrl;
    audio.currentTime = 0;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback error:', err.message);
        setIsPlaying(false);
      });
    }
  }, []);

  // 7. Global Play / Pause Toggle
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!currentSong) {
      const activeList = displayedSongsRef.current.length > 0 ? displayedSongsRef.current : songs;
      if (activeList.length > 0) {
        playSong(activeList[0]);
      }
      return;
    }

    // If audio element has not loaded currentSong yet, load and play it
    if (!audio.src || !audio.src.includes(currentSong.audioUrl)) {
      playSong(currentSong);
      return;
    }

    if (!audio.paused) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  }, [currentSong, songs, playSong]);

  // 8. Next Song Handler (from current active playlist queue)
  const handleNext = useCallback(() => {
    const list = displayedSongsRef.current.length > 0
      ? displayedSongsRef.current
      : (songsRef.current.length > 0 ? songsRef.current : ALL_SONGS);
    if (list.length === 0) return;

    if (isShuffleRef.current) {
      const randomIdx = (Date.now() + Math.floor(performance.now())) % list.length;
      playSong(list[randomIdx]);
      return;
    }

    const currentIndex = list.findIndex((s) => s.id === currentSongRef.current?.id);
    const nextIndex = (currentIndex + 1) % list.length;
    playSong(list[nextIndex]);
  }, [playSong]);

  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

  // 9. Previous Song Handler (from current active playlist queue)
  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const list = displayedSongsRef.current.length > 0
      ? displayedSongsRef.current
      : (songsRef.current.length > 0 ? songsRef.current : ALL_SONGS);
    if (list.length === 0) return;

    const currentIndex = list.findIndex((s) => s.id === currentSongRef.current?.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    playSong(list[prevIndex]);
  }, [playSong]);

  // 10. Search Songs via API
  const searchSongs = useCallback(async (query) => {
    setSearchQuery(query);
    if (!query || !query.trim()) {
      if (activeMood === 'liked') {
        return;
      }
      const term = MOOD_SEARCH_TERMS[activeMood] || MOOD_SEARCH_TERMS.all;
      setIsLoading(true);
      const results = await searchSongsFromApi(term, 24);
      setSongs(results.length > 0 ? results : ALL_SONGS);
      setIsLoading(false);
      return;
    }

    // Active search: clear artist/album views so search results display cleanly
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setActiveMood('all');
    setAiState((prev) => ({ ...prev, isActive: false }));

    setIsLoading(true);
    const results = await searchSongsFromApi(query, 30);
    setSongs(results.length > 0 ? results : ALL_SONGS);
    setIsLoading(false);
  }, [activeMood]);

  // 11. Change Mood Category & Fetch Mood Songs
  const changeMood = useCallback(async (moodId) => {
    setActiveMood(moodId);
    setSearchQuery('');
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setAiState((prev) => ({ ...prev, isActive: false }));

    if (moodId === 'liked') {
      return;
    }

    const searchTerm = MOOD_SEARCH_TERMS[moodId] || MOOD_SEARCH_TERMS.all;
    setIsLoading(true);
    const results = await searchSongsFromApi(searchTerm, 24);
    setSongs(results.length > 0 ? results : ALL_SONGS);
    setIsLoading(false);
  }, []);

  // Reset all filters and go back to clean Home page
  const resetToHome = useCallback(() => {
    setSelectedArtist(null);
    setSelectedAlbum(null);
    setSearchQuery('');
    setAiState({
      isActive: false,
      isGenerating: false,
      prompt: '',
      result: null,
    });
    changeMood('all');
  }, [changeMood]);

  // 12. Select Specific Famous Artist & Fetch Live Discography
  const selectArtist = useCallback(async (artist, autoPlay = false) => {
    if (!artist) return;
    setSelectedArtist(artist);
    setSelectedAlbum(null);
    setActiveMood('artist');
    setSearchQuery('');
    setAiState((prev) => ({ ...prev, isActive: false }));

    setIsLoading(true);
    const artistQuery = `${artist.name} songs top hits`;
    const results = await searchSongsFromApi(artistQuery, 35);
    const finalSongs = results.length > 0 ? results : ALL_SONGS;
    setSongs(finalSongs);
    setIsLoading(false);

    if (finalSongs.length > 0) {
      if (autoPlay) {
        playSong(finalSongs[0]);
      } else {
        setCurrentSong(finalSongs[0]);
      }
    }
  }, [playSong]);

  const clearSelectedArtist = useCallback(() => {
    setSelectedArtist(null);
    changeMood('all');
  }, [changeMood]);

  // 12b. Select Specific Popular Album & Fetch Live Soundtrack
  const selectAlbum = useCallback(async (album, autoPlay = false) => {
    if (!album) return;
    setSelectedAlbum(album);
    setSelectedArtist(null);
    setActiveMood('album');
    setSearchQuery('');
    setAiState((prev) => ({ ...prev, isActive: false }));

    setIsLoading(true);
    const albumQuery = `${album.title} album full soundtrack`;
    const results = await searchSongsFromApi(albumQuery, 35);
    const finalSongs = results.length > 0 ? results : ALL_SONGS;
    setSongs(finalSongs);
    setIsLoading(false);

    if (finalSongs.length > 0) {
      if (autoPlay) {
        playSong(finalSongs[0]);
      } else {
        setCurrentSong(finalSongs[0]);
      }
    }
  }, [playSong]);

  const clearSelectedAlbum = useCallback(() => {
    setSelectedAlbum(null);
    changeMood('all');
  }, [changeMood]);

  // 13. AI Mood Search Handler
  const triggerAiMood = useCallback(async (promptText) => {
    if (!promptText.trim()) return;

    setSelectedArtist(null);
    setAiState({
      isActive: true,
      isGenerating: true,
      prompt: promptText,
      result: null,
    });
    setIsLoading(true);

    try {
      const aiAnalysis = await analyzeMoodPrompt(promptText);
      const searchQueryText = `${aiAnalysis.mood} bollywood ${promptText}`;
      const apiResults = await searchSongsFromApi(searchQueryText, 25);
      const finalSongs = apiResults.length > 0 ? apiResults : ALL_SONGS;

      setSongs(finalSongs);
      setActiveMood(aiAnalysis.mood);
      setAiState({
        isActive: true,
        isGenerating: false,
        prompt: promptText,
        result: {
          ...aiAnalysis,
          playlist: finalSongs,
        },
      });

      if (finalSongs.length > 0) {
        playSong(finalSongs[0]);
      }
    } catch (err) {
      console.error('AI Mood Error:', err);
      setAiState((prev) => ({ ...prev, isGenerating: false }));
    } finally {
      setIsLoading(false);
    }
  }, [playSong]);

  const clearAiMood = useCallback(() => {
    setAiState({
      isActive: false,
      isGenerating: false,
      prompt: '',
      result: null,
    });
    changeMood('all');
  }, [changeMood]);

  // 14. Fetch Initial Songs on Component Mount
  useEffect(() => {
    async function loadInitialSongs() {
      setIsLoading(true);
      const apiSongs = await searchSongsFromApi(MOOD_SEARCH_TERMS.all, 24);
      if (apiSongs.length > 0) {
        setSongs(apiSongs);
        setCurrentSong(apiSongs[0]);
        setDuration(apiSongs[0].rawDuration || 210);
      }
      setIsLoading(false);
    }
    loadInitialSongs();
  }, []);

  // 15. Setup Robust HTML5 Audio Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      } else if (currentSongRef.current?.rawDuration) {
        setDuration(currentSongRef.current.rawDuration);
      }
    };
    const handleEnded = () => {
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextRef.current();
      }
    };
    const handleError = (e) => {
      console.warn('Audio streaming notice:', e);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // 16. Volume & Mute Sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 17. Seek Function
  const seekTo = useCallback((seconds) => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = seconds;
        setCurrentTime(seconds);
      } catch (err) {
        console.warn('Seek notice:', err);
      }
    }
  }, []);

  // 18. Volume Function
  const changeVolume = useCallback((val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  }, []);

  // 19. Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // 20. Toggle Like Song with Full Song Persistence
  const toggleLike = useCallback((songOrId) => {
    setLikedSongs((prev) => {
      let updated;
      const targetId = typeof songOrId === 'object' ? songOrId.id : songOrId;
      const isAlreadyLiked = prev.some((s) => s.id === targetId);

      if (isAlreadyLiked) {
        updated = prev.filter((s) => s.id !== targetId);
      } else {
        const fullSong =
          typeof songOrId === 'object'
            ? songOrId
            : songsRef.current.find((s) => s.id === targetId) ||
              ALL_SONGS.find((s) => s.id === targetId);
        updated = fullSong ? [...prev, fullSong] : prev;
      }

      localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const likedSongIds = useMemo(() => likedSongs.map((s) => s.id), [likedSongs]);

  const currentMoodObj = useMemo(() => {
    if (activeMood === 'liked') {
      return {
        id: 'liked',
        label: 'Liked Songs',
        emoji: '💖',
        gradient: 'from-rose-950/50 via-[#121212] to-[#121212]',
      };
    }
    if (activeMood === 'artist' && selectedArtist) {
      return {
        id: 'artist',
        label: selectedArtist.name,
        emoji: '🎤',
        gradient: 'from-indigo-950/60 via-[#161616] to-[#121212]',
      };
    }
    if (activeMood === 'album' && selectedAlbum) {
      return {
        id: 'album',
        label: selectedAlbum.title,
        emoji: '💿',
        gradient: 'from-amber-950/60 via-[#161616] to-[#121212]',
      };
    }
    return MOOD_CATEGORIES.find((m) => m.id === activeMood) || MOOD_CATEGORIES[0];
  }, [activeMood, selectedArtist, selectedAlbum]);

  // If in Liked Songs view, displayedSongs is likedSongs
  const displayedSongs = useMemo(() => {
    if (activeMood === 'liked') {
      return likedSongs;
    }
    return songs;
  }, [activeMood, likedSongs, songs]);

  // Keep displayedSongsRef updated for audio Next/Prev queue
  useEffect(() => {
    displayedSongsRef.current = displayedSongs;
  }, [displayedSongs]);

  const contextValue = useMemo(() => ({
    songs,
    displayedSongs,
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedSongs,
    likedSongIds,
    activeMood,
    selectedArtist,
    selectedAlbum,
    popularArtists: POPULAR_ARTISTS,
    popularAlbums: POPULAR_ALBUMS,
    currentMoodObj,
    searchQuery,
    aiState,
    playSong,
    togglePlayPause,
    handleNext,
    handlePrev,
    seekTo,
    changeVolume,
    toggleMute,
    setIsShuffle: () => setIsShuffle((prev) => !prev),
    setIsRepeat: () => setIsRepeat((prev) => !prev),
    toggleLike,
    setActiveMood: changeMood,
    selectArtist,
    clearSelectedArtist,
    selectAlbum,
    clearSelectedAlbum,
    resetToHome,
    searchSongs,
    setSearchQuery,
    triggerAiMood,
    clearAiMood,
  }), [
    songs,
    displayedSongs,
    currentSong,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    likedSongs,
    likedSongIds,
    activeMood,
    selectedArtist,
    selectedAlbum,
    currentMoodObj,
    searchQuery,
    aiState,
    playSong,
    togglePlayPause,
    handleNext,
    handlePrev,
    seekTo,
    changeVolume,
    toggleMute,
    toggleLike,
    changeMood,
    selectArtist,
    clearSelectedArtist,
    selectAlbum,
    clearSelectedAlbum,
    resetToHome,
    searchSongs,
    setSearchQuery,
    triggerAiMood,
    clearAiMood,
  ]);

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};
