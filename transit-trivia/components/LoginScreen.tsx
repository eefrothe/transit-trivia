import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onSignupClick: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignupClick }) => {
  const [email, setEmail] =useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 animate-fade-in-slide-up">
      <h1 className="text-4xl font-extrabold mb-2 text-cyan-400">Welcome Back!</h1>
      <p className="text-slate-300 text-lg mb-8">Login to access your profile.</p>

      <div className="w-full max-w-sm bg-slate-800/50 rounded-lg p-6 mb-4 text-center border border-yellow-500/30">
        <p className="text-yellow-400 text-sm">
          <span className="font-bold">Note:</span> This is a frontend simulation. You can use a fake email and any password to continue. No data is sent to a server.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
            Email
          </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="you@example.com"
              required
            />
        </div>

        <div className="mb-6">
          <label htmlFor="password"className="block text-sm font-medium text-slate-400 mb-2">
            Password
          </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              placeholder="••••••••"
              required
            />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-cyan-400 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 shadow-lg shadow-cyan-500/30 disabled:bg-slate-700 disabled:cursor-not-allowed"
          disabled={!email || !password}
        >
          Login
        </button>
      </form>

       <p className="mt-6 text-slate-400">
        Don't have an account?{' '}
        <button onClick={onSignupClick} className="font-semibold text-cyan-400 hover:text-cyan-300">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginScreen;