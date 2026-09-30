import "./ErrorMessage.css";
import Icon from "./Icon";

function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="ErrorMessage" role="alert">
      <Icon name="alert" />
      <p className="ErrorMessageText">{message}</p>
      <button
        className="Button GhostButton IconButton"
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export default ErrorMessage;
