// src/components/AnimatedCounter.tsx
import React, { useEffect, useState } from "react";

interface Props {
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<Props> = ({ value, duration = 1000, className }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};

export default AnimatedCounter;
