import "./AppHeader.css";
import StatusBadge from "./StatusBadge";

function AppHeader({ engineStatus }) {
  return (
    <header className="AppHeader">
      <StatusBadge status={engineStatus} />
      <h1 className="AppTitle">
        AI Text <span className="AppTitleAccent">Speech</span>
      </h1>
      <p className="AppSubtitle">
        Turn any text into natural speech. Pick a tone, fine-tune the delivery,
        and press play.
      </p>
    </header>
  );
}

export default AppHeader;
