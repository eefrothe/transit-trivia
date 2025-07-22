import React from 'react';
import { HintIcon, SkipIcon, DoublePointsIcon, FreezeIcon } from '../icons';

type PowerUpType = 'hint' | 'skip' | 'double' | 'freeze';

type PowerUpBarProps = {
  onUsePowerUp: (type: PowerUpType) => void;
  disabled?: { [K in PowerUpType]?: boolean };
};

const PowerUpBar: React.FC<PowerUpBarProps> = ({ onUsePowerUp, disabled = {} }) => {
  return (
    <div className="flex justify-center gap-4 my-6">
      <button
        onClick={() => onUsePowerUp('hint')}
        disabled={disabled.hint}
        className="power-up-button bg-blue-600 hover:bg-blue-500 disabled:opacity-30"
      >
        <HintIcon className="w-5 h-5 mr-2" />
        Hint
      </button>

      <button
        onClick={() => onUsePowerUp('skip')}
        disabled={disabled.skip}
        className="power-up-button bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30"
      >
        <SkipIcon className="w-5 h-5 mr-2" />
        Skip
      </button>

      <button
        onClick={() => onUsePowerUp('double')}
        disabled={disabled.double}
        className="power-up-button bg-purple-600 hover:bg-purple-500 disabled:opacity-30"
      >
        <DoublePointsIcon className="w-5 h-5 mr-2" />
        2x Points
      </button>

      <button
        onClick={() => onUsePowerUp('freeze')}
        disabled
        className="power-up-button bg-cyan-600 opacity-40 cursor-not-allowed"
      >
        <FreezeIcon className="w-5 h-5 mr-2" />
        Freeze
      </button>
    </div>
  );
};

export default PowerUpBar;
