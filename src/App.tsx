import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SidebarControls } from './components/SidebarControls';
import { VideoPreview } from './components/VideoPreview';
import { AIPoetryModal } from './components/AIPoetryModal';
import { PresetsModal } from './components/PresetsModal';
import { ExportModal } from './components/ExportModal';
import { PoetryProject, PoetryPresetItem } from './types';
import { INITIAL_PROJECT } from './utils/presetData';
import { soundEngine } from './utils/audioSynth';
import { exportPoetryVideo } from './utils/videoRenderer';

export default function App() {
  const [project, setProject] = useState<PoetryProject>(INITIAL_PROJECT);
  const [isAIPoetryOpen, setIsAIPoetryOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Audio test preview state
  const [isPlayingMusicPreview, setIsPlayingMusicPreview] = useState(false);

  // Video Export States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentExportSec, setCurrentExportSec] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedMimeType, setExportedMimeType] = useState<string>('video/webm');

  // Cached image for export
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.backgroundImageUrl;
    img.onload = () => {
      imageRef.current = img;
    };
    img.onerror = () => {
      imageRef.current = null;
    };
  }, [project.backgroundImageUrl]);

  const handleProjectChange = (updated: Partial<PoetryProject>) => {
    setProject((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleMusicPreview = () => {
    if (isPlayingMusicPreview) {
      soundEngine.stop();
      setIsPlayingMusicPreview(false);
    } else {
      soundEngine.play(project.presetMusic, 0, project.audioVolume);
      setIsPlayingMusicPreview(true);
    }
  };

  const handleSelectPreset = (preset: PoetryPresetItem) => {
    handleProjectChange({
      poetryText: preset.lines.join('\n'),
      authorOrTag: `— ${preset.poet}`,
      presetMusic: preset.suggestedMusic,
      motionType: preset.suggestedMotion,
      fontFamily: preset.language === 'Urdu' ? 'Noto Nastaliq Urdu' : 'Cinzel',
    });
  };

  const handleApplyAIPoetry = (data: {
    poetry: string;
    author: string;
    fontFamily?: any;
    suggestedMusic?: any;
    suggestedMotion?: any;
  }) => {
    handleProjectChange({
      poetryText: data.poetry,
      authorOrTag: data.author,
      ...(data.fontFamily ? { fontFamily: data.fontFamily } : {}),
      ...(data.suggestedMusic ? { presetMusic: data.suggestedMusic } : {}),
      ...(data.suggestedMotion ? { motionType: data.suggestedMotion } : {}),
    });
  };

  const handleStartExport = async (videoEl: HTMLVideoElement | null) => {
    if (isPlayingMusicPreview) {
      soundEngine.stop();
      setIsPlayingMusicPreview(false);
    }

    setIsExportModalOpen(true);
    setIsProcessingVideo(true);
    setProgressPercent(0);
    setCurrentExportSec(0);
    setExportedVideoUrl(null);

    try {
      const dummyCanvas = document.createElement('canvas');
      const result = await exportPoetryVideo({
        canvas: dummyCanvas,
        project,
        img: imageRef.current,
        video: videoEl,
        onProgress: (percent, currentSec) => {
          setProgressPercent(percent);
          setCurrentExportSec(currentSec);
        },
      });

      setExportedVideoUrl(result.url);
      setExportedMimeType(result.mimeType);
      setIsProcessingVideo(false);
    } catch (err) {
      console.error('Export error:', err);
      setIsProcessingVideo(false);
      alert('Video export could not be completed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        onOpenAIGenerator={() => setIsAIPoetryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sidebar Controls (8 Streamlit Controls + Atmosphere) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-4">
            <SidebarControls
              project={project}
              onChange={handleProjectChange}
              onOpenAIGenerator={() => setIsAIPoetryOpen(true)}
              onOpenPresets={() => setIsPresetsOpen(true)}
              isPlayingMusicPreview={isPlayingMusicPreview}
              onToggleMusicPreview={handleToggleMusicPreview}
            />
          </div>

          {/* Right Column: 9:16 Video Player & Export */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20">
            <VideoPreview
              project={project}
              onStartExport={handleStartExport}
              isExporting={isProcessingVideo}
            />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-400">
        <p className="flex items-center justify-center gap-2">
          <span>✨</span>
          <span className="font-semibold text-rose-300">Poetify</span>
          <span>• 9:16 Aesthetic Poetry Video Generator for TikTok, Instagram Reels & YouTube Shorts</span>
        </p>
      </footer>

      {/* Modals */}
      <AIPoetryModal
        isOpen={isAIPoetryOpen}
        onClose={() => setIsAIPoetryOpen(false)}
        onApplyPoetry={handleApplyAIPoetry}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportedVideoUrl(null);
        }}
        isProcessing={isProcessingVideo}
        progressPercent={progressPercent}
        currentSecond={currentExportSec}
        totalDuration={project.duration}
        videoUrl={exportedVideoUrl}
        mimeType={exportedMimeType}
      />
    </div>
  );
}
