// src/components/shared/ProgressBar.tsx
import React from "react";

interface Props {
  value: number; // 0 - 100
}

const ProgressBar: React.FC<Props> = ({ value }) => (
  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
    <div
      className="bg-green-500 h-full transition-all duration-300 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default ProgressBar;
