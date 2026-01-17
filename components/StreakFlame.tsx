import React from 'react';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
    streak: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

/**
 * Visual flame that changes appearance based on streak length:
 * - 0 days: Grey (inactive)
 * - 1-2 days: Orange
 * - 3-6 days: Blue (frozen fire)
 * - 7-29 days: Purple
 * - 30+ days: Rainbow/Gold (legendary)
 */
export const StreakFlame: React.FC<StreakFlameProps> = ({ streak, size = 'md', showLabel = true }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-8 h-8',
    };

    const getFlameStyle = () => {
        if (streak === 0) {
            return {
                iconClass: 'text-slate-300',
                fillClass: '',
                animation: '',
                glow: '',
            };
        }
        if (streak <= 2) {
            // Orange - normal flame
            return {
                iconClass: 'text-orange-500',
                fillClass: 'fill-orange-400',
                animation: 'animate-pulse',
                glow: 'drop-shadow-[0_0_4px_rgba(249,115,22,0.5)]',
            };
        }
        if (streak <= 6) {
            // Blue - frozen flame
            return {
                iconClass: 'text-cyan-400',
                fillClass: 'fill-cyan-300',
                animation: 'animate-pulse',
                glow: 'drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]',
            };
        }
        if (streak <= 29) {
            // Purple - intense
            return {
                iconClass: 'text-purple-500',
                fillClass: 'fill-purple-400',
                animation: 'animate-bounce',
                glow: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]',
            };
        }
        // 30+ days - Rainbow/Gold legendary
        return {
            iconClass: 'text-amber-400',
            fillClass: 'fill-amber-300',
            animation: 'animate-bounce',
            glow: 'drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]',
            isLegendary: true,
        };
    };

    const style = getFlameStyle();

    return (
        <div className="flex items-center gap-2" title={`${streak} day streak`}>
            <div className={`relative ${style.animation}`}>
                {/* Legendary glow ring */}
                {(style as any).isLegendary && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 opacity-30 blur-md animate-spin-slow" style={{ animationDuration: '3s' }} />
                )}
                <Flame
                    className={`${sizeClasses[size]} ${style.iconClass} ${style.fillClass} ${style.glow} transition-all duration-300`}
                />
            </div>
            {showLabel && (
                <span className={`font-bold ${streak >= 7 ? 'text-purple-600' : streak >= 3 ? 'text-cyan-600' : 'text-slate-600'}`}>
                    {streak}
                </span>
            )}
        </div>
    );
};
