import { useState, useEffect, useCallback } from 'react';

type GameSoundType = 'click' | 'correct' | 'wrong';

const SOUND_PATHS: Record<GameSoundType, string> = {
  click: '/sounds/click.wav',
  correct: '/sounds/correct.wav',
  wrong: '/sounds/wrong.wav',
};

export const useGameSounds = () => {
  const [mute, setMute] = useState(false);
  const [audioElements, setAudioElements] = useState<Record<GameSoundType, HTMLAudioElement>>({
    click: new Audio(SOUND_PATHS.click),
    correct: new Audio(SOUND_PATHS.correct),
    wrong: new Audio(SOUND_PATHS.wrong),
  });

  // Ensure audio preloads and respects mute
  useEffect(() => {
    const newAudioElements = Object.entries(SOUND_PATHS).reduce((acc, [key, path]) => {
      const audio = new Audio(path);
      audio.volume = 1;
      audio.preload = 'auto';
      acc[key as GameSoundType] = audio;
      return acc;
    }, {} as Record<GameSoundType, HTMLAudioElement>);
    setAudioElements(newAudioElements);
  }, []);

  const playSound = useCallback(
    (type: GameSoundType) => {
      if (mute || !audioElements[type]) return;
      const audio = audioElements[type];
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.warn(`Failed to play sound "${type}":`, err);
      });
    },
    [mute, audioElements]
  );

  const toggleMute = () => setMute((prev) => !prev);

  return {
    mute,
    toggleMute,
    playClick: () => playSound('click'),
    playCorrect: () => playSound('correct'),
    playWrong: () => playSound('wrong'),
  };
};
