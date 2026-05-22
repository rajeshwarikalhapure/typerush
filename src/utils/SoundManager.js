class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : 0.3;
    }
    return this.muted;
  }

  playLaser() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime); // High pitch
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1); // Drop pitch fast
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playExplosion() {
    if (!this.initialized || this.muted) return;
    // Simple noise generator for explosion
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // White noise
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
  }

  playTyping() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playError() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playCombo() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1320, this.ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playDamage() {
    if (!this.initialized || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  startBGM() {
    if (!this.initialized || this.muted || this.bgmOsc) return;

    // Create the main drone
    this.bgmOsc = this.ctx.createOscillator();
    this.bgmOsc.type = 'sawtooth';
    this.bgmOsc.frequency.value = 110; // A2 (higher so it's audible on laptops)

    // Lowpass filter to make it bassy
    this.bgmFilter = this.ctx.createBiquadFilter();
    this.bgmFilter.type = 'lowpass';
    this.bgmFilter.frequency.value = 400;

    // LFO to modulate the filter frequency for a "wub" effect
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 2.0; // 2 pulses per second

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.value = 300; // Modulate frequency by 300Hz

    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.bgmFilter.frequency);

    // Gain for the BGM to keep it in the background
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.25; // Much louder so it can be heard

    // Connections
    this.bgmOsc.connect(this.bgmFilter);
    this.bgmFilter.connect(this.bgmGain);
    this.bgmGain.connect(this.masterGain);

    this.bgmOsc.start();
    this.lfo.start();
  }

  stopBGM() {
    if (this.bgmOsc) {
      try {
        this.bgmOsc.stop();
        this.lfo.stop();
      } catch (e) {}
      this.bgmOsc.disconnect();
      this.lfo.disconnect();
      this.bgmFilter.disconnect();
      this.bgmGain.disconnect();
      this.bgmOsc = null;
    }
  }
}

export const SoundManager = new SoundSystem();
