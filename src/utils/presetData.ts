import { PoetryPresetItem, BackgroundPresetItem, PoetryProject, VideoPresetItem } from '../types';

export const BACKGROUND_PRESETS: BackgroundPresetItem[] = [
  {
    id: 'rainy_window',
    name: 'Rainy Window Lights',
    category: 'Melancholic',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'misty_pine_forest',
    name: 'Misty Alpine Pines',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'night_street_lamp',
    name: 'Vintage Night Walk',
    category: 'Urban Retro',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'starry_twilight',
    name: 'Deep Twilight Cosmos',
    category: 'Ethereal',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'candle_coffee_antique',
    name: 'Warm Candle & Book',
    category: 'Cozy Vintage',
    url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=300&q=70',
  },
  {
    id: 'foggy_lake_mountain',
    name: 'Foggy Pier at Dusk',
    category: 'Serene',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=70',
  },
];

export const POETRY_PRESETS: PoetryPresetItem[] = [
  {
    id: 'original_urdu',
    title: 'Khawab Aur Zindagi',
    poet: 'Classic Verse',
    language: 'Urdu',
    lines: [
      'خواب آنکھوں میں بسائے رکھو',
      'زندگی کو سجا کے رکھو',
    ],
    suggestedMusic: 'Romantic Flute',
    suggestedMotion: 'Cold Breeze Sway',
  },
  {
    id: 'faiz_gulon_mein',
    title: 'Gulon Mein Rang Bhare',
    poet: 'فیض احمد فیض (Faiz Ahmad Faiz)',
    language: 'Urdu',
    lines: [
      'گلوں میں رنگ بھرے بادِ نوبہار چلے',
      'چلے بھی آؤ کہ گلشن کا کاروبار چلے',
    ],
    suggestedMusic: 'Aesthetic Lofi',
    suggestedMotion: 'Slow Zoom-In',
  },
  {
    id: 'ghalib_hazaaron',
    title: 'Hazaron Khwahishein',
    poet: 'مرزا غالب (Mirza Ghalib)',
    language: 'Urdu',
    lines: [
      'ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے',
      'بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے',
    ],
    suggestedMusic: 'Sad Piano',
    suggestedMotion: 'Human Walk Drift',
  },
  {
    id: 'jaun_elia_khamoshi',
    title: 'Bepanah Khamoshi',
    poet: 'جون ایلیا (Jaun Elia)',
    language: 'Urdu',
    lines: [
      'کتنی دلکش ہو تم کتنا دل جو ہوں میں',
      'کیا ستم ہے کہ ہم لوگ مر جائیں گے',
    ],
    suggestedMusic: 'Sad Piano',
    suggestedMotion: 'Cold Breeze Sway',
  },
  {
    id: 'parveen_shakir_khushboo',
    title: 'Khushboo Ka Safar',
    poet: 'پروین شاکر (Parveen Shakir)',
    language: 'Urdu',
    lines: [
      'وہ تو خوشبو ہے ہواؤں میں بکھر جائے گا',
      'مسئلہ پھول کا ہے پھول کدھر جائے گا',
    ],
    suggestedMusic: 'Romantic Flute',
    suggestedMotion: 'Slow Zoom-In',
  },
  {
    id: 'roman_urdu_sukoon',
    title: 'Sukoon Ki Talash',
    poet: 'Aesthetic Diary',
    language: 'Roman Urdu',
    lines: [
      'Kuch raaste tanha hi acche lagte hain',
      'Jahan shor nahi, bas apna wajood sunayi deta hai',
    ],
    suggestedMusic: 'Aesthetic Lofi',
    suggestedMotion: 'Slow Zoom-In',
  },
  {
    id: 'english_rumi_stars',
    title: 'The Wound is the Place',
    poet: 'Rumi',
    language: 'English',
    lines: [
      'The wound is the place where',
      'The Light enters you.',
    ],
    suggestedMusic: 'Sufi Ambient',
    suggestedMotion: 'Slow Zoom-In',
  },
  {
    id: 'english_aesthetic_silence',
    title: 'Quiet Echoes',
    poet: 'Whispering Winds',
    language: 'English',
    lines: [
      'In the quiet space between the stars,',
      'I found the words I could never say.',
    ],
    suggestedMusic: 'Nostalgic Acoustic',
    suggestedMotion: 'Cold Breeze Sway',
  },
];

export const VIDEO_PRESETS: VideoPresetItem[] = [
  {
    id: 'rainy_car_bokeh',
    name: 'Rainy Night Bokeh',
    category: 'Melancholic Rain',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-raindrops-on-a-window-pane-at-night-42861-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=70',
    duration: 15,
  },
  {
    id: 'ocean_twilight_waves',
    name: 'Moody Ocean Waves',
    category: 'Nature',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=70',
    duration: 14,
  },
  {
    id: 'candlelight_cozy',
    name: 'Candlelight Flame',
    category: 'Warm Night',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-candle-flame-in-the-dark-41772-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=300&q=70',
    duration: 12,
  },
  {
    id: 'tree_branches_wind',
    name: 'Cold Breeze Branches',
    category: 'Nature Breeze',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=70',
    duration: 13,
  },
  {
    id: 'night_traffic_blur',
    name: 'City Lights Drift',
    category: 'Urban Lights',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-lights-in-the-city-at-night-41584-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=70',
    duration: 15,
  },
];

export const INITIAL_PROJECT: PoetryProject = {
  mediaType: 'photo',
  
  backgroundImageUrl: BACKGROUND_PRESETS[0].url,
  imageFileName: 'rainy_window.jpg',

  backgroundVideoUrl: VIDEO_PRESETS[0].videoUrl,
  videoFileName: 'rainy_night_bokeh.mp4',
  videoAudioMode: 'mute',
  videoVolume: 0.8,

  aspectRatio: '9:16',
  
  poetryText: 'خواب آنکھوں میں بسائے رکھو\nزندگی کو سجا کے رکھو',
  authorOrTag: '— خواب و خیال',
  fontFamily: 'Noto Nastaliq Urdu',
  fontSize: 48,
  textColor: '#FFFFFF',
  shadowColor: '#000000',
  glowEffect: true,
  textAlign: 'center',
  textPositionPercentY: 72,
  
  motionType: 'Cold Breeze Sway',
  motionIntensity: 2.0,
  duration: 12,
  textSpeed: 1.0,
  introHoldSeconds: 2.0,
  
  vignetteDarkness: 0.45,
  showGrain: true,
  grainIntensity: 0.08,
  showDustParticles: true,
  particleCount: 35,
  showLightLeak: true,
  showTikTokOverlay: false,
  
  presetMusic: 'Romantic Flute',
  customAudioUrl: null,
  customAudioName: null,
  audioVolume: 0.85,
};
