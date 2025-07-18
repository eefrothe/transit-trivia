import { useCallback, useEffect, useRef } from 'react';

type SoundKey = 'click' | 'correct' | 'wrong' | 'intro' | 'hover' | 'error';

const soundPaths: Record<SoundKey, string> = {
  click: '/sounds/click.wav',
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
  intro: '/sounds/intro.wav',
  hover: '/sounds/hover.wav',
  error: '/sounds/error.wav',
};

let globalVolume = 0.5;

export const setGlobalVolume = (volume: number) => {
  globalVolume = Math.min(Math.max(volume, 0), 1);
};

export default function useGameSounds() {
  const audioRefs = useRef<Record<SoundKey, HTMLAudioElement>>({} as any);

  useEffect(() => {
    Object.entries(soundPaths).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = globalVolume;
      audioRefs.current[key as SoundKey] = audio;
    });
  }, []);

  const playSound = useCallback((key: SoundKey) => {
    const audio = audioRefs.current[key];
    if (audio) {
      audio.volume = globalVolume;
      audio.currentTime = 0;
      audio.play().catch((e) => console.warn(`Failed to play ${key}:`, e));
    }
  }, []);

  return {
    playClickSound: () => playSound('click'),
    playCorrectSound: () => playSound('correct'),
    playWrongSound: () => playSound('wrong'),
    playIntroSound: () => playSound('intro'),
    playHoverSound: () => playSound('hover'),
    playErrorSound: () => playSound('error'),
    setGlobalVolume,
  };
}
