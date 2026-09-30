import { useEffect, useState, useSyncExternalStore } from "react";
import { SpeechController } from "../controllers/SpeechController";

/**
 * Creates one SpeechController for the component's lifetime and re-renders
 * whenever its state changes.
 * @returns {[ReturnType<SpeechController["getSnapshot"]>, SpeechController]}
 */
export function useSpeechController() {
  const [controller] = useState(() => new SpeechController());

  useEffect(() => {
    controller.start();
    return () => controller.dispose();
  }, [controller]);

  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot,
  );
  return [state, controller];
}
