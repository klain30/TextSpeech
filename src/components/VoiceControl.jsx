import "./VoiceControl.css";
import { VoiceSettings } from "../models/VoiceSettings";
import RangeSlider from "./RangeSlider";

/**
 * @param {{
 *   presets: import("../models/VoicePreset").VoicePreset[],
 *   settings: VoiceSettings,
 *   onSelectPreset: (id: string) => void,
 *   onRateChange: (rate: number) => void,
 *   onVolumeChange: (volume: number) => void,
 *   disabled: boolean,
 * }} props
 */
function VoiceControl({
  presets,
  settings,
  onSelectPreset,
  onRateChange,
  onVolumeChange,
  disabled,
}) {
  const activePreset = presets.find((preset) => preset.id === settings.presetId);
  const isCustom = activePreset && settings.isModifiedFrom(activePreset);

  return (
    <section className="CardSection VoiceControl" aria-labelledby="voice-control-title">
      <div className="SectionHeading">
        <div>
          <p className="SectionEyebrow">Delivery style</p>
          <h2 className="SectionTitle" id="voice-control-title">
            Emotion and tone
          </h2>
        </div>
        <span className="ToneBadge">
          {activePreset?.label}
          {isCustom && " · Custom"}
        </span>
      </div>

      <div className="ToneGrid" role="group" aria-label="Voice tone">
        {presets.map((preset) => (
          <button
            className="ToneOption"
            type="button"
            key={preset.id}
            onClick={() => onSelectPreset(preset.id)}
            disabled={disabled}
            aria-pressed={settings.presetId === preset.id}
          >
            <span className="ToneIcon" aria-hidden="true">
              {preset.icon}
            </span>
            <span className="ToneLabel">{preset.label}</span>
            <span className="ToneDescription">{preset.description}</span>
          </button>
        ))}
      </div>

      <div className="SliderGrid">
        <RangeSlider
          label="Speed"
          valueLabel={settings.rateLabel}
          value={settings.rate}
          range={VoiceSettings.RATE_RANGE}
          onChange={onRateChange}
          disabled={disabled}
        />
        <RangeSlider
          label="Volume"
          valueLabel={settings.volumeLabel}
          value={settings.volume}
          range={VoiceSettings.VOLUME_RANGE}
          onChange={onVolumeChange}
          disabled={disabled}
        />
      </div>
    </section>
  );
}

export default VoiceControl;
