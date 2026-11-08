import React, { useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Music,
  Sliders,
  Type,
  Sparkles,
  Layers,
  Clock,
  Zap,
  Volume2,
  Trash2,
  Play,
  Square,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import {
  PoetryProject,
  MotionType,
  PresetMusicType,
  FontFamilyType,
  TextAlignment,
  MediaType,
  VideoAudioMode,
} from '../types';
import { BACKGROUND_PRESETS, VIDEO_PRESETS } from '../utils/presetData';
import { soundEngine } from '../utils/audioSynth';

interface SidebarControlsProps {
  project: PoetryProject;
  onChange: (updated: Partial<PoetryProject>) => void;
  onOpenAIGenerator: () => void;
  onOpenPresets: () => void;
  isPlayingMusicPreview: boolean;
  onToggleMusicPreview: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  project,
  onChange,
  onOpenAIGenerator,
  onOpenPresets,
  isPlayingMusicPreview,
  onToggleMusicPreview,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({
        mediaType: 'photo',
        backgroundImageUrl: url,
        imageFileName: file.name,
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange({
        mediaType: 'video',
        backgroundVideoUrl: url,
        videoFileName: file.name,
      });
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const name = await soundEngine.loadCustomAudio(file);
        const url = URL.createObjectURL(file);
        onChange({
          customAudioUrl: url,
          customAudioName: name,
          presetMusic: 'None / Upload Own',
        });
      } catch (err) {
        console.error('Audio load error:', err);
      }
    }
  };

  const handleRemoveCustomAudio = () => {
    soundEngine.clearCustomAudio();
    onChange({
      customAudioUrl: null,
      customAudioName: null,
      presetMusic: 'Romantic Flute',
    });
  };

  return (
    <div className="flex flex-col gap-5 text-neutral-200 text-sm">
      {/* 1. Background Media: Photo or Video Switcher */}
      <section className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4.5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-semibold text-white">
            {project.mediaType === 'video' ? (
              <Video className="h-4 w-4 text-rose-400" />
            ) : (
              <ImageIcon className="h-4 w-4 text-rose-400" />
            )}
            <span>1. Background Media (Photo / Video)</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">9:16 Vertical</span>
        </div>

        {/* Media Type Switcher Tabs */}
        <div className="mt-3.5 flex rounded-xl bg-neutral-950 p-1 border border-neutral-800">
          <button
            onClick={() => onChange({ mediaType: 'photo' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              project.mediaType === 'photo'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>📸 Photo Background</span>
          </button>
          <button
            onClick={() => onChange({ mediaType: 'video' })}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              project.mediaType === 'video'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>🎥 Video Background</span>
          </button>
        </div>

        {/* If Photo is Selected */}
        {project.mediaType === 'photo' ? (
          <div className="mt-3.5 space-y-3">
            {/* Custom Image Upload Button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-rose-500/40 bg-rose-500/5 px-3 py-2.5 text-xs font-medium text-rose-200 transition-all hover:bg-rose-500/10 hover:border-rose-500/70 active:scale-98"
              >
                <Upload className="h-3.5 w-3.5 text-rose-400" />
                <span>
                  {project.imageFileName
                    ? `Change Picture (${project.imageFileName.slice(0, 16)}...)`
                    : 'Upload Your Picture (JPG/PNG)'}
                </span>
              </button>
            </div>

            {/* Curated Aesthetic Image Presets */}
            <div>
              <div className="text-[11px] font-medium text-neutral-400 mb-2">Or pick aesthetic picture:</div>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_PRESETS.map((preset) => {
                  const isSelected = project.backgroundImageUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      onClick={() =>
                        onChange({
                          mediaType: 'photo',
                          backgroundImageUrl: preset.url,
                          imageFileName: `${preset.id}.jpg`,
                        })
                      }
                      className={`group relative aspect-[9/16] overflow-hidden rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 ring-2 ring-rose-500/30'
                          : 'border-neutral-800 hover:border-neutral-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.thumbnail}
                        alt={preset.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-white truncate leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* If Video is Selected */
          <div className="mt-3.5 space-y-3">
            {/* Custom Video Upload Button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoUpload}
                accept="video/mp4,video/webm,video/quicktime,video/mkv"
                className="hidden"
              />
              <button
                onClick={() => videoInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-rose-500/40 bg-rose-500/5 px-3 py-2.5 text-xs font-medium text-rose-200 transition-all hover:bg-rose-500/10 hover:border-rose-500/70 active:scale-98"
              >
                <Upload className="h-3.5 w-3.5 text-rose-400" />
                <span>
                  {project.videoFileName
                    ? `Change Video (${project.videoFileName.slice(0, 16)}...)`
                    : 'Upload Your Video (MP4/WebM)'}
                </span>
              </button>
            </div>

            {/* Video Audio Setting */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-300">
                <span className="font-medium flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-amber-400" />
                  Video Original Sound
                </span>
                <span className="text-neutral-500">Audio Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'mute', label: 'Mute Video' },
                  { id: 'keep', label: 'Keep Sound' },
                  { id: 'blend', label: 'Blend Sound' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => onChange({ videoAudioMode: mode.id as VideoAudioMode })}
                    className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-all ${
                      project.videoAudioMode === mode.id
                        ? 'bg-neutral-800 text-rose-400 border border-rose-500/30'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Aesthetic Video Presets */}
            <div>
              <div className="text-[11px] font-medium text-neutral-400 mb-2">Or pick aesthetic vertical video loop:</div>
              <div className="grid grid-cols-3 gap-2">
                {VIDEO_PRESETS.map((preset) => {
                  const isSelected = project.backgroundVideoUrl === preset.videoUrl;
                  return (
                    <button
                      key={preset.id}
                      onClick={() =>
                        onChange({
                          mediaType: 'video',
                          backgroundVideoUrl: preset.videoUrl,
                          videoFileName: `${preset.id}.mp4`,
                          duration: preset.duration || project.duration,
                        })
                      }
                      className={`group relative aspect-[9/16] overflow-hidden rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-rose-500 ring-2 ring-rose-500/30'
                          : 'border-neutral-800 hover:border-neutral-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.thumbnail}
                        alt={preset.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-1 right-1 rounded bg-black/60 px-1 text-[8px] text-white">
                        ▶ Video
                      </div>
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-white truncate leading-tight">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Custom Music Upload & Presets */}
      <section className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4.5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Music className="h-4 w-4 text-amber-400" />
            <span>2. Music & Soundscape</span>
          </div>
          <button
            onClick={onToggleMusicPreview}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-all ${
              isPlayingMusicPreview
                ? 'bg-rose-500 text-white'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {isPlayingMusicPreview ? (
              <>
                <Square className="h-3 w-3 fill-current" />
                <span>Stop Preview</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 fill-current" />
                <span>Test Audio</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3.5 space-y-3">
          {/* Preset Music Selector */}
          <div>
            <label className="text-[11px] font-medium text-neutral-400 block mb-1">8. Preset Music Track</label>
            <select
              value={project.presetMusic}
              onChange={(e) =>
                onChange({
                  presetMusic: e.target.value as PresetMusicType,
                  customAudioUrl: null,
                  customAudioName: null,
                })
              }
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            >
              <option value="Aesthetic Lofi">Aesthetic Lofi (Chilled Rhodes + Vinyl)</option>
              <option value="Sad Piano">Sad Piano (Melancholic Reverb)</option>
              <option value="Romantic Flute">Romantic Flute (Soothing Breeze Melody)</option>
              <option value="Sufi Ambient">Sufi Ambient (Deep Meditative Drone)</option>
              <option value="Nostalgic Acoustic">Nostalgic Acoustic (Nylon Guitar)</option>
              <option value="None / Upload Own">None / Upload Own MP3</option>
            </select>
          </div>

          {/* Custom MP3 Upload */}
          <div className="pt-1">
            <input
              type="file"
              ref={audioInputRef}
              onChange={handleAudioUpload}
              accept="audio/mp3,audio/wav,audio/mpeg,audio/aac"
              className="hidden"
            />
            {project.customAudioName ? (
              <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                <div className="flex items-center gap-2 truncate">
                  <Music className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{project.customAudioName}</span>
                </div>
                <button
                  onClick={handleRemoveCustomAudio}
                  className="rounded p-1 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400"
                  title="Remove audio"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => audioInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-xs font-medium text-neutral-300 transition-all hover:bg-neutral-800"
              >
                <Upload className="h-3.5 w-3.5 text-neutral-400" />
                <span>Upload Custom Audio (MP3/WAV)</span>
              </button>
            )}
          </div>

          {/* Audio Volume */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" /> Audio Volume
              </span>
              <span>{Math.round(project.audioVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={project.audioVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange({ audioVolume: val });
                soundEngine.setVolume(val);
              }}
              className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 3. Poetry / Quote Input & Styling */}
      <section className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4.5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Type className="h-4 w-4 text-violet-400" />
            <span>3. Enter Poetry / Quote</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenPresets}
              className="text-[11px] text-amber-300 hover:underline"
            >
              Couplets
            </button>
            <span className="text-neutral-600">|</span>
            <button
              onClick={onOpenAIGenerator}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>AI Write</span>
            </button>
          </div>
        </div>

        <div className="mt-3.5 space-y-3.5">
          {/* Main Poetry Textarea */}
          <div>
            <textarea
              rows={3}
              value={project.poetryText}
              onChange={(e) => onChange({ poetryText: e.target.value })}
              placeholder="Enter your Urdu, Roman Urdu or English poetry lines here (press Enter for line break)..."
              dir="auto"
              className={`w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-base text-neutral-100 placeholder-neutral-500 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 ${
                project.fontFamily === 'Noto Nastaliq Urdu' ? 'font-nastaliq leading-loose' : ''
              }`}
            />
            <p className="mt-1 text-[11px] text-neutral-400">
              Each new line flows in sequentially after the aesthetic intro!
            </p>
          </div>

          {/* Poet attribution / watermark */}
          <div>
            <label className="text-[11px] font-medium text-neutral-400 block mb-1">Poet / Attribution Tag (Optional)</label>
            <input
              type="text"
              value={project.authorOrTag}
              onChange={(e) => onChange({ authorOrTag: e.target.value })}
              placeholder="e.g. — میر تقی میر or — Faiz Ahmad Faiz"
              dir="auto"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500"
            />
          </div>

          {/* Font Family Selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">Font Family</label>
              <select
                value={project.fontFamily}
                onChange={(e) => onChange({ fontFamily: e.target.value as FontFamilyType })}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-2.5 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500"
              >
                <option value="Noto Nastaliq Urdu">Noto Nastaliq (Urdu)</option>
                <option value="Gulzar">Gulzar (Calligraphic)</option>
                <option value="Amiri">Amiri (Naskh / Arabic)</option>
                <option value="Cinzel">Cinzel (Cinematic Serif)</option>
                <option value="Playfair Display">Playfair Display (Serif)</option>
                <option value="Cormorant Garamond">Cormorant Garamond</option>
                <option value="Inter">Inter (Clean Modern)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400 block mb-1">Alignment</label>
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 p-1">
                {(['left', 'center', 'right'] as TextAlignment[]).map((align) => (
                  <button
                    key={align}
                    onClick={() => onChange({ textAlign: align })}
                    className={`flex-1 flex justify-center py-1 rounded-lg text-xs transition-colors ${
                      project.textAlign === align ? 'bg-neutral-800 text-rose-400' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={`Align ${align}`}
                  >
                    {align === 'left' && <AlignLeft className="h-3.5 w-3.5" />}
                    {align === 'center' && <AlignCenter className="h-3.5 w-3.5" />}
                    {align === 'right' && <AlignRight className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Font Size & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Font Size</span>
                <span>{project.fontSize}px</span>
              </div>
              <input
                type="range"
                min="32"
                max="68"
                value={project.fontSize}
                onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Vertical Position</span>
                <span>{project.textPositionPercentY}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="85"
                value={project.textPositionPercentY}
                onChange={(e) => onChange({ textPositionPercentY: parseInt(e.target.value) })}
                className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Glow Effect Toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-neutral-300">Aesthetic Text Glow & Shadow</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={project.glowEffect}
                onChange={(e) => onChange({ glowEffect: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* 4. Motion & Video Options (Matching Streamlit controls) */}
      <section className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4.5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <span>4. Motion & Animation</span>
          </div>
        </div>

        <div className="mt-3.5 space-y-3.5">
          {/* 4. Motion Type */}
          <div>
            <label className="text-[11px] font-medium text-neutral-400 block mb-1">4. Background Motion Effect</label>
            <select
              value={project.motionType}
              onChange={(e) => onChange({ motionType: e.target.value as MotionType })}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 outline-none focus:border-rose-500"
            >
              <option value="Slow Zoom-In">Slow Zoom-In (Cinematic Ken Burns)</option>
              <option value="Cold Breeze Sway">Cold Breeze Sway (Gentle Wind Drift)</option>
              <option value="Human Walk Drift">Human Walk Drift (Handheld Motion)</option>
              <option value="Cinematic Pan">Cinematic Pan (Smooth Lateral Drift)</option>
              <option value="Gentle Pulse">Gentle Pulse (Heartbeat Rhythm)</option>
            </select>
          </div>

          {/* 5. Video Duration */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> 5. Video Duration
              </span>
              <span className="font-mono text-emerald-400 font-semibold">{project.duration} Seconds</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={project.duration}
              onChange={(e) => onChange({ duration: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>5s (Short)</span>
              <span>12s (Standard Reel)</span>
              <span>30s (Long Story)</span>
            </div>
          </div>

          {/* 6. Text Flow Speed */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" /> 6. Text Flow Speed
              </span>
              <span className="font-mono text-amber-400 font-semibold">{project.textSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={project.textSpeed}
              onChange={(e) => onChange({ textSpeed: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 7. Motion Intensity */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>7. Motion Intensity</span>
              <span className="font-mono text-rose-400 font-semibold">{project.motionIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.5"
              value={project.motionIntensity}
              onChange={(e) => onChange({ motionIntensity: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 5. Atmosphere, Overlays & Social Preview */}
      <section className="rounded-2xl border border-neutral-800/90 bg-neutral-900/60 p-4.5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Atmosphere & Overlays</span>
          </div>
        </div>

        <div className="mt-3.5 space-y-3">
          {/* Vignette darkness */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Dark Vignette Contrast</span>
              <span>{Math.round(project.vignetteDarkness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.8"
              step="0.05"
              value={project.vignetteDarkness}
              onChange={(e) => onChange({ vignetteDarkness: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Toggle Atmosphere Elements */}
          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Floating Dust / Bokeh Particles</span>
              <input
                type="checkbox"
                checked={project.showDustParticles}
                onChange={(e) => onChange({ showDustParticles: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-800 text-rose-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Golden Light Leak Flare</span>
              <input
                type="checkbox"
                checked={project.showLightLeak}
                onChange={(e) => onChange({ showLightLeak: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-800 text-rose-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-neutral-300">Vintage Film Grain Noise</span>
              <input
                type="checkbox"
                checked={project.showGrain}
                onChange={(e) => onChange({ showGrain: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-800 text-rose-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-neutral-800">
              <span className="text-neutral-300 font-medium">TikTok / Reels Screen UI Mockup</span>
              <input
                type="checkbox"
                checked={project.showTikTokOverlay}
                onChange={(e) => onChange({ showTikTokOverlay: e.target.checked })}
                className="rounded border-neutral-700 bg-neutral-800 text-rose-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};
