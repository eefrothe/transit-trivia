import React from 'react';


interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | number;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const className = typeof size === 'number'
    ? `w-[${size}px] h-[${size}px]`
    : sizeMap[size] || sizeMap['md'];

  return (
    <svg
      className={`animate-spin ${className} text-white`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
      ></path>
    </svg>
  );
};

export default Spinner;
