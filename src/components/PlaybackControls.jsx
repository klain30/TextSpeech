import "./PlaybackControls.css";
import { PlaybackStatus } from "../controllers/SpeechController";
import { formatTime } from "../utils/formatTime";
import Icon from "./Icon";

const PRIMARY_BUTTON = {
  [PlaybackStatus.IDLE]: { icon: "play", label: "Speak" },
  [PlaybackStatus.GENERATING]: { icon: null, label: "Generating…" },
  [PlaybackStatus.PLAYING]: { icon: "pause", label: "Pause" },
  [PlaybackStatus.PAUSED]: { icon: "play", label: "Resume" },
};

/**
 * @param {{
 *   status: string,
 *   progress: { currentTime: number, duration: number },
 *   canSpeak: boolean,
 *   onSpeak: () => void,
 *   onTogglePause: () => void,
 *   onStop: () => void,
 * }} props
 */
function PlaybackControls({ status, progress, canSpeak, onSpeak, onTogglePause, onStop }) {
  const isIdle = status === PlaybackStatus.IDLE;
  const isGenerating = status === PlaybackStatus.GENERATING;
  const hasAudio = status === PlaybackStatus.PLAYING || status === PlaybackStatus.PAUSED;
  const { icon, label } = PRIMARY_BUTTON[status];
  const ratio = progress.duration > 0 ? progress.currentTime / progress.duration : 0;

  return (
    <div className="PlaybackControls">
      <div className="PlaybackButtons">
        <button
          className="Button PrimaryButton"
          type="button"
          onClick={isIdle ? onSpeak : onTogglePause}
          disabled={isGenerating || (isIdle && !canSpeak)}
        >
          {isGenerating ? <span className="Spinner" aria-hidden="true" /> : <Icon name={icon} />}
          {label}
        </button>

        {!isIdle && (
          <button className="Button SecondaryButton" type="button" onClick={onStop}>
            <Icon name="stop" size={16} />
            {isGenerating ? "Cancel" : "Stop"}
          </button>
        )}
      </div>

      {hasAudio && (
        <div className="Progress">
          <span>{formatTime(progress.currentTime)}</span>
          <div
            className="ProgressTrack"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(ratio * 100)}
          >
            <div className="ProgressFill" style={{ "--progress": ratio }} />
          </div>
          <span>{formatTime(progress.duration)}</span>
        </div>
      )}
    </div>
  );
}

export default PlaybackControls;
