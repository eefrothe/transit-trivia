import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import TopBar from "../components/shared/TopBar";

interface SettingsScreenProps {
  user: any;
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    updateSettings({ [name]: checked });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <TopBar userEmail={user?.email} onLogout={onLogout} showSettingsLink={false} />

      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="tickSoundEnabled"
            checked={settings.tickSoundEnabled}
            onChange={handleChange}
            className="accent-blue-500"
          />
          Tick sound in last 5 seconds
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="confettiEnabled"
            checked={settings.confettiEnabled}
            onChange={handleChange}
            className="accent-blue-500"
          />
          Confetti on correct answer
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="bounceScoreEnabled"
            checked={settings.bounceScoreEnabled}
            onChange={handleChange}
            className="accent-blue-500"
          />
          Bounce animation on score increase
        </label>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        ← Back to Game
      </button>
    </div>
  );
};

export default SettingsScreen;
