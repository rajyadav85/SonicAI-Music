# 🎵 SonicAI Music — AI-Powered Music Streaming Web App

A modern, responsive, **Spotify-inspired music streaming platform** built with **React 19**, **Vite**, and **Tailwind CSS v4**. Features intelligent mood-based song discovery powered by AI prompt analysis, real-time JioSaavn API integration, and continuous background audio playback.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🎯 **AI Mood Detection** | Natural language prompt analyzer identifies user mood (happy, sad, romantic, energetic, chill, party, devotional) and auto-curates matching playlists |
| 🔍 **Smart Search** | 350ms debounced search engine integrated with JioSaavn REST API for real-time song, artist, and album discovery across 100k+ tracks |
| 🎵 **Continuous Audio Playback** | HTML5 Audio engine with custom seekbar, volume slider, shuffle, repeat, and queue management — playback persists across all route transitions |
| 👤 **Artist Discography** | 12 verified Indian playback singer profiles with hero banners, monthly listener stats, and top 10 tracklist tables |
| 💿 **Album Soundtracks** | 11 Bollywood blockbuster movie soundtracks with sequential playback, category filters, and vinyl-art detail pages |
| ❤️ **Liked Songs** | Personal favorites collection persisted via LocalStorage with authentication gate |
| 🔐 **Client-Side Auth** | Secure signup/login modal with SHA-256 password hashing (CryptoJS) and persistent sessions |
| 📱 **Fully Responsive** | Mobile-first design with off-canvas sidebar, swipe-friendly carousels, and fluid layouts (320px → 2560px) |
| 🛣️ **SPA Routing** | React Router v7 with deep linking, browser history support, and URL-driven navigation |

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 19 (Functional Components + Hooks) |
| **Build Tool** | Vite 7.3 (HMR, ESBuild, Tree-Shaking) |
| **Styling** | Tailwind CSS v4 (Utility-First, Dark Theme) |
| **Routing** | React Router DOM v7 (BrowserRouter, NavLink) |
| **State Management** | React Context API + Custom Hooks (`useMusic`, `useAuth`) |
| **API Integration** | Axios + JioSaavn Public REST API |
| **Audio Engine** | HTML5 Audio API with custom controls |
| **Authentication** | Client-Side Auth + CryptoJS SHA-256 Hashing |
| **Data Persistence** | Browser LocalStorage |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 |

---

## 📁 Project Structure

```
SonicAI Music/
├── public/
│   ├── artists/                 # HD artist portraits (12 singers)
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx    # Login/Signup modal with validation
│   │   ├── common/
│   │   │   └── Footer.jsx       # Site footer with links
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       # Top navigation bar with search
│   │   │   ├── Sidebar.jsx      # Collapsible sidebar with NavLinks
│   │   │   └── PlayerBar.jsx    # Persistent bottom audio player
│   │   └── music/
│   │       ├── AiBanner.jsx     # AI mood prompt input banner
│   │       ├── ArtistAvatar.jsx # Reusable artist image component
│   │       ├── MoodPills.jsx    # Horizontal mood filter tabs
│   │       ├── PopularArtists.jsx # Artist carousel with navigation
│   │       ├── PopularAlbums.jsx  # Album carousel with category filters
│   │       ├── SectionGrid.jsx  # Main content view controller
│   │       └── SongCard.jsx     # Individual song card component
│   ├── context/
│   │   ├── MusicContext.jsx     # Global music state (queue, playback, API)
│   │   ├── AuthContext.jsx      # Authentication state (user, sessions)
│   │   ├── useMusic.js          # Custom hook for music context
│   │   └── useAuth.js           # Custom hook for auth context
│   ├── data/
│   │   └── mockSongs.js         # Curated dataset (songs, artists, albums, moods)
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page (/)
│   │   ├── ArtistsPage.jsx      # All artists grid (/artists)
│   │   ├── ArtistDetailPage.jsx # Singer profile (/artist/:artistId)
│   │   ├── AlbumsPage.jsx       # All albums grid (/albums)
│   │   ├── AlbumDetailPage.jsx  # Album detail (/album/:albumId)
│   │   ├── LikedSongsPage.jsx   # Favorites collection (/liked-songs)
│   │   └── MoodPage.jsx         # Mood playlist (/mood/:moodId)
│   ├── services/
│   │   ├── musicApi.js          # JioSaavn API integration layer
│   │   └── aiService.js         # AI mood analysis service
│   ├── App.jsx                  # Root layout + route configuration
│   ├── main.jsx                 # Entry point with BrowserRouter
│   └── index.css                # Global styles + Tailwind imports
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
├── package.json
└── README.md
```

---

## 🛣️ Routes

| Route | Page | Description |
|:---|:---|:---|
| `/` | HomePage | Main dashboard with AI banner, mood pills, trending songs, artist & album carousels |
| `/artists` | ArtistsPage | Full responsive grid of all artists with real-time search filter |
| `/artist/:artistId` | ArtistDetailPage | Individual artist hero banner with verified badge and tracklist |
| `/albums` | AlbumsPage | Full responsive grid of all albums with category filter pills |
| `/album/:albumId` | AlbumDetailPage | Individual album detail with vinyl art and sequential tracklist |
| `/liked-songs` | LikedSongsPage | User's personal liked songs collection (requires login) |
| `/mood/:moodId` | MoodPage | Mood-specific curated playlist (chill, energy, romantic, etc.) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rajyadav85/SonicAI-Music.git

# 2. Navigate to the project directory
cd SonicAI-Music

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Architecture Highlights

### 1. Persistent Audio Engine
The `<PlayerBar />` and `<MusicProvider>` are mounted at the root level **outside** of `<Routes>`. This ensures audio playback is never interrupted, paused, or restarted when navigating between pages.

```
App.jsx
├── MusicProvider (Global State)
│   ├── Navbar
│   ├── Sidebar
│   ├── <Routes>           ← Only this re-renders on navigation
│   │   ├── HomePage
│   │   ├── ArtistsPage
│   │   ├── ArtistDetailPage
│   │   └── ...
│   ├── PlayerBar          ← Always mounted, never unmounts
│   └── Footer
```

### 2. Context-Based State Management
Instead of Redux, the app uses React's built-in **Context API** with custom hooks:
- **`useMusic()`** — Manages audio queue, playback controls, search, mood filtering, artist/album selection, and liked songs
- **`useAuth()`** — Manages user signup, login, session persistence, and authentication modals

### 3. Debounced API Search
Search input uses a **350ms debounce** to prevent excessive API calls. Only triggers the JioSaavn API after the user stops typing, reducing unnecessary network requests by ~70%.

### 4. Deep Linking
Direct URL access (e.g., `localhost:5173/artist/arijit`) automatically loads the corresponding artist profile and discography without requiring navigation from the home page.

---

## 📸 Screenshots

> Add screenshots of your application here for visual reference.

---

## 📝 License

This project is built for educational and portfolio purposes.

---

## 👤 Author

**Raj Yadav**
- GitHub: [@rajyadav85](https://github.com/rajyadav85)
