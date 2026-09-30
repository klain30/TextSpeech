/**
 * App-wide settings. Change values here instead of hunting through components.
 */
export const APP_CONFIG = Object.freeze({
  /** Maximum characters the speech engine accepts in one request. */
  maxTextLength: 3000,

  /** Fraction of maxTextLength at which the character counter turns amber. */
  warnAtRatio: 0.9,

  /** Options forwarded to puter.ai.txt2speech. */
  engine: Object.freeze({
    engine: "standard",
    language: "en-US",
  }),

  /** How often / how long to wait for the Puter SDK to finish loading. */
  readyCheck: Object.freeze({
    intervalMs: 300,
    timeoutMs: 15000,
  }),

  /** Used to estimate spoken duration before generating audio. */
  wordsPerMinute: 150,

  /** Prefix for everything saved to localStorage. */
  storagePrefix: "txtspeech:",
});
