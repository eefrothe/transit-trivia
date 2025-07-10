import { supabase } from '../lib/supabaseClient';

type LeaderboardEntry = {
  username: string;
  score: number;
};

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      console.warn('Falling back to fake leaderboard...');
      return fakeLeaderboard();
    }

    return data;
  } catch (err) {
    console.error('Supabase error:', err);
    return fakeLeaderboard();
  }
}

function fakeLeaderboard(): LeaderboardEntry[] {
  return [
    { username: 'Alice', score: 12 },
    { username: 'Bob', score: 10 },
    { username: 'Clara', score: 9 },
    { username: 'Dee', score: 8 },
  ];
}
