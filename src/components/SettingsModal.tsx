import React, { useEffect, useState } from "react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSettings: {
    tickingEnabled: boolean;
    effectsEnabled: boolean;
  };
  onSave: (settings: { tickingEnabled: boolean; effectsEnabled: boolean }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSave,
}) => {
  const [tickingEnabled, setTickingEnabled] = useState(initialSettings.tickingEnabled);
  const [effectsEnabled, setEffectsEnabled] = useState(initialSettings.effectsEnabled);

  useEffect(() => {
    setTickingEnabled(initialSettings.tickingEnabled);
    setEffectsEnabled(initialSettings.effectsEnabled);
  }, [initialSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ tickingEnabled, effectsEnabled });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-lg"
        >
          ❌
        </button>
        <h2 className="text-xl font-semibold mb-4">⚙️ Game Settings</h2>
        <div className="space-y-4">
          <label className="flex justify-between items-center">
            <span>🕒 Ticking Sound (last 5s)</span>
            <input
              type="checkbox"
              checked={tickingEnabled}
              onChange={() => setTickingEnabled((prev) => !prev)}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>

          <label className="flex justify-between items-center">
            <span>✨ Bonus Effects</span>
            <input
              type="checkbox"
              checked={effectsEnabled}
              onChange={() => setEffectsEnabled((prev) => !prev)}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
