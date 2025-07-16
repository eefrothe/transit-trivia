import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import GameScreen from './components/GameScreen';
import AuthScreen from './components/AuthScreen';
import { useGameSounds } from './hooks/useGameSounds';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {
    playClick,
    playBgMusic,
    stopBgMusic,
    toggleMute,
    muted,
  } = useGameSounds();

  // Auth logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Background music based on user login
  useEffect(() => {
    if (user) {
      playBgMusic();
    } else {
      stopBgMusic();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    playClick();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-gray-900 text-white">
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 text-2xl z-50"
        title="Toggle sound"
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {user ? (
        <GameScreen user={user} onLogout={handleLogout} />
      ) : (
        <AuthScreen />
      )}
    </div>
  );
}

export default App;
