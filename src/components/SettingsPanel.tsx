// src/components/SettingsPanel.tsx
import React from "react";
import { useSettings } from "../context/SettingsContext";

const SettingsPanel: React.FC = () => {
  const { tickingEnabled, confettiEnabled, toggleTicking, toggleConfetti } = useSettings();

  return (
    <div className="bg-slate-800 p-4 rounded-lg text-sm space-y-3 shadow-lg w-full max-w-sm">
      <h4 className="text-white font-semibold mb-2">Game Settings</h4>

      <div className="flex items-center justify-between">
        <label htmlFor="ticking" className="text-white">Ticking in last 5s</label>
        <input
          id="ticking"
          type="checkbox"
          checked={tickingEnabled}
          onChange={toggleTicking}
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="confetti" className="text-white">Confetti on win</label>
        <input
          id="confetti"
          type="checkbox"
          checked={confettiEnabled}
          onChange={toggleConfetti}
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
