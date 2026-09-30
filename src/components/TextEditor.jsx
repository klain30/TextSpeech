import "./TextEditor.css";
import { formatTime } from "../utils/formatTime";

/**
 * @param {{
 *   text: import("../models/SpeechText").SpeechText,
 *   rate: number,
 *   onChange: (value: string) => void,
 *   onSubmit: () => void,
 *   disabled: boolean,
 * }} props
 */
function TextEditor({ text, rate, onChange, onSubmit, disabled }) {
  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  const countLevel = text.isTooLong ? "limit" : text.isNearLimit ? "warn" : "ok";

  return (
    <section className="CardSection TextEditor">
      <div className="SectionHeading">
        <div>
          <p className="SectionEyebrow">Script</p>
          <label className="SectionTitle" htmlFor="speech-text">
            What should I say?
          </label>
        </div>
        <button
          className="Button GhostButton"
          type="button"
          onClick={() => onChange("")}
          disabled={disabled || text.length === 0}
        >
          Clear
        </button>
      </div>

      <textarea
        id="speech-text"
        className="TextArea"
        placeholder="Type or paste your text here…"
        value={text.value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={text.maxLength}
        spellCheck
      />

      <div className="TextEditorMeta">
        <span>
          {text.wordCount} {text.wordCount === 1 ? "word" : "words"}
          {text.wordCount > 0 && ` · ~${formatTime(text.estimateSeconds(rate))}`}
        </span>
        <span className="CharCount" data-level={countLevel}>
          {text.length.toLocaleString()} / {text.maxLength.toLocaleString()}
        </span>
      </div>
    </section>
  );
}

export default TextEditor;
