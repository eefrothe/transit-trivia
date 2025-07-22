import { useRef } from "react";

export default function useGameSounds() {
  const click = useRef(new Audio("/sounds/click.wav"));
  const correct = useRef(new Audio("/sounds/correct.wav"));
  const wrong = useRef(new Audio("/sounds/wrong.wav"));
  const hover = useRef(new Audio("/sounds/hover.wav"));
  const error = useRef(new Audio("/sounds/error.wav"));
  const confetti = useRef(new Audio("/sounds/confetti.wav"));
  const ticking = useRef(new Audio("/sounds/ticking.wav"));
  const bgMusic = useRef(new Audio("/sounds/bg-music.wav"));

  bgMusic.current.loop = true;

  const play = (audio: React.RefObject<HTMLAudioElement>) => {
    const sound = audio.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((err) => console.warn("Audio failed:", err));
    }
  };

  return {
    playClickSound: () => play(click),
    playCorrectSound: () => play(correct),
    playWrongSound: () => play(wrong),
    playHoverSound: () => play(hover),
    playErrorSound: () => play(error),
    playConfettiSound: () => play(confetti),
    playTickingSound: () => play(ticking),
    playBackgroundMusic: () => bgMusic.current?.play().catch(() => {}),
    pauseBackgroundMusic: () => bgMusic.current?.pause(),
  };
}
