import React from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Loader2,
  Film,
  Sparkles,
  Share2,
  RefreshCw,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProcessing: boolean;
  progressPercent: number;
  currentSecond: number;
  totalDuration: number;
  videoUrl: string | null;
  mimeType: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  isProcessing,
  progressPercent,
  currentSecond,
  totalDuration,
  videoUrl,
  mimeType,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    a.download = `poetify_poetry_video_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900/95 p-6 shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md ring-1 ring-amber-400/30">
              <img src="/poetify-logo.png" alt="Poetify" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Poetify Render Studio</span>
              </h2>
              <p className="text-xs text-neutral-400">1080x1920 HD Export for TikTok & Reels</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {isProcessing ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-neutral-800 border-t-rose-500 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-amber-300 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Video processing ho rahi hai...
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Baraye meharbani intizar karein, cinematic motion aur sound mix ho raha hai.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-xs space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span>Progress: {progressPercent}%</span>
                  <span>{currentSecond.toFixed(1)}s / {totalDuration}s</span>
                </div>
                <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-600 rounded-full transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 font-mono">
                {progressPercent < 30
                  ? 'Rendering background motion & vignette layers...'
                  : progressPercent < 75
                  ? 'Sequencing poetic calligraphy & glowing typography...'
                  : 'Synthesizing audio soundtrack & encoding final 9:16 video...'}
              </div>
            </div>
          ) : videoUrl ? (
            <div className="space-y-4 text-center">
              {/* Success Banner */}
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-300 text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>✨ Video Safalta Se Tayar Ho Gayi Hai!</span>
              </div>

              {/* Video Player Preview */}
              <div className="mx-auto w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-black">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Download Button (Matching Streamlit: 📥 Download HD 9:16 Video) */}
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 text-base font-bold text-white shadow-xl shadow-emerald-950/40 hover:brightness-110 active:scale-98"
              >
                <Download className="h-5 w-5" />
                <span>📥 Download HD 9:16 Video</span>
              </button>

              <button
                onClick={onClose}
                className="w-full rounded-xl border border-neutral-800 py-2.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Close & Edit Another Video
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
