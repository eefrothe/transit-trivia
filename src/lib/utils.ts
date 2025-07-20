// src/lib/utils.ts
export const shuffleArray = <T>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);
