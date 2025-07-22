import React from "react";
import SettingsModal from "./SettingsModal";
import { Link } from "react-router-dom";

const SettingsScreen: React.FC = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto mt-12 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">⚙️ Settings</h2>
        <Link to="/" className="text-blue-400 hover:underline text-sm">
          ← Back to Game
        </Link>
      </div>
      <SettingsModal />
    </div>
  );
};

export default SettingsScreen;
