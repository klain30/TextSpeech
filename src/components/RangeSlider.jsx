import "./RangeSlider.css";

/**
 * Labelled range input with a filled track.
 * @param {{
 *   label: string, valueLabel: string, value: number,
 *   range: { min: number, max: number, step: number },
 *   onChange: (value: number) => void, disabled?: boolean,
 * }} props
 */
function RangeSlider({ label, valueLabel, value, range, onChange, disabled }) {
  const fill = ((value - range.min) / (range.max - range.min)) * 100;

  return (
    <label className="RangeSlider">
      <span className="RangeSliderHeader">
        {label}
        <strong>{valueLabel}</strong>
      </span>
      <input
        className="RangeSliderInput"
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
        aria-valuetext={valueLabel}
        style={{ "--fill": `${fill}%` }}
      />
    </label>
  );
}

export default RangeSlider;
