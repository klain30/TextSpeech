import "./App.css";
import { useEffect, useRef, useState } from "react";
import VoiceControl from "./VoiceControl";
import {
  createSpeech,
  isSpeechReady,
  MAX_TEXT_LENGTH,
  stopSpeech,
} from "./speech";

const defaultVoiceSettings = {
  tone: "cheerful",
  rate: 1.1,
  volume: 1,
};

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiReady, setAiReady] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState(defaultVoiceSettings);
  const currentAudio = useRef(null);

  useEffect(() => {
    const checkReady = setInterval(() => {
      if (isSpeechReady()) {
        setAiReady(true);
        clearInterval(checkReady);
      }
    }, 300);
    return () => clearInterval(checkReady);
  }, []);

  const speakText = async () => {
    if (text.length > MAX_TEXT_LENGTH) {
      setError(`Text must be ${MAX_TEXT_LENGTH} characters or fewer.`);
      return;
    }

    setLoading(true);
    setError("");
    stopSpeech(currentAudio.current);

    try {
      const audio = await createSpeech(text);
      currentAudio.current = audio;
      audio.playbackRate = voiceSettings.rate;
      audio.volume = voiceSettings.volume;
      setHasAudio(true);
      audio.play();
      audio.addEventListener("ended", handleAudioEnd, { once: true });
      audio.addEventListener("error", handleAudioEnd, { once: true });
    } catch (err) {
      setError(err.message || "something went wrong with text-to-speech");
      setLoading(false);
    }
  };

  const handleAudioEnd = () => {
    setLoading(false);
    setHasAudio(false);
    currentAudio.current = null;
  };

  const stopAudio = () => {
    stopSpeech(currentAudio.current);
    handleAudioEnd();
  };

  return (
    <>
      <div className="Background">
        <h1 className="TitleName">AI Text Speech</h1>

        <div className="ContentContainer">
          <div
            className={`status-badge ${aiReady ? "ai-ready" : "ai-waiting"}`}
          >
            {aiReady ? "🟢 AI Ready" : "🟡 Waiting for AI..."}
          </div>

          <div className="Card">
            <textarea
              className="textA"
              placeholder={`Enter text to convert to speech... (max ${MAX_TEXT_LENGTH} characters)`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={!aiReady}
              maxLength={MAX_TEXT_LENGTH}
            />
            <div className="CardFooter">
              <span className="CharCount">
                {text.length}/{MAX_TEXT_LENGTH} characters
              </span>
            </div>
            <VoiceControl
              settings={voiceSettings}
              onChange={setVoiceSettings}
              disabled={!aiReady || loading}
            />
            <div className="ButtonGroup">
              <button
                className="SpeakButton"
                onClick={speakText}
                disabled={!aiReady || loading || !text.trim()}
              >
                {loading ? (
                  <div className="ButtonContent">
                    <div className="Spinner"></div>
                    Speaking...
                  </div>
                ) : (
                  <div className="ButtonContent">🔊 Speak</div>
                )}
              </button>

              {hasAudio && (
                <button className="StopButton" onClick={stopAudio}>
                  ⏹ Stop
                </button>
              )}
            </div>
            <div className="ErrorWrapper">
              {error && <div className="ErrorMessage">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
