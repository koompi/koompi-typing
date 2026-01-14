
import React, { useEffect, useRef } from 'react';
import { Star, Lock, CheckCircle, MapPin, Smartphone } from 'lucide-react';

interface RoadmapMinimapProps {
    currentLevel: number;
    totalLevels: number;
    completedLevels: number;
}

export const RoadmapMinimap: React.FC<RoadmapMinimapProps> = ({
    currentLevel,
    totalLevels = 150,
    completedLevels
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Use full range of levels for scrollable map
    const displayLevels = Array.from({ length: totalLevels }, (_, i) => i);

    // Auto-scroll to current level
    useEffect(() => {
        // Delay to allow rendering
        const timer = setTimeout(() => {
            if (containerRef.current) {
                const currentEl = document.getElementById(`minimap-level-${currentLevel}`);
                if (currentEl) {
                    currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [currentLevel]);

    return (
        <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl shadow-xl overflow-hidden w-20 h-[65vh] max-h-[700px] relative flex flex-col items-center select-none">
            {/* Screen Content - Duolingo Path Style */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar relative py-4 scroll-smooth" ref={containerRef}>

                {/* Path Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-slate-200/50 z-0 h-full min-h-screen"></div>

                <div className="flex flex-col gap-3 items-center relative z-10 w-full px-1 pb-8">
                    {displayLevels.map((level, idx) => {
                        const isCurrent = level === currentLevel;
                        const isCompleted = level < currentLevel;

                        // Sine wave offset calculation
                        // We want a subtle weave: center -> left -> center -> right
                        const xOffset = Math.sin(idx * 1.5) * 8; // Reduced swing for narrower container

                        return (
                            <div
                                key={level}
                                id={`minimap-level-${level}`}
                                className="flex justify-center w-full transition-all duration-500 shrink-0"
                                style={{ transform: `translateX(${xOffset}px)` }}
                            >
                                <div
                                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shadow-sm relative group transition-all duration-300
                      ${isCurrent
                                            ? 'bg-blue-500 border-blue-600 text-white scale-110 ring-2 ring-blue-200 z-10'
                                            : isCompleted
                                                ? 'bg-amber-400 border-amber-500 text-white'
                                                : 'bg-white border-slate-200 text-slate-300'
                                        }
                    `}
                                >
                                    {isCompleted ? <Star className="w-4 h-4 fill-white" /> : level + 1}

                                    {/* Current indicator arrow */}
                                    {isCurrent && (
                                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 -translate-x-full">
                                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Simple Footer/Gradient fade */}
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-white/90 to-transparent pointer-events-none z-20"></div>
            <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-white/90 to-transparent pointer-events-none z-20"></div>
        </div>
    );
};
