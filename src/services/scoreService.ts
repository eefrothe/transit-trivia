import { supabase } from '@/lib/supabaseClient';

export const getTopScores = async (limit = 10) => {
  const { data, error } = await supabase
    .from('scores')
    .select('player_name, score, played_at')
    .order('score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching scores:', error.message);
    return [];
  }

  return data;
};
