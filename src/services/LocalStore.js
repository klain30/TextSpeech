import { APP_CONFIG } from "../config/appConfig";

/**
 * JSON wrapper around localStorage. Never throws: private windows and
 * blocked storage simply behave as if nothing was saved.
 */
export class LocalStore {
  #prefix;

  constructor(prefix) {
    this.#prefix = prefix;
  }

  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(this.#prefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      window.localStorage.setItem(this.#prefix + key, JSON.stringify(value));
    } catch {
      // Storage is a convenience; ignore quota or permission errors.
    }
  }
}

export const appStore = new LocalStore(APP_CONFIG.storagePrefix);
