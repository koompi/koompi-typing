import React, { useState, useEffect, useMemo } from 'react';

type BirdState = 'idle' | 'sleeping' | 'typing' | 'fast' | 'celebrating' | 'error';

interface KoompiBirdProps {
    wpm: number;
    isTyping: boolean;
    isFinished: boolean;
    lastTypedTime: number;
    combo: number;
    hasError?: boolean;
}

export const KoompiBird: React.FC<KoompiBirdProps> = ({
    wpm,
    isTyping,
    isFinished,
    lastTypedTime,
    combo,
    hasError = false,
}) => {
    const [state, setState] = useState<BirdState>('idle');
    const [blinkPhase, setBlinkPhase] = useState(false);
    const [showError, setShowError] = useState(false);

    // Handle error flash state
    useEffect(() => {
        if (hasError) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 500);
            return () => clearTimeout(timer);
        }
    }, [hasError]);

    // Determine bird state based on props
    useEffect(() => {
        if (showError) {
            setState('error');
            return;
        }

        if (isFinished) {
            setState('celebrating');
            return;
        }

        const now = Date.now();
        const idleTime = now - lastTypedTime;

        if (idleTime > 30000) {
            setState('sleeping');
        } else if (wpm >= 50 || combo >= 20) {
            setState('fast');
        } else if (isTyping) {
            setState('typing');
        } else {
            setState('idle');
        }
    }, [wpm, isTyping, isFinished, lastTypedTime, combo, showError]);

    // Blink animation
    useEffect(() => {
        if (state === 'sleeping') return;

        const blinkInterval = setInterval(() => {
            setBlinkPhase(true);
            setTimeout(() => setBlinkPhase(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(blinkInterval);
    }, [state]);

    const stateStyles = useMemo(() => {
        switch (state) {
            case 'sleeping':
                return {
                    body: 'animate-pulse',
                    wing: '',
                    eyeState: 'closed',
                };
            case 'fast':
                return {
                    body: 'animate-bounce',
                    wing: 'animate-wing-flap-fast',
                    eyeState: 'excited',
                };
            case 'celebrating':
                return {
                    body: 'animate-jump',
                    wing: 'animate-wing-flap-fast',
                    eyeState: 'stars',
                };
            case 'typing':
                return {
                    body: 'animate-bob',
                    wing: 'animate-wing-flap',
                    eyeState: 'focused',
                };
            case 'error':
                return {
                    body: 'animate-micro-shake',
                    wing: '',
                    eyeState: 'dizzy',
                };
            default:
                return {
                    body: 'animate-float-slow',
                    wing: '',
                    eyeState: 'normal',
                };
        }
    }, [state]);

    return (
        <div className={`relative w-16 h-16 ${stateStyles.body}`}>
            <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                {/* Body */}
                <ellipse
                    cx="32"
                    cy="36"
                    rx="18"
                    ry="20"
                    className="fill-amber-400"
                />

                {/* Belly */}
                <ellipse
                    cx="32"
                    cy="40"
                    rx="12"
                    ry="13"
                    className="fill-amber-100"
                />

                {/* Left Wing */}
                <ellipse
                    cx="16"
                    cy="34"
                    rx="8"
                    ry="12"
                    className={`fill-amber-500 origin-right ${stateStyles.wing}`}
                    style={{ transformOrigin: '16px 28px' }}
                />

                {/* Right Wing */}
                <ellipse
                    cx="48"
                    cy="34"
                    rx="8"
                    ry="12"
                    className={`fill-amber-500 origin-left ${stateStyles.wing}`}
                    style={{ transformOrigin: '48px 28px', animationDelay: '0.1s' }}
                />

                {/* Beak */}
                <polygon
                    points="32,38 28,34 36,34"
                    className="fill-orange-500"
                />

                {/* Eyes */}
                {stateStyles.eyeState === 'closed' || stateStyles.eyeState === 'sleeping' ? (
                    <>
                        <path d="M24,28 Q27,30 30,28" className="stroke-slate-700 stroke-2 fill-none" />
                        <path d="M34,28 Q37,30 40,28" className="stroke-slate-700 stroke-2 fill-none" />
                    </>
                ) : stateStyles.eyeState === 'stars' ? (
                    <>
                        <text x="24" y="30" className="text-[8px]">⭐</text>
                        <text x="36" y="30" className="text-[8px]">⭐</text>
                    </>
                ) : stateStyles.eyeState === 'dizzy' ? (
                    <>
                        {/* X eyes for error/dizzy state */}
                        <g className="stroke-slate-700 stroke-[2.5]">
                            <line x1="23" y1="25" x2="29" y2="31" />
                            <line x1="29" y1="25" x2="23" y2="31" />
                            <line x1="35" y1="25" x2="41" y2="31" />
                            <line x1="41" y1="25" x2="35" y2="31" />
                        </g>
                    </>
                ) : (
                    <>
                        <circle
                            cx="26"
                            cy={blinkPhase ? 27 : 28}
                            r={blinkPhase ? 1 : 3}
                            className="fill-slate-800"
                        />
                        <circle
                            cx="38"
                            cy={blinkPhase ? 27 : 28}
                            r={blinkPhase ? 1 : 3}
                            className="fill-slate-800"
                        />
                        {/* Eye shine */}
                        {!blinkPhase && (
                            <>
                                <circle cx="27" cy="27" r="1" className="fill-white" />
                                <circle cx="39" cy="27" r="1" className="fill-white" />
                            </>
                        )}
                    </>
                )}

                {/* Blush (when fast or celebrating) */}
                {(state === 'fast' || state === 'celebrating') && (
                    <>
                        <circle cx="20" cy="34" r="3" className="fill-pink-300 opacity-60" />
                        <circle cx="44" cy="34" r="3" className="fill-pink-300 opacity-60" />
                    </>
                )}

                {/* Sleep Zzz */}
                {state === 'sleeping' && (
                    <text x="44" y="20" className="text-[10px] fill-slate-600 animate-float">
                        💤
                    </text>
                )}

                {/* Sweat drop (when error) */}
                {state === 'error' && (
                    <>
                        <ellipse cx="46" cy="24" rx="3" ry="4" className="fill-sky-300" />
                        <text x="44" y="16" className="text-[10px]">💦</text>
                    </>
                )}

                {/* Speed lines (when fast) */}
                {state === 'fast' && (
                    <>
                        <line x1="2" y1="30" x2="10" y2="30" className="stroke-amber-300 stroke-2 animate-pulse" />
                        <line x1="4" y1="36" x2="12" y2="36" className="stroke-amber-300 stroke-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <line x1="2" y1="42" x2="10" y2="42" className="stroke-amber-300 stroke-2 animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </>
                )}
            </svg>

            {/* Combo indicator */}
            {combo >= 10 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                    🔥
                </div>
            )}
        </div>
    );
};
