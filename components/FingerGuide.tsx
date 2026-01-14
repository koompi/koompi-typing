import React from 'react';
import { Finger } from '../types';

interface HandProps {
  side: 'left' | 'right';
  activeFinger: Finger | null;
  className?: string;
}

export const Hand: React.FC<HandProps> = ({ side, activeFinger, className = "" }) => {
  const isLeft = side === 'left';
  
  // Mapping finger names to SVG paths or classes
  const getFingerClass = (fingerName: string) => {
    // Construct the specific finger ID (e.g., L-index)
    const specificFingerId = isLeft ? `L-${fingerName}` : `R-${fingerName}`;
    
    // Check match.
    const isActive = activeFinger === specificFingerId || (fingerName === 'thumb' && activeFinger === 'thumb');
    
    // Base: White glove style with light gray stroke
    const baseClasses = "transition-all duration-200 ease-out stroke-[3]";
    
    if (isActive) {
      // Active: Highlighted Blue
      return `${baseClasses} fill-sky-300 stroke-sky-500 z-10 relative drop-shadow-md`;
    }
    
    // Default: White glove
    return `${baseClasses} fill-white stroke-slate-300`;
  };

  return (
    <svg 
      viewBox="0 0 220 260" 
      className={`transition-all duration-300 drop-shadow-lg ${isLeft ? '' : 'scale-x-[-1]'} ${className}`} 
      style={{ overflow: 'visible' }}
    >
      {/* Palm Base */}
      <path 
        d="M20,160 Q20,230 85,240 Q150,230 155,160 Z" 
        className="fill-white stroke-slate-300 stroke-[3]"
      />

      {/* Pinky */}
      <path 
        d="M10,160 L10,100 Q10,75 25,75 Q40,75 40,100 L40,160 Z" 
        className={getFingerClass('pinky')}
      />
      
      {/* Ring */}
      <path 
        d="M40,160 L40,70 Q40,40 57.5,40 Q75,40 75,70 L75,160 Z" 
        className={getFingerClass('ring')}
      />
      
      {/* Middle */}
      <path 
        d="M75,160 L75,50 Q75,20 92.5,20 Q110,20 110,50 L110,160 Z" 
        className={getFingerClass('middle')}
      />
      
      {/* Index */}
      <path 
        d="M110,160 L110,70 Q110,40 127.5,40 Q145,40 145,70 L145,160 Z" 
        className={getFingerClass('index')}
      />
      
      {/* Thumb */}
      <path 
        d="M145,160 Q180,140 190,170 Q200,200 160,210 Z" 
        className={getFingerClass('thumb')}
      />
      
      {/* Cuff (Cartoon Glove Detail) */}
      <path
        d="M15,220 Q85,250 160,220"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};