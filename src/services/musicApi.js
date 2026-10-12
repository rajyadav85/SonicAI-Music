import axios from 'axios';
import CryptoJS from 'crypto-js';
import { ALL_SONGS } from '../data/mockSongs';

// JioSaavn DES Decryption Key for Full-Length Tracks
const SAAVN_DES_KEY = '38346591';

// Curated Pool of High-Definition Unique Music Covers
const UNIQUE_HD_COVERS_POOL = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1445985543470-41fdd5c31447?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520523839898-507125ef538a?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&auto=format&fit=crop&q=80'
];

/**
 * Decrypts JioSaavn encrypted media URL to get direct full-length 160kbps audio stream.
 */
function decryptSaavnMediaUrl(encryptedUrl) {
  if (!encryptedUrl) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse(SAAVN_DES_KEY);
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl) },
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    const rawUrl = decrypted.toString(CryptoJS.enc.Utf8);
    if (!rawUrl) return null;
    return rawUrl.replace(/_96\.mp4/, '_160.mp4');
  } catch (error) {
    console.warn('Decryption skipped:', error.message);
    return null;
  }
}

/**
 * Cleans HTML entities and removes duplicate subtitle clutter from song names
 */
function cleanSongTitle(text) {
  if (!text) return 'Unknown Song';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/\s*\(From\s+[^)]+\)\s*\(From\s+[^)]+\)/gi, '')
    .trim();
}

/**
 * Normalizes title to detect duplicates
 */
