// Web Audio API Synthesizer and Player for 9:16 Aesthetic Poetry Videos
import { PresetMusicType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private streamDest: MediaStreamAudioDestinationNode | null = null;
  private isPlaying = false;
  private customBuffer: AudioBuffer | null = null;
  private customSource: AudioBufferSourceNode | null = null;
  private customBufferStartTime = 0;
  private customBufferOffset = 0;
  
  // Synthesizer timers & nodes
  private synthInterval: any = null;
  private activeOscillators: OscillatorNode[] = [];
  private noiseNode: AudioNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      
      // Connect to speakers
      this.masterGain.connect(this.ctx.destination);
      
      // Also connect to MediaStream destination for video recorder export
      this.streamDest = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.streamDest);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioStreamDestination(): MediaStreamAudioDestinationNode {
    this.initContext();
    return this.streamDest!;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public async loadCustomAudio(file: File): Promise<string> {
    this.initContext();
    const arrayBuffer = await file.arrayBuffer();
    this.customBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
    return file.name;
  }

  public stop() {
    this.isPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeOscillators = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }

    if (this.customSource) {
      try {
        this.customSource.stop();
        this.customSource.disconnect();
      } catch {}
      this.customSource = null;
    }
  }

  public play(preset: PresetMusicType, startOffsetSeconds: number = 0, volume: number = 0.8) {
    this.initContext();
    this.stop();
    this.isPlaying = true;
    this.setVolume(volume);

    // If custom audio buffer is loaded, play that
    if (this.customBuffer) {
      const source = this.ctx!.createBufferSource();
      source.buffer = this.customBuffer;
      source.loop = true;
      source.connect(this.masterGain!);
      
      const offset = startOffsetSeconds % this.customBuffer.duration;
      source.start(0, offset);
      this.customSource = source;
      this.customBufferStartTime = this.ctx!.currentTime;
      this.customBufferOffset = offset;
      return;
    }

    if (preset === 'None / Upload Own') {
      return;
    }

    // Play synthesized preset tracks
    if (preset === 'Aesthetic Lofi') {
      this.playLofiPreset(startOffsetSeconds);
    } else if (preset === 'Sad Piano') {
      this.playSadPianoPreset(startOffsetSeconds);
    } else if (preset === 'Romantic Flute') {
      this.playFlutePreset(startOffsetSeconds);
    } else if (preset === 'Sufi Ambient') {
      this.playSufiPreset(startOffsetSeconds);
    } else if (preset === 'Nostalgic Acoustic') {
      this.playAcousticPreset(startOffsetSeconds);
    }
  }

  // Preset 1: Aesthetic Lofi (electric rhodes chords + subtle vinyl crackle)
  private playLofiPreset(offset: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];
    let step = Math.floor((offset / 2.5) % chords.length);

    // Subtle vinyl crackle generator
    this.createVinylCrackle();

    const playChordStep = () => {
      if (!this.isPlaying) return;
      const notes = chords[step % chords.length];
      step++;
      const now = ctx.currentTime;
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        // Warm lowpass filter for lofi chill warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.12 + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + idx * 0.03);
        osc.stop(now + 2.5);
        this.activeOscillators.push(osc);
      });
    };

    playChordStep();
    this.synthInterval = setInterval(playChordStep, 2400);
  }

  // Preset 2: Sad Piano (Melancholic slow arpeggios with long ringing decay)
  private playSadPianoPreset(offset: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const arpeggios = [
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [130.81, 164.81, 196.00, 261.63], // C
      [164.81, 196.00, 246.94, 329.63], // Em
    ];
    let chordIdx = Math.floor((offset / 3.2) % arpeggios.length);
    let noteIdx = 0;

    const playNote = () => {
      if (!this.isPlaying) return;
      const currentChord = arpeggios[chordIdx % arpeggios.length];
      const freq = currentChord[noteIdx % currentChord.length];
      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx++;
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 3.0);
      this.activeOscillators.push(osc);
    };

    playNote();
    this.synthInterval = setInterval(playNote, 750);
  }

  // Preset 3: Romantic Flute (airy wooden flute phrases)
  private playFlutePreset(offset: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    // Pentatonic romantic notes
    const melody = [
      440.00, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88,
      440.00, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23, 392.00
    ];
    let step = Math.floor((offset / 1.4) % melody.length);

    const playPhrase = () => {
      if (!this.isPlaying) return;
      const freq = melody[step % melody.length];
      step++;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Natural flute vibrato (5Hz)
      vibrato.frequency.setValueAtTime(5.2, now);
      vibratoGain.gain.setValueAtTime(3.5, now);
      vibrato.connect(osc.frequency);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      vibrato.start(now);
      osc.start(now);
      vibrato.stop(now + 1.9);
      osc.stop(now + 1.9);
      this.activeOscillators.push(osc);
    };

    playPhrase();
    this.synthInterval = setInterval(playPhrase, 1400);
  }

  // Preset 4: Sufi Ambient (Deep meditative drone + overtone bowls)
  private playSufiPreset(offset: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const rootFreq = 146.83; // D3 root
    const fifthFreq = 220.00; // A3 fifth
    const octaveFreq = 293.66; // D4

    // Continuous deep drone
    [rootFreq, fifthFreq, octaveFreq].forEach((f, idx) => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(f, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 100, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      this.activeOscillators.push(osc);
    });

    // Occasional singing chime
    const bellFrequencies = [587.33, 739.99, 880.00, 1174.66];
    let bIdx = 0;
    const playBowl = () => {
      if (!this.isPlaying) return;
      const f = bellFrequencies[bIdx % bellFrequencies.length];
      bIdx++;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 4.0);
      this.activeOscillators.push(osc);
    };

    playBowl();
    this.synthInterval = setInterval(playBowl, 2800);
  }

  // Preset 5: Nostalgic Acoustic (warm nylon pluck progressions)
  private playAcousticPreset(offset: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const pattern = [
      196.00, 246.94, 293.66, 392.00, // G progression
      164.81, 246.94, 329.63, 392.00, // Em progression
      174.61, 220.00, 261.63, 349.23, // F progression
      146.83, 220.00, 293.66, 369.99  // D progression
    ];
    let step = Math.floor((offset / 0.5) % pattern.length);

    const playPluck = () => {
      if (!this.isPlaying) return;
      const freq = pattern[step % pattern.length];
      step++;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.8);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.2);
      this.activeOscillators.push(osc);
    };

    playPluck();
    this.synthInterval = setInterval(playPluck, 550);
  }

  // Vinyl noise texture
  private createVinylCrackle() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Occasional pop/crackle + pink noise
        const pop = Math.random() < 0.0008 ? (Math.random() - 0.5) * 0.4 : 0;
        data[i] = (Math.random() * 2 - 1) * 0.004 + pop;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
      this.noiseNode = noise;
    } catch {}
  }

  public clearCustomAudio() {
    if (this.customSource) {
      try {
        this.customSource.stop();
        this.customSource.disconnect();
      } catch {}
      this.customSource = null;
    }
    this.customBuffer = null;
  }
}

export const soundEngine = new SoundEngine();
