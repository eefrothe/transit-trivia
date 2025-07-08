export enum Screen {
  HOME = 'HOME',
  LOBBY = 'LOBBY',
  GAME = 'GAME',
  SCORE = 'SCORE',
  SUDDEN_DEATH = 'SUDDEN_DEATH',
  LOGIN = 'LOGIN',
  SOCIAL = 'SOCIAL',
  SIGNUP = 'SIGNUP',
}

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  color: string;
}

// Unified question type for both text and visual questions
export interface TriviaQuestion {
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  questionType: 'text' | 'visual';
  imageUrl?: string; // base64 data URL for visual questions
}

export type PowerUpType = 'fiftyFifty' | 'skip' | 'doublePoints';

export interface PowerUpStatus {
  fiftyFifty: boolean; // true if used
  skip: boolean; // true if used
  doublePoints: boolean; // true if used
}

export interface PlayerStats {
  score: number;
  streak: number;
  powerUpsUsed: PowerUpStatus;
  isDoublePointsActive: boolean; // transient state for one question
}


export interface AllPlayerStats {
  [playerId: string]: PlayerStats;
}

export type Question = {
  id: number;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  theme?: string;
};
