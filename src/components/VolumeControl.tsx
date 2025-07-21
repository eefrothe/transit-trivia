import React, { useState, useEffect } from "react";
import { setGlobalVolume, useGameSounds } from "../hooks/useGameSounds";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

const VolumeControl: React.FC = () => {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const { bgMusicRef } = useGameSounds();

  useEffect(() => {
    // Set initial volume on mount
    setGlobalVolume(volume);
    if (bgMusicRef?.current) {
      bgMusicRef.current.volume = volume;
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
    setGlobalVolume(newVolume);

    if (bgMusicRef?.current) {
      bgMusicRef.current.volume = newVolume;
      if (newVolume > 0 && bgMusicRef.current.paused) {
        bgMusicRef.current.play().catch(() => {
          // ignore autoplay issues
        });
      }
    }
  };

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    const newVolume = newMuted ? 0 : 0.5;
    setVolume(newVolume);
    setGlobalVolume(newVolume);

    if (bgMusicRef?.current) {
      bgMusicRef.current.volume = newVolume;
      if (newMuted) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play().catch(() => {
          // ignore autoplay issues
        });
      }
    }
  };

  return (
    <div className="bg-slate-900 p-2 rounded-lg flex items-center gap-2 shadow-md">
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
    </div>
  );
};

export default VolumeControl;
