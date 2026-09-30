import "./App.css";
import { useEffect, useMemo, useState } from "react";
import AppHeader from "./components/AppHeader";
import ErrorMessage from "./components/ErrorMessage";
import PlaybackControls from "./components/PlaybackControls";
import TextEditor from "./components/TextEditor";
import VoiceControl from "./components/VoiceControl";
import { EngineStatus, PlaybackStatus } from "./controllers/SpeechController";
import { useSpeechController } from "./hooks/useSpeechController";
import { SpeechText } from "./models/SpeechText";
import { voicePresets } from "./models/VoicePreset";
import { appStore } from "./services/LocalStore";

const DRAFT_KEY = "draft";

/** Page layout. Behaviour lives in SpeechController; this only wires it up. */
function App() {
  const [state, controller] = useSpeechController();
  const [draft, setDraft] = useState(() => appStore.get(DRAFT_KEY, ""));
  const speechText = useMemo(() => new SpeechText(draft), [draft]);

  useEffect(() => appStore.set(DRAFT_KEY, draft), [draft]);

  const isReady = state.engineStatus === EngineStatus.READY;
  const canSpeak = isReady && speechText.isValid;
  const speak = () => {
    if (canSpeak && state.playbackStatus === PlaybackStatus.IDLE) {
      controller.speak(speechText);
    }
  };

  return (
    <div className="AppShell">
      <main className="AppMain">
        <AppHeader engineStatus={state.engineStatus} />

        <div className="Card">
          <TextEditor
            text={speechText}
            rate={state.voiceSettings.rate}
            onChange={setDraft}
            onSubmit={speak}
            disabled={!isReady}
          />

          <VoiceControl
            presets={voicePresets.all()}
            settings={state.voiceSettings}
            onSelectPreset={(id) => controller.selectPreset(id)}
            onRateChange={(rate) => controller.setRate(rate)}
            onVolumeChange={(volume) => controller.setVolume(volume)}
            disabled={!isReady}
          />

          <section className="CardSection" aria-label="Playback">
            <PlaybackControls
              status={state.playbackStatus}
              progress={state.progress}
              canSpeak={canSpeak}
              onSpeak={speak}
              onTogglePause={() => controller.togglePause()}
              onStop={() => controller.stop()}
            />
            <ErrorMessage
              message={state.error}
              onDismiss={() => controller.dismissError()}
            />
          </section>
        </div>

        <footer className="AppFooter">
          Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to speak · Powered by Puter AI
        </footer>
      </main>
    </div>
  );
}

export default App;
