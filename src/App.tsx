import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthScreen from './components/AuthScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';  
import VolumeControl from './components/VolumeControl';
import './App.css';
// import './App.css'; // Removed because file does not exist and Tailwind is imported elsewhere

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setShowStartScreen(!!data.session?.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setShowStartScreen(!!currentUser);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowStartScreen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <AuthScreen />
      ) : showStartScreen ? (
        <StartScreen onStart={() => setShowStartScreen(false)} />
      ) : (
        <>
          <GameScreen user={user} onLogout={handleLogout} />
          <div className="fixed bottom-4 right-4">
            <VolumeControl />
          </div>
        </>
      )}
    </>
  );
}

export default App;
