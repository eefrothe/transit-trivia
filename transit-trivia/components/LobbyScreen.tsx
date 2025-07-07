import React from 'react';
import { Player, AllPlayerStats } from '../types';
import PlayerAvatar from './PlayerAvatar';
import Spinner from './Spinner';
import { ShareIcon, BrainIcon } from './icons';
import { APP_URL } from '../constants';

interface LobbyScreenProps {
  players: Player[];
  playerStats: AllPlayerStats;
  onStartGame: () => void;
  isReady: boolean;
  theme: string | null;
  isMatchmaking: boolean;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ players, playerStats, onStartGame, isReady, theme, isMatchmaking }) => {

  const handleInvite = async () => {
    if (!navigator.share) {
      alert("Your browser doesn't support the Web Share API.");
      return;
    }
    try {
      await navigator.share({
        title: 'Transit Trivia',
        text: "Join my game on Transit Trivia! Let's see who's faster. 🧠⚡️",
        url: APP_URL,
      });
    } catch (error) {
      console.error('Error sharing invitation:', error);
    }
  };

  const getButtonContent = () => {
      if (isMatchmaking) {
        return <> <Spinner /> Searching... </>;
      }
      if (!theme || !isReady) {
        return <> <Spinner /> Finding Questions... </>;
      }
      return 'Start Game';
  }

  return (
    <div className="w-full flex flex-col animate-fade-in-slide-up">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-100">Game Lobby</h1>
      <p className="text-center text-slate-400 mb-6">{isMatchmaking ? 'Finding a match...' : 'The game will begin shortly.'}</p>
      
      {isMatchmaking ? (
        <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-6 my-6 text-center animate-pulse">
            <Spinner />
            <p className="text-slate-300 mt-3 font-semibold">Searching for opponents...</p>
        </div>
      ) : theme ? (
        <div className="bg-slate-800/50 rounded-lg p-3 mb-6 text-center animate-fade-in">
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Theme</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <BrainIcon className="w-5 h-5 text-cyan-300" />
            <p className="text-lg font-bold text-white">{theme}</p>
          </div>
        </div>
      ) : (
         <div className="text-center text-slate-400 mb-6">
            <Spinner />
            <p>Generating theme & questions...</p>
        </div>
      )}

      {navigator.share && !isMatchmaking && (
         <button
          onClick={handleInvite}
          className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500 focus:ring-opacity-50 shadow-lg shadow-slate-700/30 mb-6 flex items-center justify-center gap-2"
        >
          <ShareIcon className="w-5 h-5" />
          Invite Friends
        </button>
      )}

      <div className="bg-slate-800/50 rounded-xl p-6 mb-8 space-y-4 min-h-[200px]">
        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Players ({players.length}/4)</h2>
        {players.map((player, index) => (
          <div key={player.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <PlayerAvatar player={player} stats={playerStats[player.id]} />
          </div>
        ))}
      </div>

      <button
        onClick={onStartGame}
        disabled={!isReady || isMatchmaking}
        className="w-full bg-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50 shadow-lg shadow-pink-600/30 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center"
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default LobbyScreen;
