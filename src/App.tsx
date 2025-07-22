import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import AuthScreen from "./components/AuthScreen";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import SettingsScreen from "./components/SettingsScreen";
import VolumeControl from "./components/VolumeControl";
import Spinner from "./components/Spinner";
import useGameSounds from "./hooks/useGameSounds";

function AppRoutes({ user, setUser }: { user: any; setUser: (u: any) => void }) {
  const [showStartScreen, setShowStartScreen] = useState(false);
  const {
    playIntroSound,
    setGlobalVolume,
    isMuted,
    toggleMute,
  } = useGameSounds();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowStartScreen(false);
  };

  useEffect(() => {
    if (user && !showStartScreen) {
      setShowStartScreen(true);
      playIntroSound();
    }
  }, [user]);

  if (!user) return <AuthScreen />;

  return (
    <>
      <button
        className="absolute top-4 left-4 z-50 text-sm text-white bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="absolute top-4 right-4 z-50">
        <VolumeControl isMuted={isMuted} toggleMute={toggleMute} setVolume={setGlobalVolume} />
      </div>

      <Routes>
        <Route
          path="/"
          element={showStartScreen ? (
            <StartScreen onStart={() => setShowStartScreen(false)} />
          ) : (
            <GameScreen user={user} onLogout={handleLogout} />
          )}
        />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white dark:bg-slate-900">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen bg-slate-950 text-white font-sans dark:bg-slate-900">
        <AppRoutes user={user} setUser={setUser} />
      </div>
    </Router>
  );
}
