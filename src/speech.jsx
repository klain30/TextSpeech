export const MAX_TEXT_LENGTH = 3000;

export const VOICE_PRESETS = {
  cheerful: { label: "Cheerful", icon: "✦", rate: 1.1, volume: 1 },
  empathetic: { label: "Empathetic", icon: "♡", rate: 0.9, volume: 0.9 },
  authoritative: { label: "Authoritative", icon: "◆", rate: 0.85, volume: 1 },
  whispering: { label: "Whispering", icon: "◌", rate: 0.75, volume: 0.45 },
};

export function isSpeechReady() {
  return typeof window.puter?.ai?.txt2speech === "function";
}

export function createSpeech(text) {
  return window.puter.ai.txt2speech(text, {
    engine: "standard",
    language: "en-US",
  });
}

export function stopSpeech(audio) {
  audio?.pause();
  if (audio) audio.currentTime = 0;
}
