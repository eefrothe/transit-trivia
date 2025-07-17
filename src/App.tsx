import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import GameScreen from './components/GameScreen';
import AuthScreen from './components/AuthScreen';
import StartScreen from './components/StartScreen';
import VolumeControl from './components/VolumeControl';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    setGameStarted(false); // Reset to start screen
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  return (
    <>
      {/* Only show sound control on Start or Game */}
      {(gameStarted || !gameStarted) && <VolumeControl />}
      {gameStarted ? (
        <GameScreen user={user} onLogout={handleLogout} />
      ) : (
        <StartScreen onStart={() => setGameStarted(true)} />
      )}
    </>
  );
}

export default App;
