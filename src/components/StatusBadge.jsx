import "./StatusBadge.css";
import { EngineStatus } from "../controllers/SpeechController";

const LABELS = {
  [EngineStatus.LOADING]: "Connecting to AI…",
  [EngineStatus.READY]: "AI ready",
  [EngineStatus.UNAVAILABLE]: "AI unavailable",
};

function StatusBadge({ status }) {
  return (
    <div className="StatusBadge" data-status={status} role="status">
      <span className="StatusDot" aria-hidden="true" />
      {LABELS[status]}
    </div>
  );
}

export default StatusBadge;
