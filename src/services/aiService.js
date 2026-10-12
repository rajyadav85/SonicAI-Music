import { ALL_SONGS, MOOD_CATEGORIES } from '../data/mockSongs';

// Intelligent AI Mood Analysis & Recommendation Engine
export const analyzeMoodPrompt = async (prompt) => {
  // Simulate AI latency for realistic UX feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = prompt.toLowerCase().trim();

  let detectedMood = 'chill';
  let title = 'AI Curated Mix';
  let reason = 'Based on your vibe';
  let moodEmoji = '✨';

  // Workout / Gym / Energy / Hype
  if (
    lower.includes('gym') ||
    lower.includes('workout') ||
    lower.includes('energy') ||
    lower.includes('hype') ||
    lower.includes('motivat') ||
    lower.includes('fast') ||
    lower.includes('hard') ||
    lower.includes('heavy') ||
    lower.includes('run') ||
    lower.includes('beast') ||
    lower.includes('josh')
  ) {
    detectedMood = 'energy';
    title = '⚡ High Octane Beast Mode';
    reason = 'AI detected high-intensity workout & adrenaline energy. Boosted high-BPM tracks.';
    moodEmoji = '⚡';
  }
  // Sad / Heartbreak / Crying / Alone / Low
  else if (
    lower.includes('sad') ||
    lower.includes('alone') ||
    lower.includes('cry') ||
    lower.includes('broken') ||
    lower.includes('breakup') ||
    lower.includes('heart') ||
    lower.includes('dard') ||
    lower.includes('yaad') ||
    lower.includes('low') ||
    lower.includes('rain') ||
    lower.includes('depress') ||
    lower.includes('pain')
  ) {
    detectedMood = 'sad';
    title = '🌧️ Melancholic & Deep Reflections';
    reason = 'AI detected emotional/heartbreak sentiment. Filtered soulful acoustic & melancholic melodies.';
    moodEmoji = '🌧️';
  }
  // Party / Dance / Club / Celebration / Upbeat
  else if (
    lower.includes('party') ||
    lower.includes('dance') ||
    lower.includes('club') ||
    lower.includes('celebrat') ||
    lower.includes('upbeat') ||
    lower.includes('masti') ||
    lower.includes('dj') ||
    lower.includes('weekend') ||
    lower.includes('night') ||
    lower.includes('happy')
  ) {
    detectedMood = 'party';
    title = '🎉 Weekend Club & Party Hype';
    reason = 'AI detected celebratory party vibes. Selected bass-heavy dance tracks.';
    moodEmoji = '🎉';
  }
  // Focus / Study / Coding / Work / Calm
  else if (
    lower.includes('focus') ||
    lower.includes('study') ||
    lower.includes('code') ||
    lower.includes('coding') ||
    lower.includes('work') ||
    lower.includes('concentrat') ||
    lower.includes('office') ||
    lower.includes('read')
  ) {
    detectedMood = 'focus';
    title = '🧠 Deep Flow & Study Space';
    reason = 'AI detected deep focus & concentration context. Picked atmospheric and instrumental synths.';
    moodEmoji = '🧠';
  }
  // Romantic / Love / Crush / Date
  else if (
    lower.includes('love') ||
    lower.includes('romance') ||
    lower.includes('romantic') ||
    lower.includes('date') ||
    lower.includes('crush') ||
    lower.includes('pyar') ||
    lower.includes('ishq') ||
    lower.includes('sweet')
  ) {
    detectedMood = 'romantic';
    title = '💖 Soulmate & Romantic Acoustics';
    reason = 'AI detected romantic vibe. Filtered top soulful Bollywood love anthems.';
    moodEmoji = '💖';
  }
  // Chill / Relax / Calm / Sleep / Coffee / Lofi / Peace
  else {
    detectedMood = 'chill';
    title = '☕ Chill Sunset & Peaceful Lo-Fi';
    reason = 'AI detected a calm, relaxing atmosphere. Selected mellow acoustic and indie melodies.';
    moodEmoji = '☕';
  }

  // Filter matching songs
  const matchingSongs = ALL_SONGS.filter((s) => s.mood === detectedMood);
  // Fill remaining slots with other songs if needed
  const otherSongs = ALL_SONGS.filter((s) => s.mood !== detectedMood);
  const curatedPlaylist = [...matchingSongs, ...otherSongs.slice(0, 2)];

  const category = MOOD_CATEGORIES.find((m) => m.id === detectedMood) || MOOD_CATEGORIES[0];

  return {
    mood: detectedMood,
    title,
    reason,
    moodEmoji,
    gradient: category.gradient,
    playlist: curatedPlaylist,
    prompt
  };
};
