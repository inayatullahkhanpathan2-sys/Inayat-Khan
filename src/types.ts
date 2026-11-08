export type MotionType = 'Slow Zoom-In' | 'Cold Breeze Sway' | 'Human Walk Drift' | 'Cinematic Pan' | 'Gentle Pulse';

export type PresetMusicType = 'None / Upload Own' | 'Aesthetic Lofi' | 'Sad Piano' | 'Romantic Flute' | 'Sufi Ambient' | 'Nostalgic Acoustic';

export type FontFamilyType = 'Noto Nastaliq Urdu' | 'Gulzar' | 'Amiri' | 'Cinzel' | 'Playfair Display' | 'Cormorant Garamond' | 'Inter';

export type TextAlignment = 'center' | 'right' | 'left';

export type MediaType = 'photo' | 'video';

export type VideoAudioMode = 'mute' | 'keep' | 'blend';

export interface PoetryProject {
  // Media Type: Photo or Video
  mediaType: MediaType;

  // Image Background
  backgroundImageUrl: string;
  imageFileName?: string;
  
  // Video Background
  backgroundVideoUrl: string | null;
  videoFileName?: string;
  videoAudioMode: VideoAudioMode;
  videoVolume: number; // 0.0 to 1.0

  aspectRatio: '9:16';
  
  // Poetry & Text
  poetryText: string;
  authorOrTag: string;
  fontFamily: FontFamilyType;
  fontSize: number; // in pt/px relative to 1080 canvas
  textColor: string;
  shadowColor: string;
  glowEffect: boolean;
  textAlign: TextAlignment;
  textPositionPercentY: number; // 0 to 100% of canvas height (default ~ 65-75%)
  
  // Motion & Animation
  motionType: MotionType;
  motionIntensity: number; // 1.0 to 5.0
  duration: number; // 5 to 30 seconds
  textSpeed: number; // 0.5 to 3.0
  introHoldSeconds: number; // seconds of pure visual before text starts (e.g. 1.5 - 2s)
  
  // Overlays & Atmosphere
  vignetteDarkness: number; // 0.0 to 1.0 (default 0.45)
  showGrain: boolean;
  grainIntensity: number; // 0.0 to 0.5
  showDustParticles: boolean;
  particleCount: number;
  showLightLeak: boolean;
  showTikTokOverlay: boolean; // toggle social media UI mockup overlay
  
  // Music & Audio
  presetMusic: PresetMusicType;
  customAudioUrl: string | null;
  customAudioName: string | null;
  audioVolume: number; // 0.0 to 1.0
}

export interface PoetryPresetItem {
  id: string;
  title: string;
  poet: string;
  language: 'Urdu' | 'Roman Urdu' | 'English';
  lines: string[];
  suggestedMusic: PresetMusicType;
  suggestedMotion: MotionType;
}

export interface BackgroundPresetItem {
  id: string;
  name: string;
  category: string;
  url: string;
  thumbnail: string;
}

export interface VideoPresetItem {
  id: string;
  name: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  duration?: number;
}
