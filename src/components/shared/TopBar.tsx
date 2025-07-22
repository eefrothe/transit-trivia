// src/components/TopBar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

interface TopBarProps {
  onLogout?: () => void;
  className?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout, className = "" }) => {
  return (
    <div className={`absolute top-4 left-4 z-50 flex gap-2 items-center ${className}`}>
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm hidden sm:inline"
        >
          Logout
        </button>
      )}
      {onLogout && (
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded sm:hidden"
          title="Logout"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
        </button>
      )}

      <Link
        to="/settings"
        className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm hidden sm:inline"
      >
        ⚙️ Settings
      </Link>

      <Link
        to="/settings"
        className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded sm:hidden"
        title="Settings"
      >
        <Cog6ToothIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};

export default TopBar;
