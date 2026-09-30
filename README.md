# AI Text Speech

Turn text into speech with adjustable tone, speed and volume. Built with React + Vite, using the [Puter](https://puter.com) AI SDK for text-to-speech.

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # oxlint
```

## Features

- Four tone presets (Cheerful, Empathetic, Authoritative, Whispering) plus custom speed and volume
- Speed and volume changes apply **live**, even while audio is playing
- Pause / resume / stop, with a playback progress bar
- Cancel while audio is still being generated
- Word count, estimated spoken length, and a character counter that warns near the limit
- <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to speak
- Your draft and voice settings are remembered between visits (localStorage)

## Architecture

The app is split into **classes that hold behaviour** and **React components that only render**.

```
src/
├── config/                 ← Plain settings. Safe to tweak.
│   ├── appConfig.js          max length, engine options, timeouts
│   └── voicePresets.js       the tone presets
│
├── models/                 ← Immutable data classes with their own rules
│   ├── VoicePreset.js        VoicePreset + VoicePresetCatalog
│   ├── VoiceSettings.js      rate/volume (clamped), presets, save/restore
│   └── SpeechText.js         the typed text: counts, estimate, validation
│
├── services/               ← Talk to the outside world
│   ├── EventEmitter.js       small pub/sub base class
│   ├── SpeechEngine.js       wraps puter.ai.txt2speech
│   ├── AudioPlayer.js        plays/pauses/stops one audio element
│   └── LocalStore.js         safe localStorage wrapper
│
├── controllers/
│   └── SpeechController.js ← The brain: state + every user action
│
├── hooks/
│   └── useSpeechController.js  connects the controller to React
│
├── components/             ← UI only. Each .jsx has a matching .css
│   ├── AppHeader           title, subtitle, status badge
│   ├── StatusBadge         "AI ready" pill
│   ├── TextEditor          textarea, counters, Clear button
│   ├── VoiceControl        tone cards + sliders
│   ├── RangeSlider         reusable styled slider
│   ├── PlaybackControls    Speak / Pause / Stop + progress bar
│   ├── ErrorMessage        dismissible error alert
│   └── Icon                inline SVG icons
│
├── styles/
│   ├── tokens.css          ← colours, fonts, spacing, radius, shadows, motion
│   ├── base.css              global element defaults
│   └── buttons.css           Primary / Secondary / Ghost button variants
│
├── App.jsx / App.css       page layout: wires the controller to components
└── main.jsx                entry point
```

How a click flows: **Component → `SpeechController` method → `SpeechEngine` / `AudioPlayer` → controller updates its state → React re-renders.**

## Where do I edit…?

| I want to…                                   | Edit                                      |
| -------------------------------------------- | ----------------------------------------- |
| Change colours, fonts, spacing, corner radius | `src/styles/tokens.css`                   |
| Add, remove or tweak a tone preset           | `src/config/voicePresets.js`              |
| Change the character limit or language       | `src/config/appConfig.js`                 |
| Change slider min/max/step                   | `VoiceSettings.RATE_RANGE` / `VOLUME_RANGE` in `src/models/VoiceSettings.js` |
| Change validation messages                   | `SpeechText.validate()` in `src/models/SpeechText.js` |
| Switch to another TTS provider               | `src/services/SpeechEngine.js` (keep `isReady`, `waitUntilReady`, `synthesize`) |
| Add a new action (e.g. download, replay)     | Add a method to `SpeechController`, then a button in a component |
| Change the page title or subtitle            | `src/components/AppHeader.jsx`            |
| Restyle one part of the UI                   | The `.css` file next to that component    |
| Add an icon                                  | `PATHS` in `src/components/Icon.jsx`      |
