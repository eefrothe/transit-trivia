// src/components/VolumeControl.tsx
import React, { useState, useEffect } from "react";
import { setGlobalVolume } from "../hooks/useGameSounds";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  MusicalNoteIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

interface Props {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const VolumeControl: React.FC<Props> = ({ isMusicPlaying, onToggleMusic }) => {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setGlobalVolume(volume);
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const newMuted = !muted;
    const newVolume = newMuted ? 0 : 0.5;
    setMuted(newMuted);
    setVolume(newVolume);
    setGlobalVolume(newVolume);
  };

  return (
    <div className="flex gap-3 items-center bg-slate-900 p-2 rounded-lg shadow-md">
      {/* Volume toggle */}
      <button onClick={toggleMute} className="text-white">
        {muted || volume === 0 ? (
          <SpeakerXMarkIcon className="h-5 w-5" />
        ) : (
          <SpeakerWaveIcon className="h-5 w-5" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleVolumeChange}
        className="w-24"
      />

      {/* Music toggle */}
      <button onClick={onToggleMusic} className="text-white">
        {isMusicPlaying ? (
          <MusicalNoteIcon className="h-5 w-5" />
        ) : (
          <NoSymbolIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default VolumeControl;
