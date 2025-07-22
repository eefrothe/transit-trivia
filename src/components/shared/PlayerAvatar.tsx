import React from 'react';
import { Player, PlayerStats } from '../../types';
import { CrownIcon } from '../icons';

interface PlayerAvatarProps {
  player: Player;
  stats: PlayerStats;
  isWinner?: boolean;
  isDoublePointsActive?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ player, stats, isWinner = false, isDoublePointsActive = false }) => {
  return (
    <div className={`relative flex items-center p-3 rounded-lg transition-all duration-300 ${isWinner ? 'bg-yellow-500/20 ring-2 ring-yellow-500/50' : 'bg-slate-700/50'}`}>
        <div className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center font-bold text-white text-lg mr-4 flex-shrink-0`}>
            {player.name.substring(0, 1)}
        </div>
        <div className="flex-grow">
            <p className="font-bold text-slate-100">{player.name}</p>
        </div>
        <div className="flex items-center">
            {isWinner && <CrownIcon className="w-5 h-5 text-yellow-400 mr-2" />}
            <p className="text-xl font-semibold text-white">{stats.score.toLocaleString()}</p>
        </div>
        {isDoublePointsActive && (
            <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-purple-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-slate-800 animate-pulse">
                2x
            </div>
        )}
    </div>
  );
};

export default PlayerAvatar;
