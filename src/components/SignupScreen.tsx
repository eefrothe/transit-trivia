import React, { useState } from 'react';

interface SignupScreenProps {
  onSignup: (email: string, username: string) => void;
  onLoginClick: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSignup, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (username.trim().length > 15) {
      setError('Username cannot exceed 15 characters.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    onSignup(email, username.trim());
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 animate-fade-in-slide-up">
      <h1 className="text-4xl font-extrabold mb-2 text-cyan-400">Create an Account</h1>
      <p className="text-slate-300 text-lg mb-8">Join the community and save your scores!</p>
      
       <div className="w-full max-w-sm bg-slate-800/50 rounded-lg p-4 mb-4 text-center border border-yellow-500/30">
        <p className="text-yellow-400 text-sm">
          <span className="font-bold">Note:</span> This is a frontend simulation. Passwords are not stored or sent anywhere.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email-signup" className="block text-sm font-medium text-slate-400 mb-2">
            Email
          </label>
          <input
            id="email-signup"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username-signup" className="block text-sm font-medium text-slate-400 mb-2">
            Username
          </label>
          <input
            id="username-signup"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., EpicBanana77"
            minLength={3}
            maxLength={15}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password-signup" className="block text-sm font-medium text-slate-400 mb-2">
            Password
          </label>
          <input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-4 -mt-2 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-cyan-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:bg-slate-700 disabled:cursor-not-allowed"
          disabled={!username || !email || !password}
        >
          Sign Up & Play
        </button>
      </form>
      
       <p className="mt-6 text-slate-400">
        Already have an account?{' '}
        <button onClick={onLoginClick} className="font-semibold text-cyan-400 hover:text-cyan-300">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupScreen;