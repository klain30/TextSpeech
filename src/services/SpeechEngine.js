export class SpeechEngineUnavailableError extends Error {
  constructor(message = "The speech engine is not available.") {
    super(message);
    this.name = "SpeechEngineUnavailableError";
  }
}

/**
 * Talks to the Puter AI SDK (loaded by the <script> tag in index.html).
 * Swap this class out to use a different text-to-speech provider.
 */
export class SpeechEngine {
  #options;
  #getClient;

  /**
   * @param {{ engine: string, language: string }} options
   * @param {() => any} getClient Returns the Puter client; injectable for tests.
   */
  constructor(options, getClient = () => window.puter) {
    this.#options = options;
    this.#getClient = getClient;
  }

  isReady() {
    return typeof this.#getClient()?.ai?.txt2speech === "function";
  }

  /**
   * Resolves once the SDK has loaded, or rejects after `timeoutMs`.
   * @param {{ intervalMs: number, timeoutMs: number, signal?: AbortSignal }} options
   */
  waitUntilReady({ intervalMs, timeoutMs, signal }) {
    return new Promise((resolve, reject) => {
      if (this.isReady()) {
        resolve();
        return;
      }

      const startedAt = Date.now();
      const cleanup = () => {
        clearInterval(timer);
        signal?.removeEventListener("abort", onAbort);
      };
      const onAbort = () => {
        cleanup();
        reject(signal.reason);
      };
      const timer = setInterval(() => {
        if (this.isReady()) {
          cleanup();
          resolve();
        } else if (Date.now() - startedAt >= timeoutMs) {
          cleanup();
          reject(
            new SpeechEngineUnavailableError(
              "Couldn't connect to the speech engine. Check your connection and reload the page.",
            ),
          );
        }
      }, intervalMs);

      signal?.addEventListener("abort", onAbort, { once: true });
    });
  }

  /**
   * @param {string} text
   * @returns {Promise<HTMLAudioElement>}
   */
  async synthesize(text) {
    if (!this.isReady()) throw new SpeechEngineUnavailableError();
    return this.#getClient().ai.txt2speech(text, this.#options);
  }
}
