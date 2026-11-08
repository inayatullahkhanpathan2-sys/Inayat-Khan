import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Download,
  Film,
  Music2,
  Share2,
} from 'lucide-react';
import { PoetryProject } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, renderFrame } from '../utils/videoRenderer';
import { soundEngine } from '../utils/audioSynth';

interface VideoPreviewProps {
  project: PoetryProject;
  onStartExport: (videoEl: HTMLVideoElement | null) => void;
  isExporting: boolean;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  project,
  onStartExport,
  isExporting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Load background image when project.backgroundImageUrl changes
  useEffect(() => {
    if (project.mediaType !== 'photo') return;
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.backgroundImageUrl;
    img.onload = () => {
      if (!isCancelled) {
        setLoadedImg(img);
      }
    };
    img.onerror = () => {
      if (!isCancelled) {
        console.warn('Failed to load image, using fallback canvas styling');
        setLoadedImg(null);
      }
    };
    return () => {
      isCancelled = true;
    };
  }, [project.backgroundImageUrl, project.mediaType]);

  // Load video when project.backgroundVideoUrl changes
  useEffect(() => {
    if (project.mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [project.backgroundVideoUrl, project.mediaType, isPlaying]);

  // Render canvas frame when currentTime, project, loadedImg or video frame updates
  const draw = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      renderFrame(ctx, loadedImg, videoRef.current, project, time);
    },
    [loadedImg, project]
  );

  useEffect(() => {
    draw(currentTime);
  }, [currentTime, draw]);

  // Playback loop
  const animate = useCallback(
    (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= project.duration) {
          // Loop around
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
          soundEngine.play(project.presetMusic, 0, isMuted ? 0 : project.audioVolume);
          return 0;
        }
        return next;
      });

      requestRef.current = requestAnimationFrame(animate);
    },
    [project.duration, project.presetMusic, project.audioVolume, isMuted]
  );

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      soundEngine.stop();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    } else {
      setIsPlaying(true);
      lastTimeRef.current = performance.now();
      if (videoRef.current && project.mediaType === 'video') {
        videoRef.current.currentTime = currentTime % (videoRef.current.duration || project.duration);
        videoRef.current.play().catch(() => {});
      }
      soundEngine.play(project.presetMusic, currentTime, isMuted ? 0 : project.audioVolume);
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  const handleReset = () => {
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    if (isPlaying) {
      soundEngine.play(project.presetMusic, 0, isMuted ? 0 : project.audioVolume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = time % videoRef.current.duration;
    }
    if (isPlaying) {
      soundEngine.play(project.presetMusic, time, isMuted ? 0 : project.audioVolume);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setVolume(nextMuted ? 0 : project.audioVolume);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundEngine.stop();
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const ms = Math.floor((secs % 1) * 10);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
      {/* 9:16 Smartphone Mockup Preview Frame */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-[9/16] rounded-[2.5rem] p-3 border-[6px] border-neutral-800/90 bg-neutral-900 shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
      >
        {/* Smartphone Speaker Ear Piece / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full bg-neutral-950/90 px-3 py-1 border border-neutral-800">
          <div className="h-2 w-2 rounded-full bg-rose-500/80 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-neutral-400">9:16 HD</span>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full object-cover cursor-pointer select-none"
            onClick={handlePlayPause}
          />

          {/* Quick Play/Pause Center Overlay on Hover/Pause */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all hover:bg-black/20 group"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/90 text-white shadow-xl shadow-rose-950/50 transition-transform group-hover:scale-110 group-active:scale-95">
                <Play className="h-8 w-8 translate-x-0.5 fill-current" />
              </div>
            </button>
          )}

          {/* Floating Music Track Badge */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] text-white border border-white/10">
            <Music2 className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="truncate max-w-[90px]">{project.customAudioName || project.presetMusic}</span>
          </div>

          {/* Floating Motion Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] text-neutral-300 border border-white/10">
            <span>{project.motionType}</span>
          </div>
        </div>
      </div>

      {/* Video Player Timeline Controls */}
      <div className="w-full max-w-[370px] mt-4 space-y-3">
        {/* Scrubber bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 min-w-[50px] text-left">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={project.duration}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-rose-500 h-2 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-neutral-400 min-w-[50px] text-right">
            {formatTime(project.duration)}
          </span>
        </div>

        {/* Player Action Buttons */}
        <div className="flex items-center justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-2.5 backdrop-blur-md">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePlayPause}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white transition-all hover:bg-rose-600 active:scale-95"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 translate-x-0.5 fill-current" />
              )}
            </button>

            <button
              onClick={handleReset}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={handleToggleMute}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                isMuted
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Real-time 9:16 Canvas</span>
          </div>
        </div>

        {/* Hidden Video element for video background playback & canvas capture */}
        {project.mediaType === 'video' && project.backgroundVideoUrl && (
          <video
            ref={videoRef}
            src={project.backgroundVideoUrl}
            crossOrigin="anonymous"
            playsInline
            loop
            muted={project.videoAudioMode === 'mute' || isMuted}
            className="hidden"
            onLoadedMetadata={() => {
              draw(currentTime);
            }}
            onCanPlay={() => {
              draw(currentTime);
            }}
          />
        )}

        {/* Streamlit Main Action Button: 🚀 Generate Poetry Video */}
        <button
          onClick={() => {
            if (isPlaying) handlePlayPause();
            onStartExport(videoRef.current);
          }}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-violet-600 p-4 text-base font-bold text-white shadow-xl shadow-rose-950/40 transition-all hover:brightness-110 active:scale-98 disabled:opacity-60"
        >
          <Film className="h-5 w-5 animate-bounce" />
          <span>🚀 Generate Poetry Video</span>
        </button>

        <p className="text-center text-xs text-neutral-400">
          Exports crisp 1080x1920 video with motion sway & background sound ready for TikTok/Reels!
        </p>
      </div>
    </div>
  );
};
