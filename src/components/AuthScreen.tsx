import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Spinner from './Spinner';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authFn =
      mode === 'login'
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { error } = await authFn({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-xl animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-md bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition"
          >
            {loading ? <Spinner size="sm" /> : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center my-4 text-sm text-gray-400">or</div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-400 text-white py-3 rounded-lg transition"
        >
          {loading ? <Spinner size="sm" /> : 'Continue with Google'}
        </button>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 hover:underline"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
