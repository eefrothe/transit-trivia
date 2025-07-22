import React from 'react';
import { TrainIcon } from '../components/icons';
import TopBar from "../components/shared/TopBar";

interface Location {
  emoji: string;
  label: string;
}

interface HomeScreenProps {
  onGuestPlay: () => void;
  onMatchmakingPlay: () => void;
  userLocation: string;
  onLocationChange: (location: string) => void;
  locations: Location[];
  username: string | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onGuestPlay, onMatchmakingPlay, userLocation, onLocationChange, locations, username, onLoginClick, onSignupClick }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-xl opacity-75 animate-pulse"></div>
        <div className="relative bg-slate-800 rounded-full p-6">
            <TrainIcon className="w-20 h-20 text-cyan-400" />
        </div>
      </div>
      
      {username ? (
        <h1 className="text-4xl font-bold mb-2 text-slate-100">
          Welcome, <span className="text-cyan-400">{username}</span>!
        </h1>
      ) : (
        <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Transit Trivia
        </h1>
      )}

      <p className="text-slate-300 text-lg mb-6">{username ? "Ready for a new challenge?" : "The perfect game for the wait."}</p>
      
      <div className="w-full max-w-sm mb-8">
        {!username && (
            <label htmlFor="location-select" className="block text-sm font-medium text-slate-400 mb-2 text-left">
              Where are you playing from?
            </label>
        )}
        <select
          id="location-select"
          value={userLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-no-repeat"
           style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
          }}
        >
          {locations.map((loc) => (
            <option key={loc.label} value={`${loc.emoji} ${loc.label}`} className="bg-slate-900 text-white font-medium">
              {loc.emoji} {loc.label}
            </option>
          ))}
        </select>
      </div>

      {username ? (
         <button
          onClick={onMatchmakingPlay}
          className="w-full max-w-sm bg-cyan-500 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 shadow-lg shadow-cyan-500/30"
        >
          Find Match
        </button>
      ) : (
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={onGuestPlay}
            className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-slate-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-500"
          >
            Play as Guest
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onLoginClick}
              className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-purple-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400"
            >
              Login
            </button>
            <button
              onClick={onSignupClick}
              className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;