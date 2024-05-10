// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500 transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
);
};

export default ProgressBar;