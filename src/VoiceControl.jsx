import { VOICE_PRESETS } from "./speech";

function VoiceControl({ settings, onChange, disabled }) {
  const selectedPreset = VOICE_PRESETS[settings.tone];

  const updateSetting = (key, value) => {
    onChange({ ...settings, [key]: value });
  };

  const selectTone = (tone) => {
    const preset = VOICE_PRESETS[tone];
    onChange({ tone, rate: preset.rate, volume: preset.volume });
  };

  return (
    <section className="VoiceControl" aria-labelledby="voice-control-title">
      <div className="VoiceControlHeader">
        <div>
          <p className="ControlEyebrow">Delivery style</p>
          <h2 id="voice-control-title">Emotion and tone</h2>
        </div>
        <span className="ToneBadge">{selectedPreset.label}</span>
      </div>

      <div className="ToneGrid" role="group" aria-label="Voice tone">
        {Object.entries(VOICE_PRESETS).map(([tone, preset]) => (
          <button
            className={`ToneOption ${settings.tone === tone ? "selected" : ""}`}
            type="button"
            key={tone}
            onClick={() => selectTone(tone)}
            disabled={disabled}
            aria-pressed={settings.tone === tone}
          >
            <span className="ToneIcon" aria-hidden="true">
              {preset.icon}
            </span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      <div className="ControlSliders">
        <label className="SliderControl">
          <span>
            Speed <strong>{settings.rate.toFixed(1)}x</strong>
          </span>
          <input
            type="range"
            min="0.6"
            max="1.4"
            step="0.1"
            value={settings.rate}
            onChange={(event) =>
              updateSetting("rate", Number(event.target.value))
            }
            disabled={disabled}
          />
        </label>
        <label className="SliderControl">
          <span>
            Volume <strong>{Math.round(settings.volume * 100)}%</strong>
          </span>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(event) =>
              updateSetting("volume", Number(event.target.value))
            }
            disabled={disabled}
          />
        </label>
      </div>
    </section>
  );
}

export default VoiceControl;
