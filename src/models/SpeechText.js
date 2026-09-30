import { APP_CONFIG } from "../config/appConfig";

/** Wraps the text the user typed and answers questions about it. */
export class SpeechText {
  #value;
  #maxLength;

  constructor(value = "", maxLength = APP_CONFIG.maxTextLength) {
    this.#value = value;
    this.#maxLength = maxLength;
  }

  get value() {
    return this.#value;
  }

  get length() {
    return this.#value.length;
  }

  get maxLength() {
    return this.#maxLength;
  }

  get isEmpty() {
    return this.#value.trim() === "";
  }

  get isTooLong() {
    return this.length > this.#maxLength;
  }

  get isNearLimit() {
    return this.length >= this.#maxLength * APP_CONFIG.warnAtRatio;
  }

  get wordCount() {
    const trimmed = this.#value.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  }

  /** Rough spoken length in seconds at the given playback rate. */
  estimateSeconds(rate = 1) {
    const minutes = this.wordCount / APP_CONFIG.wordsPerMinute;
    return Math.round((minutes * 60) / rate);
  }

  /** @returns {string | null} A user-facing error, or null when valid. */
  validate() {
    if (this.isEmpty) return "Type or paste some text first.";
    if (this.isTooLong) {
      return `Text must be ${this.#maxLength} characters or fewer.`;
    }
    return null;
  }

  get isValid() {
    return this.validate() === null;
  }
}
