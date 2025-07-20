import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import AuthScreen from "./components/AuthScreen";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import VolumeControl from "./components/VolumeControl";
import Spinner from "./components/Spinner";
import useGameSounds from "./hooks/useGameSounds";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? true
      : false;
  });

  const {
    playIntroSound,
    setGlobalVolume,
    isMuted,
    toggleMute,
  } = useGameSounds();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && !showStartScreen) {
      setShowStartScreen(true);
      playIntroSound();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowStartScreen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white dark:bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans dark:bg-slate-900">
      <button
        className="absolute top-4 left-4 z-50 text-sm text-white bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {user ? (
        showStartScreen ? (
          <StartScreen onStart={() => setShowStartScreen(false)} />
        ) : (
          <GameScreen user={user} onLogout={handleLogout} />
        )
      ) : (
        <AuthScreen />
      )}

      {user && (
        <div className="absolute top-4 right-4 z-50">
          <VolumeControl
            isMuted={isMuted}
            toggleMute={toggleMute}
            setVolume={setGlobalVolume}
          />
        </div>
      )}
    </div>
  );
}

export default App;
