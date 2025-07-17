import React from 'react';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-white', className = '' }) => {
  const dimensionClass =
    typeof size === 'number' ? `w-[${size}px] h-[${size}px]` : sizeMap[size] || sizeMap['md'];

  return (
    <motion.svg
      className={`animate-spin ${dimensionClass} ${color} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
      />
    </motion.svg>
  );
};

export default Spinner;
