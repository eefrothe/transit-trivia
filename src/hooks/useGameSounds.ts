// src/hooks/useGameSounds.ts
import { useRef } from "react";

let globalVolume = 0.5;

export const setGlobalVolume = (volume: number) => {
  globalVolume = Math.min(Math.max(volume, 0), 1);
};

export function useGameSounds() {
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const correctSound = useRef(new Audio("/sounds/correct.wav"));
  const wrongSound = useRef(new Audio("/sounds/wrong.wav"));
  const hoverSound = useRef(new Audio("/sounds/hover.wav"));
  const errorSound = useRef(new Audio("/sounds/error.wav"));
  const confettiSound = useRef(new Audio("/sounds/confetti.wav"));
  const bgMusic = useRef(new Audio("/sounds/bg-music.wav"));

  // Background music setup
  bgMusic.current.loop = true;
  bgMusic.current.volume = globalVolume * 0.4;

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = globalVolume;
      audio.currentTime = 0;
      audio.play().catch((err) => console.warn("Audio blocked:", err));
    }
  };

  const playBackgroundMusic = () => {
    const audio = bgMusic.current;
    audio.volume = globalVolume * 0.4;
    audio.play().catch((err) => console.warn("BG music blocked:", err));
  };

  const pauseBackgroundMusic = () => {
    bgMusic.current.pause();
  };

  return {
    playClickSound: () => playSound(clickSound),
    playCorrectSound: () => playSound(correctSound),
    playWrongSound: () => playSound(wrongSound),
    playHoverSound: () => playSound(hoverSound),
    playErrorSound: () => playSound(errorSound),
    playConfettiSound: () => playSound(confettiSound),
    playBackgroundMusic,
    pauseBackgroundMusic,
    setGlobalVolume,
  };
}
