
type SoundName = 'start' | 'correct' | 'incorrect' | 'powerup' | 'win' | 'lose' | 'skip';

class SoundService {
  private _isMuted: boolean;
  public isInitialized: boolean;
  private audioContext: AudioContext | null;
  private noiseBuffer: AudioBuffer | null;

  constructor() {
    this.audioContext = null;
    this._isMuted = true; // Start muted until user interacts
    this.isInitialized = false;
    this.noiseBuffer = null;
  }

  // Must be called after a user interaction (e.g., a click)
  init() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }
    
    try {
        console.log("Initializing audio service with Web Audio API...");
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.createNoiseBuffer();
        this.isInitialized = true;
        this._isMuted = false; // Unmute after first interaction
        console.log("Audio service initialized. Sound is now ON.");
    } catch (e) {
        console.error("Web Audio API is not supported in this browser.", e);
        this.isInitialized = false;
    }
  }

  private createNoiseBuffer() {
      if (!this.audioContext) return;
      const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds buffer
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
  }

  play(soundName: SoundName) {
    if (!this.isInitialized || this._isMuted || !this.audioContext) {
      return;
    }

    // In some cases, the audio context might get suspended.
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    gainNode.gain.setValueAtTime(0, now);

    switch (soundName) {
      case 'start':
        // Ascending notes C4, E4, G4
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        
        oscillator.frequency.setValueAtTime(261.63, now);
        oscillator.frequency.setValueAtTime(329.63, now + 0.1);
        oscillator.frequency.setValueAtTime(392.00, now + 0.2);

        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case 'correct':
        // A quick, high-pitched "bling"
        oscillator.type = 'triangle';
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
        
        oscillator.frequency.setValueAtTime(1046.50, now); // C6
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'incorrect':
        // A short, low-pitched "buzz"
        oscillator.type = 'sawtooth';
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        
        oscillator.frequency.setValueAtTime(130.81, now); // C3
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
        
      case 'powerup':
        // A rising sound effect
        oscillator.type = 'square';
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        oscillator.frequency.setValueAtTime(440, now); // A4
        oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.3); // A5
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;
      
      case 'skip':
        if (!this.noiseBuffer || !this.audioContext) break;
        // A quick "whoosh" sound
        const skipNoise = this.audioContext.createBufferSource();
        skipNoise.buffer = this.noiseBuffer;

        const skipFilter = this.audioContext.createBiquadFilter();
        skipFilter.type = 'bandpass';
        skipFilter.frequency.setValueAtTime(800, now);
        skipFilter.frequency.exponentialRampToValueAtTime(4000, now + 0.2);
        skipFilter.Q.setValueAtTime(10, now);

        const skipGain = this.audioContext.createGain();
        skipGain.gain.setValueAtTime(0, now);
        skipGain.gain.linearRampToValueAtTime(0.3, now + 0.01);
        skipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        skipNoise.connect(skipFilter);
        skipFilter.connect(skipGain);
        skipGain.connect(this.audioContext.destination);

        skipNoise.start(now);
        skipNoise.stop(now + 0.2);
        break;

      case 'win':
        // A cheerful, multi-note fanfare
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
        
        // C5, E5, G5, C6
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        oscillator.frequency.setValueAtTime(783.99, now + 0.2);
        oscillator.frequency.setValueAtTime(1046.50, now + 0.3);

        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.6);
        oscillator.start(now);
        oscillator.stop(now + 0.6);
        break;
      
      case 'lose':
        if (!this.noiseBuffer || !this.audioContext) break;

        // A more complex, filtered noise "power down" sound
        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.8);
        filter.Q.setValueAtTime(15, now); // Resonance for a "whoosh"

        const loseGainNode = this.audioContext.createGain();
        loseGainNode.gain.setValueAtTime(0.3, now);
        loseGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        noiseSource.connect(filter);
        filter.connect(loseGainNode);
        loseGainNode.connect(this.audioContext.destination);

        noiseSource.start(now);
        noiseSource.stop(now + 1);
        break;

      default:
        oscillator.disconnect();
        gainNode.disconnect();
        break;
    }
  }

  toggleMute(): boolean {
    // Cannot mute/unmute before initialization
    if (!this.isInitialized) {
        return this._isMuted;
    }
    this._isMuted = !this._isMuted;
    console.log(`Sound is now ${this._isMuted ? 'Muted' : 'Unmuted'}.`);

    // If unmuting, and the context was suspended, it's a good time to try resuming it.
    if (!this._isMuted && this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
    }
    
    return this._isMuted;
  }

  get isMuted(): boolean {
    return this._isMuted;
  }
}

// Export a singleton instance
export const soundService = new SoundService();
