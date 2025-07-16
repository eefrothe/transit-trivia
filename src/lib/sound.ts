const sounds: Record<string, string> = {
  start: '/sounds/start.wav',
  buttonClick: '/sounds/click.wav',
  // Add more as needed
};

export const playSound = (name: string) => {
  const soundPath = sounds[name];
  if (soundPath) {
    const audio = new Audio(soundPath);
    audio.play().catch(console.error);
  }
};
