import React from 'react';
import AiBanner from '../components/music/AiBanner';
import MoodPills from '../components/music/MoodPills';
import SectionGrid from '../components/music/SectionGrid';

/**
 * 🏠 HomePage Component (`/`)
 * ----------------------------------------------------
 * Main landing page containing:
 * 1. AI Mood Prompt Banner
 * 2. Quick Mood Pills
 * 3. Trending Songs, Popular Artists & Popular Albums sections
 */
const HomePage = () => {
  return (
    <div className="space-y-6">
      <AiBanner />
      <MoodPills />
      <SectionGrid />
    </div>
  );
};

export default HomePage;
