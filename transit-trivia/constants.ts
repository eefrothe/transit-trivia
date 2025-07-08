import { Player } from '../src/types';

export const TRANSIT_LOCATIONS = [
  { emoji: '🚉', label: 'Station' },
  { emoji: '🚌', label: 'Bus Stop' },
  { emoji: '✈️', label: 'Airport' },
  { emoji: '⛴️', label: 'Ferry Terminal' },
  { emoji: '🏠', label: 'Home' },
  { emoji: '⌛', label: 'Just Waiting' },
];

export const RANDOM_ADJECTIVES = ['Quick', 'Clever', 'Brave', 'Happy', 'Silent', 'Wise', 'Epic', 'Metro', 'Cosmic', 'Witty'];
export const RANDOM_NOUNS = ['Fox', 'Lion', 'Panda', 'Rider', 'Pilot', 'Gamer', 'Star', 'Comet', 'Nomad', 'Joker'];

export const GAME_DURATION_S = 60;
export const POST_ANSWER_DELAY_MS = 1500;
export const APP_URL = 'https://transit-trivia.fun';
export const VISUAL_QUESTION_CHANCE = 0.3; // 30% chance for a visual question
export const MATCHMAKING_TIMEOUT_MS = 5000;

export const BOT_NAMES: string[] = [
  'QuizWhiz', 'MetroMaster', 'BusPro', 'TriviaTornado', 'LogicLeaper', 
  'StationSavvy', 'CitySlicker', 'FastTrack', 'TheCommuter', 'RailRider'
];

export const BOT_COLORS: string[] = [
  'bg-pink-500',
  'bg-lime-500',
  'bg-orange-500',
  'bg-indigo-500',
  'bg-teal-500',
];