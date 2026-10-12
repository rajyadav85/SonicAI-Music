import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PlayerBar from './components/layout/PlayerBar';
import Footer from './components/common/Footer';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import LikedSongsPage from './pages/LikedSongsPage';
import MoodPage from './pages/MoodPage';
import { useMusic } from './context/useMusic';

/**
 * 🚀 App Root Component
 * ----------------------------------------------------
 * Master layout holding:
 * 1. Persistent Sidebar & Navbar
 * 2. React Router Viewport (<Routes> & <Route>)
 * 3. Uninterrupted HTML5 Audio Player (<PlayerBar />)
 * 4. Global Auth Modal (<AuthModal />)
 */
const App = () => {
  const { currentMoodObj } = useMusic();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121212] overflow-hidden text-white font-sans">
      {/* Main App Workspace (Sidebar + Scrollable Main View) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Mobile Slide-over Drawer Backdrop & Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity cursor-pointer"
            />
            {/* Drawer */}
            <div className="relative z-50 w-72 h-full">
              <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Right Main Scrollable Viewport */}
        <main
          id="main-scroll-container"
          className={`flex-1 flex flex-col overflow-y-auto bg-gradient-to-b ${currentMoodObj.gradient} transition-colors duration-700 scroll-smooth`}
        >
          {/* Top Navbar */}
          <Navbar
            onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            isMobileSidebarOpen={isMobileSidebarOpen}
          />

          {/* Dynamic Route Pages */}
          <div className="flex-1 px-4 sm:px-8 py-6 space-y-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/popular-artists" element={<ArtistsPage />} />
              <Route path="/artist/:artistId" element={<ArtistDetailPage />} />
              <Route path="/albums" element={<AlbumsPage />} />
              <Route path="/popular-albums" element={<AlbumsPage />} />
              <Route path="/album/:albumId" element={<AlbumDetailPage />} />
              <Route path="/liked-songs" element={<LikedSongsPage />} />
              <Route path="/liked" element={<LikedSongsPage />} />
              <Route path="/mood/:moodId" element={<MoodPage />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>

      {/* Bottom Fixed Music Player Bar (Never unmounts, audio continues uninterrupted) */}
      <PlayerBar />

      {/* Global Auth Modal (Login / Signup) */}
      <AuthModal />
    </div>
  );
};

export default App;
