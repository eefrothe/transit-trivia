import { useRef, useEffect } from "react";

export function useGameSounds() {
  const clickSound = useRef(new Audio("/sounds/click.wav"));
  const correctSound = useRef(new Audio("/sounds/correct.wav"));
  const wrongSound = useRef(new Audio("/sounds/wrong.wav"));
  const hoverSound = useRef(new Audio("/sounds/hover.wav"));
  const errorSound = useRef(new Audio("/sounds/error.wav"));
  const confettiSound = useRef(new Audio("/sounds/confetti.wav"));
  const bgMusic = useRef(new Audio("/sounds/bg-music.wav"));

  const bgMusicStarted = useRef(false);
  const globalVolume = useRef(0.5);

  // Fade in music over 2 seconds
  const fadeInMusic = () => {
    const audio = bgMusic.current;
    if (!audio || bgMusicStarted.current) return;

    bgMusicStarted.current = true;
    audio.loop = true;
    audio.volume = 0;
    audio.play().catch((err) => {
      console.warn("Autoplay blocked:", err);
    });

    const targetVolume = globalVolume.current;
    let volume = 0;
    const step = 0.05;
    const interval = setInterval(() => {
      volume += step;
      if (volume >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(interval);
      } else {
        audio.volume = volume;
      }
    }, 100);
  };

  const setGlobalVolume = (volume: number) => {
    const clamped = Math.min(Math.max(volume, 0), 1);
    globalVolume.current = clamped;

    bgMusic.current.volume = clamped;
  };

  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = globalVolume.current;
      audio.play().catch((err) => {
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
    playBackgroundMusic: fadeInMusic,
    setGlobalVolume,
  };
}
