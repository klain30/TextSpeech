import { EventEmitter } from "./EventEmitter";

/**
 * Plays one HTMLAudioElement at a time.
 *
 * Events:
 *   "progress" -> { currentTime, duration }
 *   "ended"
 *   "error"    -> Error
 */
export class AudioPlayer extends EventEmitter {
  #audio = null;
  #listeners = null;

  get hasAudio() {
    return this.#audio !== null;
  }

  /**
   * Stops whatever is playing, then starts `audio` with the given settings.
   * @param {HTMLAudioElement} audio
   * @param {{ rate: number, volume: number }} settings
   */
  async play(audio, settings) {
    this.stop();
    this.#audio = audio;
    this.applySettings(settings);

    this.#listeners = new AbortController();
    const { signal } = this.#listeners;
    const emitProgress = () => this.#emitProgress();
    audio.addEventListener("timeupdate", emitProgress, { signal });
    audio.addEventListener("loadedmetadata", emitProgress, { signal });
    audio.addEventListener(
      "ended",
      () => {
        this.#release();
        this.emit("ended");
      },
      { signal },
    );
    audio.addEventListener(
      "error",
      () => {
        this.#release();
        this.emit("error", new Error("The audio could not be played."));
      },
      { signal },
    );

    await audio.play();
  }

  pause() {
    this.#audio?.pause();
  }

  async resume() {
    await this.#audio?.play();
  }

  stop() {
    if (!this.#audio) return;
    this.#audio.pause();
    this.#audio.currentTime = 0;
    this.#release();
  }

  /** Applies rate/volume immediately, even mid-playback. */
  applySettings({ rate, volume }) {
    if (!this.#audio) return;
    this.#audio.playbackRate = rate;
    this.#audio.volume = volume;
  }

  #emitProgress() {
    const { currentTime, duration } = this.#audio;
    this.emit("progress", {
      currentTime,
      duration: Number.isFinite(duration) ? duration : 0,
    });
  }

  #release() {
    this.#listeners?.abort();
    this.#listeners = null;
    this.#audio = null;
  }
}
