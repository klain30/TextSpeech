import { VOICE_PRESET_DATA } from "../config/voicePresets";

/** A named combination of speaking rate and volume. Immutable. */
export class VoicePreset {
  constructor({ id, label, icon, description, rate, volume }) {
    this.id = id;
    this.label = label;
    this.icon = icon;
    this.description = description;
    this.rate = rate;
    this.volume = volume;
    Object.freeze(this);
  }
}

/** Ordered lookup of every available preset. */
export class VoicePresetCatalog {
  #presets;

  constructor(presetData) {
    if (presetData.length === 0) {
      throw new Error("VoicePresetCatalog needs at least one preset.");
    }
    this.#presets = new Map(
      presetData.map((data) => [data.id, new VoicePreset(data)]),
    );
  }

  /** @returns {VoicePreset[]} */
  all() {
    return [...this.#presets.values()];
  }

  /** @returns {VoicePreset | undefined} */
  find(id) {
    return this.#presets.get(id);
  }

  /** @returns {VoicePreset} */
  get(id) {
    const preset = this.find(id);
    if (!preset) throw new Error(`Unknown voice preset "${id}".`);
    return preset;
  }

  get default() {
    return this.all()[0];
  }
}

export const voicePresets = new VoicePresetCatalog(VOICE_PRESET_DATA);
