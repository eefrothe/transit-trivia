import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/leaderboardService';

type LeaderboardEntry = {
  username: string;
  score: number;
};

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
      <ul className="space-y-2">
        {entries.map((entry, index) => (
          <li key={index} className="flex justify-between bg-gray-100 p-2 rounded-lg">
            <span>{entry.username}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
