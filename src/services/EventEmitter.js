/** Minimal publish/subscribe base class shared by the player and controller. */
export class EventEmitter {
  #listeners = new Map();

  /** @returns {() => void} Call to unsubscribe. */
  on(event, listener) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((listener) => listener(payload));
  }
}
