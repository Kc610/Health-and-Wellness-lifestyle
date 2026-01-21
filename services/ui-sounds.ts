
class SoundService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playBlip() {
    this.playTone(880, 'sine', 0.1);
  }

  playClick() {
    this.playTone(440, 'square', 0.05, 0.05);
  }

  playInject() {
    this.init();
    if (!this.ctx) return;
    this.playTone(220, 'sawtooth', 0.2, 0.05);
    setTimeout(() => this.playTone(440, 'sawtooth', 0.1, 0.05), 100);
  }
}

export const sounds = new SoundService();
