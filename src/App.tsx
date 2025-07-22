import { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import TopBar from "./components/shared/TopBar";
import VolumeControl from "./components/shared/VolumeControl";
import Spinner from "./components/Spinner";
import useGameSounds from "./hooks/useGameSounds";
import "./App.css";

// Lazy-loaded screens
const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const GameScreen = lazy(() => import("./screens/GameScreen"));
const SettingsScreen = lazy(() => import("./screens/SettingsScreen"));
const LeaderboardScreen = lazy(() => import("./screens/LeaderboardScreen"));
const LobbyScreen = lazy(() => import("./screens/LobbyScreen"));
const LoginScreen = lazy(() => import("./screens/LoginScreen"));
const ScoreScreen = lazy(() => import("./screens/ScoreScreen"));
const SignupScreen = lazy(() => import("./screens/SignupScreen"));
const SocialScreen = lazy(() => import("./screens/SocialScreen"));
const SuddenDeathScreen = lazy(() => import("./screens/SuddenDeathScreen"));
const VictoryScreen = lazy(() => import("./screens/VictoryScreen"));

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const { isMuted, toggleMute, setGlobalVolume } = useGameSounds();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-slate-950 text-white font-sans dark:bg-slate-900">
          {/* Shared TopBar */}
          <TopBar toggleDarkMode={() => setDarkMode((prev) => !prev)} />

          {/* Volume Control */}
          <div className="absolute top-4 right-4 z-50">
            <VolumeControl
              isMuted={isMuted}
              toggleMute={toggleMute}
              setVolume={setGlobalVolume}
            />
          </div>

          <Suspense fallback={<Spinner size="lg" />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <GameScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/score"
                element={
                  <ProtectedRoute>
                    <ScoreScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/victory"
                element={
                  <ProtectedRoute>
                    <VictoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lobby"
                element={
                  <ProtectedRoute>
                    <LobbyScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <SocialScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suddendeath"
                element={
                  <ProtectedRoute>
                    <SuddenDeathScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