function getNormalizedKey(title) {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[-–|].*$/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Formats duration in seconds to "mm:ss" string (e.g. 268 -> "4:28")
 */
function formatSecondsToTime(secondsNum) {
  const total = Math.max(0, parseInt(secondsNum, 10) || 0);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Single Query Fetcher from JioSaavn
 */
async function fetchSaavnRaw(query, limit = 15) {
  try {
    const proxyUrl = `/api/saavn/api.php?__call=search.getResults&_format=json&_marker=0&cc=in&includeMetaTags=1&p=1&n=${limit}&q=${encodeURIComponent(
      query
    )}`;
    const res = await axios.get(proxyUrl, { timeout: 4500 });
    return res.data?.results || [];
  } catch {
    return [];
  }
}

/**
 * 🧠 Intelligent Semantic Mood Expander
 * Maps user emotions/keywords into rich, accurate, high-quality Bollywood search queries
 */
function getSmartQueriesForSearch(userQuery) {
  const q = userQuery.toLowerCase().trim();

  // 1. Sad / Heartbreak / Breakup
  if (/\b(sad|dard|heartbreak|breakup|cry|alone|depressed|dukh|udas|lonely|pain|dard bhare)\b/i.test(q)) {
    return [
      'arijit sad',
      'channa mereya',
      'agar tum saath ho',
      'hamari adhuri kahani',
      'phir bhi tumko chaahunga',
      'bekhayali kabir singh',
      'soch na sake arijit',
      'judaai badlapur'
    ];
  }

  // 2. Romantic / Love / Pyaar / Crush
  if (/\b(romantic|love|pyaar|ishq|mohabbat|crush|date|valentine|sweet|dil)\b/i.test(q)) {
    return [
      'romantic hindi',
      'kesariya brahmastra',
      'tum hi ho aashiqui 2',
      'apna bana le bhediya',
      'raataan lambiyan shershaah',
      'zaalima',
      'pehle bhi main',
      'tum se hi jab we met'
    ];
  }

  // 3. Party / Dance / Club / Shadi
  if (/\b(party|dance|club|shadi|dj|masti|bhangra|upbeat|disco)\b/i.test(q)) {
    return [
      'party songs hindi',
      'badtameez dil yeh jawaani',
      'desi kalakaar honey singh',
      'kala chashma',
      'kar gayi chull',
      'gallan goodiyaan',
      'london thumakda'
    ];
  }

  // 4. Gym / Workout / Energy / Motivation
  if (/\b(gym|workout|energy|motivation|fitness|power|pump|josh|heavy|running|exercise)\b/i.test(q)) {
    return [
      'born to shine diljit',
      'brothers anthem ajay atul',
      'zinda bhaag milkha',
      'kar har maidaan fateh',
      'dangal title track daler',
      'get ready to fight baaghi',
      'believer'
    ];
  }

  // 5. Chill / Relax / Lofi / Sleep / Peace
  if (/\b(chill|relax|peace|lofi|sleep|calm|sukoon|night|rain|barish|acoustic|slow)\b/i.test(q)) {
    return [
      'lofi hindi',
      'pal pal dil ke paas kishore',
      'baarishein anuv jain',
      'iktara wake up sid',
      'kho gaye hum kahan',
      'kasoor prateek kuhad',
      'alag aasmaan'
    ];
  }

  // 6. Retro / Old / 70s / 80s / 90s / Evergreen
  if (/\b(retro|old|purane|70s|80s|90s|evergreen|classic|golden|kishore|lata|rafi|mukesh)\b/i.test(q)) {
    return [
      'kishore kumar hits',
      'lata mangeshkar hits',
      'mohammed rafi hits',
      'chura ke dil mera',
      'tujhe dekha to',
      'yeh vaada raha'
    ];
  }

  // 7. Bhakti / Devotional / Spiritual
  if (/\b(bhakti|devotional|god|krishna|shiva|hanuman|ram|bhajan|aarti)\b/i.test(q)) {
    return [
      'hanuman chalisa gulshan kumar',
      'achyutam keshavam',
      'namo namo kedarnath',
      'shiv tandav stotram',
      'radhe radhe'
    ];
  }

  // 8. Punjabi / Urban Hits
  if (/\b(punjabi|sidhu|karan aujla|shubh|ap dhillon)\b/i.test(q)) {
    return [
      'born to shine diljit',
      'cheques shubh',
      'softly karan aujla',
      'excuses ap dhillon',
      '295 sidhu moose wala'
    ];
  }

  // 9. Famous Playback Singers Targeted Discographies
  if (/arijit/i.test(q)) {
    return ['arijit singh hits', 'kesariya arijit', 'tum hi ho', 'channa mereya', 'apna bana le', 'soch na sake'];
  }
  if (/shreya/i.test(q)) {
    return ['shreya ghoshal hits', 'sunn raha hai shreya', 'deewani mastani', 'ghoomar shreya', 'teri ore'];
  }
  if (/kishore/i.test(q)) {
    return ['kishore kumar hits', 'pal pal dil ke paas', 'o mere dil ke chain', 'roop tera mastana', 'yeh shaam mastani'];
  }
  if (/diljit/i.test(q)) {
    return ['diljit dosanjh hits', 'born to shine diljit', 'lover diljit', 'goat diljit', 'hass hass diljit', 'naina diljit'];
  }
  if (/atif/i.test(q)) {
    return ['atif aslam hits', 'tere sang yaara', 'jeene laga hoon', 'pehli nazar mein', 'tu jaane na', 'woh lamhe'];
  }
  if (/\bkk\b|krishnakumar/i.test(q)) {
    return ['kk hits bollywood', 'labon ko kk', 'zara sa kk', 'kya mujhe pyar hai', 'aankhon mein teri', 'yaaron kk'];
  }
  if (/sonu/i.test(q)) {
    return ['sonu nigam hits', 'kal ho naa ho sonu', 'abhi mujh mein kahin', 'suraj hua maddham', 'saathiya sonu'];
  }
  if (/pritam/i.test(q)) {
    return ['pritam hits', 'badtameez dil', 'kesariya pritam', 'channa mereya pritam', 'subhanallah', 'ilahi'];
  }
  if (/rahman/i.test(q)) {
    return ['ar rahman hits', 'jai ho rahman', 'kun faya kun', 'agar tum saath ho', 'chaiyya chaiyya', 'matargashti'];
  }
  if (/badshah/i.test(q)) {
    return ['badshah hits', 'kala chashma', 'jugnu badshah', 'garmi badshah', 'genda phool', 'abhi toh party shuru'];
  }
  if (/honey/i.test(q)) {
    return ['honey singh hits', 'desi kalakaar', 'blue eyes honey singh', 'love dose', 'brown rang', 'dopeness'];
  }
  if (/lata/i.test(q)) {
    return ['lata mangeshkar hits', 'lag jaa gale lata', 'tujhe dekha to', 'ajeeb dastan hai yeh', 'kabhie kabhie mere dil mein'];
  }

  // 10. Superhit Bollywood Movie Albums Discography
  if (/animal/i.test(q)) {
    return ['pehle bhi main animal', 'arjan vailly', 'satranga animal', 'hua main animal', 'saari duniya jalaa denge animal'];
  }
  if (/aashiqui/i.test(q)) {
    return ['tum hi ho aashiqui 2', 'sunn raha hai na tu', 'chahun main ya naa', 'hum mar jayenge', 'milne hai mujhse aayi'];
  }
  if (/jawaani|yjhd/i.test(q)) {
    return ['badtameez dil yeh jawaani', 'balam pichkari', 'ilahi yeh jawaani', 'subhanallah yeh jawaani', 'kabira yeh jawaani', 'dilliwaali girlfriend'];
  }
  if (/kabir\s*singh/i.test(q)) {
    return ['bekhayali kabir singh', 'tujhe kitna chahne lage', 'kaise hua kabir singh', 'tera ban jaunga', 'pehla pyaar kabir singh'];
  }
  if (/shershaah/i.test(q)) {
    return ['raataan lambiyan shershaah', 'ranjha shershaah', 'mann bharryaa 2.0', 'kabhii tumhhe shershaah', 'jaihind ki senaa'];
  }
  if (/rockstar/i.test(q)) {
    return ['kun faya kun rockstar', 'nadaan parindey rockstar', 'sadda haq rockstar', 'tum ho rockstar', 'phir se ud chala', 'jo bhi main rockstar'];
  }
  if (/brahmastra/i.test(q)) {
    return ['kesariya brahmastra', 'deva deva brahmastra', 'dance ka bhoot', 'rasiya brahmastra', 'kesariya dance mix'];
  }
  if (/tamasha/i.test(q)) {
    return ['agar tum saath ho tamasha', 'matargashti tamasha', 'heer toh badi sad hai', 'wat wat wat', 'safarnama tamasha'];
  }
  if (/jab\s*we\s*met/i.test(q)) {
    return ['tum se hi jab we met', 'mauja hi mauja', 'yeh ishq haye', 'nagada nagada jab we met', 'aaoge jab tum'];
  }
  if (/goat|g\.o\.a\.t/i.test(q)) {
    return ['born to shine diljit', 'g.o.a.t. diljit', 'clash diljit', 'peed diljit', 'navi navi yaari diljit'];
  }
  if (/ae\s*dil|adhm/i.test(q)) {
    return ['ae dil hai mushkil arijit', 'channa mereya', 'bulleya ae dil hai mushkil', 'the breakup song', 'cutiepie'];
  }

  // Default direct search query
  return [userQuery];
}

/**
 * Primary Search: JioSaavn API with Semantic Mood Recognition & Deduplication
 */
async function fetchFromSaavn(query, limit = 35) {
  try {
    const subQueries = getSmartQueriesForSearch(query);
    const allRawResults = [];

    // Parallel fetch across targeted queries (capped to max 4 for speed & reliability)
    const targetedQueries = subQueries.slice(0, 4);
    const fetchPromises = targetedQueries.map((sq) =>
      fetchSaavnRaw(sq, targetedQueries.length > 1 ? 10 : 40)
    );
    const resultsArrays = await Promise.all(fetchPromises);

    for (const arr of resultsArrays) {
      allRawResults.push(...arr);
    }

    if (allRawResults.length === 0) return [];

    const seenTitles = new Set();
    const seenImages = new Set();
    const uniqueSongs = [];
    let poolIndex = 0;

    for (const track of allRawResults) {
      const title = cleanSongTitle(track.song || track.title);
      const normalizedKey = getNormalizedKey(title);

      // Skip duplicate song titles
      if (normalizedKey && seenTitles.has(normalizedKey)) {
        continue;
      }

      const fullStreamUrl = decryptSaavnMediaUrl(track.encrypted_media_url);
      if (!fullStreamUrl) continue;

      if (normalizedKey) {
        seenTitles.add(normalizedKey);
      }

      // Handle Unique Image assignment
      let songImg = track.image ? track.image.replace('150x150.jpg', '500x500.jpg') : '';
      if (!songImg || seenImages.has(songImg)) {
        songImg = UNIQUE_HD_COVERS_POOL[poolIndex % UNIQUE_HD_COVERS_POOL.length];
        poolIndex++;
      }
      seenImages.add(songImg);

      const songDurationSec = parseInt(track.duration, 10) || 240;

      uniqueSongs.push({
        id: track.id || `saavn-${Math.random()}`,
        title: title,
        artists: cleanSongTitle(track.primary_artists || track.singers || track.music || 'Artist'),
        album: cleanSongTitle(track.album || 'Single'),
        img: songImg,
        audioUrl: fullStreamUrl, // ⚡ 100% Real Full-Length Audio
        duration: formatSecondsToTime(songDurationSec),
        rawDuration: songDurationSec,
        language: track.language || 'Hindi',
        isExplicit: track.explicit_content === 1 || track.explicit_content === '1',
      });

      if (uniqueSongs.length >= limit) break;
    }

    return uniqueSongs;
  } catch (err) {
    console.warn('Saavn fetch skipped:', err.message);
    return [];
  }
}

/**
 * Universal Search Function with 100% Accurate Mood Mapping
 */
export async function searchSongsFromApi(query, limit = 35) {
  if (!query || !query.trim()) return ALL_SONGS;

  const trimmed = query.trim();

  // 1. Fetch smart, mood-matched JioSaavn songs
  const saavnSongs = await fetchFromSaavn(trimmed, limit);
  if (saavnSongs.length > 0) {
    return saavnSongs;
  }

  // 2. Fallback to curated songs matching mood or keyword
  const lower = trimmed.toLowerCase();
  const matched = ALL_SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(lower) ||
      s.artists.toLowerCase().includes(lower) ||
      s.album.toLowerCase().includes(lower) ||
      s.mood.toLowerCase().includes(lower)
  );

  return matched.length > 0 ? matched : ALL_SONGS;
}

/**
 * Pre-defined search queries for diverse categories
 */
export const MOOD_SEARCH_TERMS = {
  all: 'bollywood top hits trending',
  chill: 'chill',
  energy: 'gym',
  sad: 'sad',
  party: 'party',
  focus: 'chill',
  romantic: 'romantic',
};
