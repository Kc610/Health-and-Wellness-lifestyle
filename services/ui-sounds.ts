private init() {
  if (!this.ctx) {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // NEW: Ensure context is active
  if (this.ctx.state === 'suspended') {
    this.ctx.resume();
  }
}