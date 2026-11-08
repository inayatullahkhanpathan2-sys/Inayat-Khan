// Canvas 9:16 Video Rendering Engine & Video Exporter
import { PoetryProject } from '../types';
import { soundEngine } from './audioSynth';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1920;

// Pre-seeded dust particles for consistent motion
interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftSpeed: number;
  opacity: number;
}

const particles: Particle[] = Array.from({ length: 60 }, () => ({
  x: Math.random() * CANVAS_WIDTH,
  y: Math.random() * CANVAS_HEIGHT,
  radius: Math.random() * 2.8 + 1.0,
  speedY: Math.random() * 25 + 15,
  driftSpeed: Math.random() * 2 + 1,
  opacity: Math.random() * 0.6 + 0.2,
}));

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  video: HTMLVideoElement | null,
  project: PoetryProject,
  currentTime: number,
  previewScale: number = 1
) {
  const t = Math.max(0, currentTime);
  const duration = Math.max(1, project.duration);
  const progress = Math.min(1, t / duration);

  // Clear canvas
  ctx.save();
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 1. Calculate Motion Matrix (matching Streamlit python script)
  let shiftX = 0;
  let shiftY = 0;
  let scale = 1.0 + progress * 0.06 * project.motionIntensity;

  if (project.motionType === 'Cold Breeze Sway') {
    shiftX = Math.sin(t * 2) * 12 * project.motionIntensity;
    shiftY = Math.cos(t * 1.2) * 4 * project.motionIntensity;
  } else if (project.motionType === 'Human Walk Drift') {
    shiftY = Math.cos(t * 1.5) * 10 * project.motionIntensity;
    shiftX = Math.sin(t * 0.8) * 4 * project.motionIntensity;
  } else if (project.motionType === 'Slow Zoom-In') {
    scale = 1.0 + progress * 0.08 * project.motionIntensity;
  } else if (project.motionType === 'Cinematic Pan') {
    shiftX = (progress - 0.5) * 35 * project.motionIntensity;
  } else if (project.motionType === 'Gentle Pulse') {
    scale = 1.0 + Math.sin(t * 1.8) * 0.025 * project.motionIntensity;
  }

  // 2. Draw Background Media (Video or Photo) with Cover fit & Motion Transform
  let hasDrawnMedia = false;

  if (project.mediaType === 'video' && video && video.readyState >= 2 && video.videoWidth > 0) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    let drawW: number;
    let drawH: number;

    if (videoRatio > canvasRatio) {
      drawH = CANVAS_HEIGHT * 1.15;
      drawW = drawH * videoRatio;
    } else {
      drawW = CANVAS_WIDTH * 1.15;
      drawH = drawW / videoRatio;
    }

    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2 + shiftX, CANVAS_HEIGHT / 2 + shiftY);
    ctx.scale(scale, scale);
    ctx.drawImage(video, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    hasDrawnMedia = true;
  } else if (img && img.complete && img.naturalWidth > 0) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
    let drawW: number;
    let drawH: number;

    if (imgRatio > canvasRatio) {
      drawH = CANVAS_HEIGHT * 1.15; // extra room for sway
      drawW = drawH * imgRatio;
    } else {
      drawW = CANVAS_WIDTH * 1.15;
      drawH = drawW / imgRatio;
    }

    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2 + shiftX, CANVAS_HEIGHT / 2 + shiftY);
    ctx.scale(scale, scale);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
    hasDrawnMedia = true;
  }

  if (!hasDrawnMedia) {
    // Elegant fallback gradient if media not loaded yet
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    grad.addColorStop(0, '#1c1c24');
    grad.addColorStop(0.5, '#121217');
    grad.addColorStop(1, '#08080a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  // 3. Vignette & Contrast Overlay (Python equivalent: cv2.addWeighted)
  const vignetteGrad = ctx.createLinearGradient(0, CANVAS_HEIGHT * 0.35, 0, CANVAS_HEIGHT);
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(0.4, `rgba(0, 0, 0, ${project.vignetteDarkness * 0.5})`);
  vignetteGrad.addColorStop(1, `rgba(0, 0, 0, ${Math.min(0.95, project.vignetteDarkness * 1.25)})`);
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle top vignette for upper visual balance
  const topVignette = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT * 0.25);
  topVignette.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  topVignette.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topVignette;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 0.25);

  // 4. Vintage Light Leak (Warm sun ray at top right)
  if (project.showLightLeak) {
    const leakX = CANVAS_WIDTH * 0.85 + Math.sin(t * 0.5) * 40;
    const leakY = CANVAS_HEIGHT * 0.15 + Math.cos(t * 0.4) * 30;
    const leakGrad = ctx.createRadialGradient(leakX, leakY, 10, leakX, leakY, 550);
    leakGrad.addColorStop(0, 'rgba(255, 200, 140, 0.25)');
    leakGrad.addColorStop(0.4, 'rgba(255, 120, 160, 0.12)');
    leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = leakGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();
  }

  // 5. Floating Dust / Bokeh Motes
  if (project.showDustParticles) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const activeParticles = particles.slice(0, project.particleCount);
    activeParticles.forEach((p, idx) => {
      const currentY = (p.y - t * p.speedY) % CANVAS_HEIGHT;
      const wrappedY = currentY < 0 ? currentY + CANVAS_HEIGHT : currentY;
      const currentX = p.x + Math.sin(t * p.driftSpeed + idx) * 20;

      ctx.beginPath();
      ctx.arc(currentX, wrappedY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 245, 220, ${p.opacity * (0.8 + 0.2 * Math.sin(t * 3 + idx))})`;
      ctx.shadowColor = 'rgba(255, 230, 180, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    });
    ctx.restore();
  }

  // 6. Text Animation Flow (Sequential line-by-line reveal)
  const lines = project.poetryText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const startTextTime = project.introHoldSeconds;
  const lineInterval = 2.0 / project.textSpeed;

  if (t >= startTextTime && lines.length > 0) {
    const elapsedTextTime = (t - startTextTime);
    
    // Calculate total height needed for text block
    const lineHeight = project.fontSize * 1.55;
    const basePosY = (project.textPositionPercentY / 100) * CANVAS_HEIGHT;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = basePosY - totalBlockHeight / 2;

    lines.forEach((line, idx) => {
      const lineStartTime = idx * lineInterval;
      if (elapsedTextTime < lineStartTime) return;

      const lineAge = elapsedTextTime - lineStartTime;
      // Smooth fade and upward float
      const lineAlpha = Math.min(1.0, lineAge / 0.7);
      const floatY = (1.0 - lineAlpha) * 18;
      const lineY = startY + idx * lineHeight - floatY;

      ctx.save();
      ctx.globalAlpha = lineAlpha;

      // Font style & alignment
      ctx.font = `600 ${project.fontSize}px "${project.fontFamily}", "Noto Nastaliq Urdu", serif`;
      ctx.textAlign = project.textAlign;
      ctx.textBaseline = 'middle';

      let textX = CANVAS_WIDTH / 2;
      if (project.textAlign === 'right') {
        textX = CANVAS_WIDTH - 120;
      } else if (project.textAlign === 'left') {
        textX = 120;
      }

      // Soft drop shadow / glow
      ctx.shadowColor = project.shadowColor;
      ctx.shadowBlur = project.glowEffect ? 20 : 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      // Draw main text
      ctx.fillStyle = project.textColor;
      ctx.fillText(line, textX, lineY);

      // Subtle extra glow pass if glowEffect enabled
      if (project.glowEffect) {
        ctx.shadowBlur = 35;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(line, textX, lineY);
      }

      ctx.restore();
    });

    // Author / Signature Tag (fades in after last line)
    if (project.authorOrTag.trim()) {
      const allLinesVisibleTime = lines.length * lineInterval;
      if (elapsedTextTime > allLinesVisibleTime) {
        const authorAlpha = Math.min(0.85, (elapsedTextTime - allLinesVisibleTime) / 0.8);
        ctx.save();
        ctx.globalAlpha = authorAlpha;
        ctx.font = `italic 400 ${Math.round(project.fontSize * 0.55)}px "Inter", "Amiri", sans-serif`;
        ctx.textAlign = project.textAlign;
        ctx.fillStyle = '#E2E8F0';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        
        let authorX = CANVAS_WIDTH / 2;
        if (project.textAlign === 'right') authorX = CANVAS_WIDTH - 120;
        else if (project.textAlign === 'left') authorX = 120;
        
        const authorY = startY + lines.length * lineHeight + 24;
        ctx.fillText(project.authorOrTag, authorX, authorY);
        ctx.restore();
      }
    }
  }

  // 7. Social Media TikTok / Reels Overlay Mockup
  if (project.showTikTokOverlay) {
    drawSocialOverlay(ctx, project, t);
  }

  // 8. Film Grain Overlay
  if (project.showGrain && project.grainIntensity > 0) {
    ctx.save();
    ctx.globalAlpha = project.grainIntensity;
    ctx.fillStyle = '#ffffff';
    // Draw tiny random noise specks
    for (let i = 0; i < 450; i++) {
      const rx = Math.random() * CANVAS_WIDTH;
      const ry = Math.random() * CANVAS_HEIGHT;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }
    ctx.restore();
  }

  ctx.restore();
}

function drawSocialOverlay(ctx: CanvasRenderingContext2D, project: PoetryProject, t: number) {
  ctx.save();
  // Right side interaction column
  const rightX = CANVAS_WIDTH - 90;
  const startActionY = CANVAS_HEIGHT - 600;

  // Icons mockup with circular buttons
  const actions = [
    { label: '142.8K', icon: '❤️' },
    { label: '3,842', icon: '💬' },
    { label: '28.1K', icon: '🔖' },
    { label: 'Share', icon: '↗️' },
  ];

  actions.forEach((act, idx) => {
    const y = startActionY + idx * 110;
    // Icon circle
    ctx.beginPath();
    ctx.arc(rightX, y, 32, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(act.icon, rightX, y);

    ctx.font = '500 20px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(act.label, rightX, y + 46);
  });

  // Spinning disc with sound note at bottom right
  const discY = CANVAS_HEIGHT - 130;
  ctx.save();
  ctx.translate(rightX, discY);
  ctx.rotate(t * 3);
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#18181b';
  ctx.fill();
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#f43f5e';
  ctx.fill();
  ctx.restore();

  // Floating musical note
  const noteAngle = (t * 2) % (Math.PI * 2);
  const noteX = rightX - 50 + Math.cos(noteAngle) * 20;
  const noteY = discY - 40 - ((t * 40) % 70);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('🎵', noteX, noteY);

  // Bottom left user profile & tags
  ctx.textAlign = 'left';
  ctx.font = '600 28px "Inter", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('@poetify.studio', 60, CANVAS_HEIGHT - 140);

  ctx.font = '400 22px "Inter", sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('#poetify #poetry #urdupoetry #reels #aesthetic', 60, CANVAS_HEIGHT - 100);

  ctx.font = '400 20px "Inter", sans-serif';
  ctx.fillText(`♫ ${project.presetMusic} - Original Audio`, 60, CANVAS_HEIGHT - 65);

  ctx.restore();
}

export interface VideoExportOptions {
  canvas: HTMLCanvasElement;
  project: PoetryProject;
  img: HTMLImageElement | null;
  video: HTMLVideoElement | null;
  onProgress: (percent: number, currentSec: number) => void;
}

export async function exportPoetryVideo({
  canvas,
  project,
  img,
  video,
  onProgress,
}: VideoExportOptions): Promise<{ blob: Blob; url: string; mimeType: string }> {
  const fps = 30;
  const duration = project.duration;
  const totalFrames = Math.floor(duration * fps);
  
  // Set up offscreen high-res canvas (1080x1920)
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = CANVAS_WIDTH;
  exportCanvas.height = CANVAS_HEIGHT;
  const exportCtx = exportCanvas.getContext('2d', { alpha: false })!;

  // Prepare audio stream from synthesizer
  const audioDest = soundEngine.getAudioStreamDestination();
  const audioStream = audioDest.stream;

  // Capture canvas video stream
  const canvasStream = exportCanvas.captureStream(fps);
  
  // Combine video and audio tracks
  const combinedTracks: MediaStreamTrack[] = [
    ...canvasStream.getVideoTracks(),
    ...audioStream.getAudioTracks(),
  ];
  const combinedStream = new MediaStream(combinedTracks);

  // Determine supported mime type
  const mimeTypes = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  let selectedMime = 'video/webm';
  for (const m of mimeTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      selectedMime = m;
      break;
    }
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType: selectedMime,
    videoBitsPerSecond: 8000000, // 8 Mbps high quality 1080p
  });

  const recordedChunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  return new Promise(async (resolve, reject) => {
    mediaRecorder.onstop = () => {
      soundEngine.stop();
      if (video) {
        video.pause();
      }
      const blob = new Blob(recordedChunks, { type: selectedMime });
      const url = URL.createObjectURL(blob);
      resolve({ blob, url, mimeType: selectedMime });
    };

    mediaRecorder.onerror = (err) => {
      soundEngine.stop();
      if (video) {
        video.pause();
      }
      reject(err);
    };

    // If video background, sync video playback
    if (video) {
      video.currentTime = 0;
      if (project.videoAudioMode === 'mute') {
        video.muted = true;
      } else {
        video.muted = false;
        video.volume = project.videoVolume;
      }
      try {
        await video.play();
      } catch {}
    }

    // Start audio playback synchronized with recording
    soundEngine.play(project.presetMusic, 0, project.audioVolume);
    mediaRecorder.start(200); // chunk every 200ms

    // Render frame by frame at real-time pace so Web Audio stays in sync
    const frameIntervalMs = 1000 / fps;
    let currentFrame = 0;

    const renderStep = () => {
      if (currentFrame >= totalFrames) {
        // Finished recording
        setTimeout(() => {
          mediaRecorder.stop();
        }, 300);
        return;
      }

      const currentTime = currentFrame / fps;
      if (video && video.duration) {
        // keep video in sync with export time
        video.currentTime = currentTime % video.duration;
      }

      renderFrame(exportCtx, img, video, project, currentTime, 1);

      const percent = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
      onProgress(percent, Math.round(currentTime * 10) / 10);

      currentFrame++;
      setTimeout(renderStep, frameIntervalMs);
    };

    renderStep();
  });
}

