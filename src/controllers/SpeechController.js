import { APP_CONFIG } from "../config/appConfig";
import { voicePresets } from "../models/VoicePreset";
import { VoiceSettings } from "../models/VoiceSettings";
import { AudioPlayer } from "../services/AudioPlayer";
import { EventEmitter } from "../services/EventEmitter";
import { appStore } from "../services/LocalStore";
import { SpeechEngine } from "../services/SpeechEngine";

export const EngineStatus = Object.freeze({
  LOADING: "loading",
  READY: "ready",
  UNAVAILABLE: "unavailable",
});

export const PlaybackStatus = Object.freeze({
  IDLE: "idle",
  GENERATING: "generating",
  PLAYING: "playing",
  PAUSED: "paused",
});

const VOICE_SETTINGS_KEY = "voiceSettings";
const EMPTY_PROGRESS = Object.freeze({ currentTime: 0, duration: 0 });

const toMessage = (error) =>
  error?.message ||
  error?.error?.message ||
  "Something went wrong with text-to-speech.";

/**
 * Owns all app behaviour: engine start-up, generating speech, playback and
 * voice settings. React components read `getSnapshot()` and call methods;
 * they never touch the engine or the audio element directly.
 */
export class SpeechController extends EventEmitter {
  #engine;
  #player;
  #store;
  #state;
  #presets;
  #requestId = 0;
  #startup = null;
  #unsubscribers = [];

  constructor({
    engine = new SpeechEngine(APP_CONFIG.engine),
    player = new AudioPlayer(),
    store = appStore,
    presets = voicePresets,
  } = {}) {
    super();
    this.#engine = engine;
    this.#player = player;
    this.#store = store;
    this.#presets = presets;
    this.#state = Object.freeze({
      engineStatus: EngineStatus.LOADING,
      playbackStatus: PlaybackStatus.IDLE,
      voiceSettings: VoiceSettings.restore(store.get(VOICE_SETTINGS_KEY), presets),
      progress: EMPTY_PROGRESS,
      error: "",
    });
  }

  // ---- Store API (used by useSyncExternalStore) --------------------------

  subscribe = (listener) => this.on("change", listener);

  getSnapshot = () => this.#state;

  // ---- Lifecycle ---------------------------------------------------------

  start() {
    this.#startup = new AbortController();
    const { signal } = this.#startup;

    this.#unsubscribers = [
      this.#player.on("progress", (progress) => this.#setState({ progress })),
      this.#player.on("ended", () => this.#resetPlayback()),
      this.#player.on("error", (error) =>
        this.#resetPlayback({ error: toMessage(error) }),
      ),
    ];

    this.#engine
      .waitUntilReady({ ...APP_CONFIG.readyCheck, signal })
      .then(() => this.#setState({ engineStatus: EngineStatus.READY }))
      .catch((error) => {
        if (signal.aborted) return;
        this.#setState({
          engineStatus: EngineStatus.UNAVAILABLE,
          error: toMessage(error),
        });
      });
  }

  dispose() {
    this.#startup?.abort();
    this.stop();
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.#unsubscribers = [];
  }

  // ---- Playback ----------------------------------------------------------

  /** @param {import("../models/SpeechText").SpeechText} speechText */
  async speak(speechText) {
    const validationError = speechText.validate();
    if (validationError) {
      this.#setState({ error: validationError });
      return;
    }
    if (this.#state.engineStatus !== EngineStatus.READY) return;

    // Each request gets an id so a stop() or newer speak() can cancel it.
    const requestId = ++this.#requestId;
    this.#player.stop();
    this.#setState({
      playbackStatus: PlaybackStatus.GENERATING,
      progress: EMPTY_PROGRESS,
      error: "",
    });

    try {
      const audio = await this.#engine.synthesize(speechText.value);
      if (requestId !== this.#requestId) return;

      this.#setState({ playbackStatus: PlaybackStatus.PLAYING });
      await this.#player.play(audio, this.#state.voiceSettings);
    } catch (error) {
      if (requestId !== this.#requestId) return;
      this.#player.stop();
      this.#resetPlayback({ error: toMessage(error) });
    }
  }

  pause() {
    if (this.#state.playbackStatus !== PlaybackStatus.PLAYING) return;
    this.#player.pause();
    this.#setState({ playbackStatus: PlaybackStatus.PAUSED });
  }

  async resume() {
    if (this.#state.playbackStatus !== PlaybackStatus.PAUSED) return;
    this.#setState({ playbackStatus: PlaybackStatus.PLAYING });
    try {
      await this.#player.resume();
    } catch (error) {
      this.stop();
      this.#setState({ error: toMessage(error) });
    }
  }

  togglePause() {
    if (this.#state.playbackStatus === PlaybackStatus.PAUSED) this.resume();
    else this.pause();
  }

  stop() {
    this.#requestId++;
    this.#player.stop();
    this.#resetPlayback();
  }

  // ---- Voice settings ----------------------------------------------------

  selectPreset(presetId) {
    this.#setVoiceSettings(VoiceSettings.fromPreset(this.#presets.get(presetId)));
  }

  setRate(rate) {
    this.#setVoiceSettings(this.#state.voiceSettings.withRate(rate));
  }

  setVolume(volume) {
    this.#setVoiceSettings(this.#state.voiceSettings.withVolume(volume));
  }

  // ---- Errors ------------------------------------------------------------

  dismissError() {
    this.#setState({ error: "" });
  }

  // ---- Internals ---------------------------------------------------------

  #setVoiceSettings(voiceSettings) {
    this.#player.applySettings(voiceSettings);
    this.#store.set(VOICE_SETTINGS_KEY, voiceSettings);
    this.#setState({ voiceSettings });
  }

  #resetPlayback(extra = {}) {
    this.#setState({
      playbackStatus: PlaybackStatus.IDLE,
      progress: EMPTY_PROGRESS,
      ...extra,
    });
  }

  #setState(patch) {
    this.#state = Object.freeze({ ...this.#state, ...patch });
    this.emit("change");
  }
}
