const clamp = (value, { min, max }) => Math.min(max, Math.max(min, value));

/**
 * The user's current delivery settings. Immutable: every change returns a
 * new instance, which keeps React re-renders predictable.
 */
export class VoiceSettings {
  static RATE_RANGE = Object.freeze({ min: 0.6, max: 1.4, step: 0.05 });
  static VOLUME_RANGE = Object.freeze({ min: 0.2, max: 1, step: 0.05 });

  constructor({ presetId, rate, volume }) {
    this.presetId = presetId;
    this.rate = clamp(rate, VoiceSettings.RATE_RANGE);
    this.volume = clamp(volume, VoiceSettings.VOLUME_RANGE);
    Object.freeze(this);
  }

  /** @param {import("./VoicePreset").VoicePreset} preset */
  static fromPreset(preset) {
    return new VoiceSettings({
      presetId: preset.id,
      rate: preset.rate,
      volume: preset.volume,
    });
  }

  /**
   * Rebuilds settings from saved JSON, falling back to the catalog default
   * when the data is missing or refers to a preset that no longer exists.
   * @param {import("./VoicePreset").VoicePresetCatalog} catalog
   */
  static restore(data, catalog) {
    const preset = catalog.find(data?.presetId);
    if (!preset) return VoiceSettings.fromPreset(catalog.default);

    const rate = Number(data.rate);
    const volume = Number(data.volume);
    return new VoiceSettings({
      presetId: preset.id,
      rate: Number.isFinite(rate) ? rate : preset.rate,
      volume: Number.isFinite(volume) ? volume : preset.volume,
    });
  }

  withRate(rate) {
    return new VoiceSettings({ ...this, rate });
  }

  withVolume(volume) {
    return new VoiceSettings({ ...this, volume });
  }

  /** True when the sliders were moved away from the preset's values. */
  isModifiedFrom(preset) {
    return this.rate !== preset.rate || this.volume !== preset.volume;
  }

  get rateLabel() {
    return `${Number(this.rate.toFixed(2))}x`;
  }

  get volumeLabel() {
    return `${Math.round(this.volume * 100)}%`;
  }

  toJSON() {
    return { presetId: this.presetId, rate: this.rate, volume: this.volume };
  }
}
