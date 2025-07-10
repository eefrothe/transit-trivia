// src/services/questionService.ts
import { supabase } from '@/lib/supabaseClient';
import { GeneratedQuestion } from '@/types/GeneratedQuestion';


export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category?: string;
}

const shuffleArray = <T>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

const formatQuestion = (dbRow: any): TriviaQuestion => {
  const options = [dbRow.correct, dbRow.incorrect_1, dbRow.incorrect_2];
  if (dbRow.incorrect_3) options.push(dbRow.incorrect_3);

  return {
    id: dbRow.id,
    question: dbRow.question,
    correctAnswer: dbRow.correct,
    options: shuffleArray(options),
    category: dbRow.category || 'General',
  };
};

export const fetchQuestions = async (category?: string, limit = 10): Promise<TriviaQuestion[]> => {
  const query = supabase
    .from('questions')
    .select('*')
    .limit(limit);

  if (category) query.eq('category', category);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching questions:', error.message);
    throw error;
  }

  return data.map(formatQuestion);
};



export interface ScoreEntry {
  player_name: string;
  score: number;
  played_at: string;
}

export const saveScore = async (playerName: string, score: number): Promise<void> => {
  const { error } = await supabase
    .from('scores')
    .insert([{ player_name: playerName, score }]);

  if (error) {
    console.error('Error saving score:', error.message);
    throw error;
  }
};

export const fetchLeaderboard = async (limit = 10): Promise<ScoreEntry[]> => {
  const { data, error } = await supabase
    .from('scores')
    .select('player_name, score, played_at')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error.message);
    throw error;
  }

  return data;
};

export const saveGeneratedQuestions = async (questions: GeneratedQuestion[]) => {
  const { error } = await supabase
    .from('questions')
    .insert(questions);

  if (error) {
    console.error('Error inserting generated questions:', error.message);
    return false;
  }

  return true;
};
