import React, { useMemo } from 'react';
import { Player, AllPlayerStats } from '../types';
import PlayerAvatar from '../components/shared/PlayerAvatar';
import { CrownIcon, ShareIcon } from '../components/icons';
import { APP_URL } from '../constants';

interface ScoreScreenProps {
  players: Player[];
  playerStats: AllPlayerStats;
  onPlayAgain: () => void;
  gamesPlayed: number;
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ players, playerStats, onPlayAgain, gamesPlayed }) => {
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => playerStats[b.id].score - playerStats[a.id].score);
  }, [players, playerStats]);
  
  const winner = sortedPlayers[0];
  const userScore = playerStats['user']?.score ?? 0;

  const handleShareResult = async () => {
    if (!navigator.share) {
      alert("Your browser doesn't support the Web Share API.");
      return;
    }
    try {
      await navigator.share({
        title: 'My Transit Trivia Score!',
        text: `I just scored ${userScore} in Transit Trivia! 🏆 Can you beat my score? #TransitTrivia`,
        url: APP_URL,
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const handleShareMilestone = async () => {
    if (!navigator.share) {
      alert("Sharing is not supported on your browser.");
      return;
    }
    try {
      await navigator.share({
        title: 'Transit Trivia',
        text: "I'm getting good at Transit Trivia, come play! 🧠⚡️",
        url: APP_URL,
      });
    } catch (error) {
      console.error('Error sharing milestone:', error);
    }
  };


  return (
    <div className="w-full flex flex-col items-center animate-fade-in-slide-up">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          Game Over
        </span>
      </h1>
      
      {gamesPlayed === 6 && (
        <div className="w-full bg-slate-800/50 border-2 border-dashed border-cyan-400/50 rounded-xl p-4 my-6 text-center animate-fade-in">
          <p className="text-slate-200 mb-3">You've played {gamesPlayed} games! Why not share the fun with friends?</p>
          <button
            onClick={handleShareMilestone}
            className="bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg text-md hover:bg-cyan-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 inline-flex items-center gap-2"
          >
            <ShareIcon className="w-5 h-5" />
            Share Game
          </button>
        </div>
      )}
      
      <div className="bg-slate-800/50 rounded-xl p-6 w-full mb-8">
        <div className="text-center mb-6">
            <CrownIcon className="w-16 h-16 text-yellow-400 mx-auto mb-2"/>
            <p className="text-xl font-semibold text-slate-200">Winner</p>
            <p className="text-3xl font-bold text-white">{winner.name}</p>
        </div>
      
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <PlayerAvatar player={player} stats={playerStats[player.id]} isWinner={player.id === winner.id} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row-reverse gap-4">
        <button
          onClick={onPlayAgain}
          className="w-full flex-1 bg-cyan-500 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 shadow-lg shadow-cyan-500/30"
        >
          Back to Home
        </button>
        {navigator.share && (
          <button
            onClick={handleShareResult}
            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50 shadow-lg flex items-center justify-center gap-2"
            aria-label="Share Results"
          >
            <ShareIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreScreen;