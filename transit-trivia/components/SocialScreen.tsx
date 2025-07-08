import React from 'react';
import { BOT_NAMES, BOT_COLORS } from '../constants';
import { Player } from '../../src/types';

interface SocialScreenProps {
  onCreateGame: () => void;
}

const SocialScreen: React.FC<SocialScreenProps> = ({ onCreateGame }) => {
  // Simulate a friends list using bot data
  const friends: Player[] = BOT_NAMES.map((name, index) => ({
    id: `bot-friend-${index}`,
    name,
    isBot: true,
    color: BOT_COLORS[index % BOT_COLORS.length],
  }));

  return (
    <div className="w-full flex flex-col animate-fade-in p-4 h-full">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-100">Social</h1>
      <p className="text-center text-slate-400 mb-6">Challenge your friends to a match!</p>

      <div className="bg-slate-800/50 rounded-xl p-6 mb-8 space-y-4 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Friends ({friends.length})</h2>
        {friends.map((friend, index) => (
          <div 
            key={friend.id} 
            className="flex items-center bg-slate-700/50 p-3 rounded-lg animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-full ${friend.color} flex items-center justify-center font-bold text-white text-lg mr-4 flex-shrink-0`}>
              {friend.name.substring(0, 1)}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-slate-100">{friend.name}</p>
              <p className="text-sm text-lime-400">Online</p>
            </div>
            <button
              onClick={onCreateGame}
              className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-purple-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Challenge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialScreen;
