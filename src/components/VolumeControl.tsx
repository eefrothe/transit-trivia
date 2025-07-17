// /src/components/VolumeControl.tsx
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Volume1, Volume } from 'lucide-react';
import { motion } from 'framer-motion';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = '',
}) => {
  const [isMuted, setIsMuted] = useState(volume === 0);
  const [internalVolume, setInternalVolume] = useState(volume);

  useEffect(() => {
    setIsMuted(internalVolume === 0);
    onVolumeChange(internalVolume);
  }, [internalVolume, onVolumeChange]);

  const toggleMute = () => {
    if (isMuted) {
      setInternalVolume(0.5); // restore to medium volume
    } else {
      setInternalVolume(0);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInternalVolume(value);
  };

  const renderVolumeIcon = () => {
    if (internalVolume === 0) return <VolumeX className="w-5 h-5" />;
    if (internalVolume < 0.33) return <Volume className="w-5 h-5" />;
    if (internalVolume < 0.66) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <motion.div
      className={`flex items-center space-x-2 bg-slate-800/80 backdrop-blur p-2 rounded-xl shadow-md ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={toggleMute}
        className="text-white hover:text-green-400 transition"
        aria-label="Toggle mute"
      >
        {renderVolumeIcon()}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={internalVolume}
        onChange={handleSliderChange}
        className="w-24 cursor-pointer"
        aria-label="Volume slider"
      />
    </motion.div>
  );
};

export default VolumeControl;
