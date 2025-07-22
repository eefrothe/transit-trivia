import React from "react";
import { useSettings } from "../context/SettingsContext";

const SettingsToggle: React.FC = () => {
  const { settings, toggleSetting } = useSettings();

  return (
    <div className="text-sm space-y-2 mt-4 bg-slate-800 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-2">Settings</h3>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={settings.musicEnabled} onChange={() => toggleSetting("musicEnabled")} />
        Background Music
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={settings.soundEnabled} onChange={() => toggleSetting("soundEnabled")} />
        Sound Effects
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={settings.effectsEnabled} onChange={() => toggleSetting("effectsEnabled")} />
        Visual / Timer Effects
      </label>
    </div>
  );
};

export default SettingsToggle;
