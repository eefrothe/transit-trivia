import { useRef } from "react";

export function useGameSounds() {
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const correctSound = useRef(new Audio("/sounds/correct.wav"));
  const wrongSound = useRef(new Audio("/sounds/wrong.wav"));
  const hoverSound = useRef(new Audio("/sounds/hover.wav"));
  const errorSound = useRef(new Audio("/sounds/error.wav"));
  const confettiSound = useRef(new Audio("/sounds/confetti.mp3"));

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((err) => {
        // Gracefully fail if autoplay is blocked
        console.warn("Audio play blocked:", err);
      });
    }
  };

  return {
    playClickSound: () => playSound(clickSound),
    playCorrectSound: () => playSound(correctSound),
    playWrongSound: () => playSound(wrongSound),
    playHoverSound: () => playSound(hoverSound),
    playErrorSound: () => playSound(errorSound),
    playConfettiSound: () => playSound(confettiSound),
  };
}
