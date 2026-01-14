import React from 'react';

interface TypingVisualizerProps {
  progress: number; // 0-100
  wpm: number;
  accuracy: number;
}

export const TypingVisualizer: React.FC<TypingVisualizerProps> = ({ progress, wpm, accuracy }) => {
  // Color calculation based on accuracy (0-100)
  // <80% = Red/Orange, 80-100% = Yellow -> Green
  const getHealthColor = (acc: number) => {
    if (acc < 80) return '#ef4444'; // Red-500
    // Map 80..100 to hue 40..140 (Orange to Emerald)
    const hue = 40 + ((acc - 80) / 20) * 100;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const primaryColor = getHealthColor(accuracy);

  // Animation speed based on WPM (faster sway for higher WPM)
  // At 0 WPM, duration is infinite (no sway). At 100 WPM, duration is fast (~0.5s)
  const swayDuration = wpm > 0 ? `${Math.max(0.5, 300 / (wpm + 10))}s` : '0s';
  const isSwaying = wpm > 5;

  // Growth Calculations
  const stemMaxHeight = 60; // Max height of stem path
  const currentHeight = (progress / 100) * stemMaxHeight;

  // Determine visible segments based on progress
  const hasLeaf1 = progress > 20;
  const hasLeaf2 = progress > 40;
  const hasLeaf3 = progress > 60;
  const hasLeaf4 = progress > 80;
  const hasFlower = progress > 95;


  return (
    <div className="relative w-16 h-16 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-full border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
      <style>
        {`
          @keyframes plant-sway {
            0% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
            100% { transform: rotate(-3deg); }
          }
          @keyframes bloom {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      {/* Circular Progress Background */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={primaryColor}
          strokeWidth="4"
          strokeDasharray="283" // 2 * pi * 45
          strokeDashoffset={283 - (283 * progress) / 100}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
      </svg>

      {/* The Plant */}
      <div
        className="absolute bottom-2 w-full h-full flex items-end justify-center pb-2 origin-bottom"
        style={{
          animation: isSwaying ? `plant-sway ${swayDuration} infinite ease-in-out` : 'none'
        }}
      >
        <svg width="40" height="60" viewBox="0 0 40 60" style={{ overflow: 'visible' }}>

          {/* Stem - Grows with progress */}
          <path
            d="M20,60 Q25,40 20,0"
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={stemMaxHeight} // Total length approx
            strokeDashoffset={stemMaxHeight - currentHeight}
            className="transition-all duration-300 ease-linear"
          />

          {/* Leaves - Pop in */}
          <g className={`transition-all duration-500 origin-center ${hasLeaf1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <path d="M20,50 Q10,45 5,50 Q10,55 20,50" fill={primaryColor} />
          </g>
          <g className={`transition-all duration-500 delay-75 origin-center ${hasLeaf2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <path d="M20,40 Q30,35 35,40 Q30,45 20,40" fill={primaryColor} />
          </g>
          <g className={`transition-all duration-500 delay-100 origin-center ${hasLeaf3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <path d="M20,30 Q8,25 2,30 Q8,35 20,30" fill={primaryColor} />
          </g>
          <g className={`transition-all duration-500 delay-150 origin-center ${hasLeaf4 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <path d="M20,20 Q32,15 38,20 Q32,25 20,20" fill={primaryColor} />
          </g>

          {/* Flower - Blooms at end */}
          <g
            className={`${hasFlower ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: hasFlower ? 'bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none'
            }}
          >
            <circle cx="20" cy="0" r="6" fill="#fbbf24" /> {/* Center */}
            <circle cx="20" cy="-6" r="4" fill="#f472b6" /> {/* Petals */}
            <circle cx="26" cy="0" r="4" fill="#f472b6" />
            <circle cx="20" cy="6" r="4" fill="#f472b6" />
            <circle cx="14" cy="0" r="4" fill="#f472b6" />
          </g>
        </svg>
      </div>
    </div>
  );
};
