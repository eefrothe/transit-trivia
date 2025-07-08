import { useEffect, useState } from 'react';
import { getPowerUps } from '../services/powerupService';

type PowerUp = {
  id: number;
  name: string;
  description: string;
  used: boolean;
};

export default function PowerUpMenu() {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);

  useEffect(() => {
    getPowerUps().then(setPowerUps);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">✨ Power-Ups</h2>
      {powerUps.map((powerUp) => (
        <div
          key={powerUp.id}
          className={`border p-2 mb-2 rounded-lg ${powerUp.used ? 'opacity-50' : ''}`}
        >
          <strong>{powerUp.name}</strong>
          <p>{powerUp.description}</p>
          <button
            disabled={powerUp.used}
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => alert(`${powerUp.name} activated!`)}
          >
            Use
          </button>
        </div>
      ))}
    </div>
  );
}
