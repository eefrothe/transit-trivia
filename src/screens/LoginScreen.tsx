import React, { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '@/services/authService';

interface LoginScreenProps {
  onLogin: (email: string) => void;
  onSignupClick: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await signInWithEmail(email, password);
      if (data?.user) {
        onLogin(email);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle(); // Redirects user
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 animate-fade-in-slide-up">
      <h1 className="text-4xl font-extrabold mb-2 text-cyan-400">Welcome Back!</h1>
      <p className="text-slate-300 text-lg mb-8">Login to access your profile.</p>

      {error && <div className="text-red-400 mb-4 text-center">{error}</div>}

      <form onSubmit={handleEmailLogin} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 text-white py-3 px-4 rounded-lg text-lg"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg text-xl hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
      </form>

      <div className="my-6 text-slate-300">or</div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full max-w-sm bg-white text-slate-800 font-bold py-3 px-6 rounded-lg text-xl hover:bg-gray-100 shadow disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting...' : 'Sign in with Google'}
      </button>

      <p className="mt-6 text-slate-400">
        Don’t have an account?{' '}
        <button onClick={onSignupClick} className="font-semibold text-cyan-400 hover:text-cyan-300">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginScreen;
