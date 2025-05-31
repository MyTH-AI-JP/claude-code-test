class AudioSystem {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private musicInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create gain nodes
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);

      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = 0.2;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = 0.5;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Resume audio context (required for some browsers)
  public async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Sound effect: Player shoot
  public playShoot() {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  // Sound effect: Enemy hit
  public playEnemyHit() {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
    
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  // Sound effect: Player hit
  public playPlayerHit() {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const osc2 = this.audioContext.createOscillator();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.5);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.5);
    
    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start();
    osc2.start();
    osc.stop(this.audioContext.currentTime + 0.5);
    osc2.stop(this.audioContext.currentTime + 0.5);
  }

  // Sound effect: UFO hit
  public playUFOHit() {
    if (!this.audioContext || !this.sfxGain || this.isMuted) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000 + i * 200, this.audioContext!.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000 + i * 300, this.audioContext!.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        
        osc.start();
        osc.stop(this.audioContext!.currentTime + 0.1);
      }, i * 50);
    }
  }

  // Background music - chip-tune style
  public startMusic() {
    if (!this.audioContext || !this.musicGain || this.isMuted) return;
    
    this.stopMusic();

    // Simple melody pattern
    const bassPattern = [55, 55, 82.41, 82.41, 55, 55, 73.42, 73.42]; // A1, A1, E2, E2, A1, A1, D2, D2
    const melodyPattern = [220, 0, 246.94, 220, 329.63, 0, 293.66, 246.94]; // A3, rest, B3, A3, E4, rest, D4, B3
    
    let noteIndex = 0;
    
    this.musicInterval = window.setInterval(() => {
      if (!this.audioContext || !this.musicGain) return;
      
      // Bass line
      const bassOsc = this.audioContext.createOscillator();
      const bassGain = this.audioContext.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.value = bassPattern[noteIndex % bassPattern.length];
      bassGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);
      bassOsc.start();
      bassOsc.stop(this.audioContext.currentTime + 0.2);
      
      // Melody line
      const melodyFreq = melodyPattern[noteIndex % melodyPattern.length];
      if (melodyFreq > 0) {
        const melodyOsc = this.audioContext.createOscillator();
        const melodyGain = this.audioContext.createGain();
        melodyOsc.type = 'square';
        melodyOsc.frequency.value = melodyFreq;
        melodyGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        melodyGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        melodyOsc.connect(melodyGain);
        melodyGain.connect(this.musicGain);
        melodyOsc.start();
        melodyOsc.stop(this.audioContext.currentTime + 0.15);
      }
      
      // Percussion (hi-hat)
      if (noteIndex % 2 === 1) {
        const noiseBuffer = this.audioContext.createBuffer(1, 4410, this.audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < 4410; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        const noiseGain = this.audioContext.createGain();
        const noiseFilter = this.audioContext.createBiquadFilter();
        
        noise.buffer = noiseBuffer;
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 8000;
        
        noiseGain.gain.setValueAtTime(0.02, this.audioContext.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.musicGain);
        
        noise.start();
      }
      
      noteIndex++;
    }, 150); // 400 BPM (150ms per beat)
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }
}

// Create singleton instance
export const audioSystem = new AudioSystem();