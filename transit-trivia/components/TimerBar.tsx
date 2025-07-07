
import React, { useState, useEffect } from 'react';

interface TimerBarProps {
  duration: number; // in seconds
  isPaused: boolean;
}

const TimerBar: React.FC<TimerBarProps> = ({ duration, isPaused }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
  }, [duration]);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    
    const startTime = Date.now();
    let frameId: number;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = 100 - (elapsedTime / (duration * 1000)) * 100;
      
      if (newProgress <= 0) {
        setProgress(0);
      } else {
        setProgress(newProgress);
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [duration, isPaused]);

  const barColor = progress > 50 ? 'bg-lime-500' : progress > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full transition-all duration-200 ease-linear ${barColor}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TimerBar;
