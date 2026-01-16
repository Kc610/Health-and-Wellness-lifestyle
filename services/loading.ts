
type Listener = (isLoading: boolean) => void;

class LoadingTracker {
  private count = 0;
  private listeners: Listener[] = [];

  start() {
    this.count++;
    this.notify();
  }

  end() {
    this.count = Math.max(0, this.count - 1);
    this.notify();
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const loading = this.count > 0;
    this.listeners.forEach(l => l(loading));
  }
}

export const loadingTracker = new LoadingTracker();
