import React, { useState, useEffect, useCallback, useRef } from 'react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Hand } from './FingerGuide';
import { TypingVisualizer } from './TypingVisualizer';
import { useKhmerInput, normalizeKhmerText } from '../hooks/useKhmerInput';
import { KEYBOARD_LAYOUT } from '../utils/keyboardData';
import { Language, GameStats, Finger, Challenge } from '../types';
import { LevelData } from '../utils/levels';
import { RefreshCw, ArrowLeft, Clock, Map, Trophy, Play, WifiOff, Flame, Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useSettings } from '../contexts/SettingsContext';
import { BiomeBackground } from './BiomeBackground';
import { getBiomeForLevel } from '../utils/biomes';
import { useAudioSynth, useMusicSynth } from '../hooks/useAudioSynth';

interface TypingGameProps {
    mode: 'practice' | 'challenge-play' | 'adventure';
    lang: Language;
    targetText: string;
    activeChallenge: Challenge | null;
    currentLevelData: LevelData | null;
    isLoading: boolean;
    isOnline: boolean;
    t: Record<string, string>;
    onFinish: (stats: GameStats, maxCombo: number) => void;
    onReturnToMenu: () => void;
    onRefresh: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({
    mode,
    lang,
    targetText,
    activeChallenge,
    currentLevelData,
    isLoading,
    isOnline,
    t,
    onFinish,
    onReturnToMenu,
    onRefresh,
}) => {
    const [userInput, setUserInput] = useState('');
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Gamification
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);

    // Timer for challenges
    const [challengeTimeLeft, setChallengeTimeLeft] = useState<number | null>(null);

    const [stats, setStats] = useState<GameStats>({
        wpm: 0,
        accuracy: 100,
        charsTyped: 0,
        errors: 0,
        startTime: null,
    });

    // DOM Refs for Teleprompter
    const textContainerRef = useRef<HTMLDivElement>(null);
    const activeCharRef = useRef<HTMLSpanElement>(null);

    // Boss Detection (Every 10th level: 9, 19, 29...)
    const isBossLevel = mode === 'adventure' && currentLevelData && ((currentLevelData.level + 1) % 10 === 0);

    // Text-to-Speech
    const { speak, speaking, supported: ttsSupported } = useTTS();

    // Normalize target text for comparison
    const normalizedTarget = normalizeKhmerText(targetText);

    // Reset state when target text changes
    useEffect(() => {
        setUserInput('');
        setIsFinished(false);
        setCombo(0);
        setMaxCombo(0);
        setStats({
            wpm: 0,
            accuracy: 100,
            charsTyped: 0,
            errors: 0,
            startTime: null,
        });

        if (activeChallenge?.criteria.timeLimitSeconds) {
            setChallengeTimeLeft(activeChallenge.criteria.timeLimitSeconds);
        } else {
            setChallengeTimeLeft(null);
        }
    }, [targetText, activeChallenge]);

    // Auto-read effect - speak when new text loads and auto-read is enabled
    const { settings } = useSettings();
    const { playThock, playError, playSuccess } = useAudioSynth(settings.soundEffects);
    const { startMusic, stopMusic } = useMusicSynth(settings.backgroundMusic);

    // Music Logic
    useEffect(() => {
        if (!settings.backgroundMusic || isFinished) {
            stopMusic();
            return;
        }

        if (isBossLevel) {
            startMusic('boss');
        } else {
            startMusic('ambient');
        }

        return () => stopMusic();
    }, [isBossLevel, settings.backgroundMusic, isFinished, startMusic, stopMusic]);

    useEffect(() => {
        if (settings.autoRead && ttsSupported && targetText && targetText !== 'Loading...' && !isLoading) {
            // Small delay to let the UI settle
            const timer = setTimeout(() => speak(targetText, lang), 300);
            return () => clearTimeout(timer);
        }
    }, [targetText, isLoading, settings.autoRead, ttsSupported, lang, speak]);

    // Handle character input from the hook
    const handleCharacter = useCallback((charTyped: string) => {
        if (isFinished || isLoading) return;

        // Start timer on first character
        if (!stats.startTime) {
            setStats(prev => ({ ...prev, startTime: Date.now() }));
        }

        const expectedChar = normalizedTarget[userInput.length];
        if (!expectedChar) return;

        if (charTyped === expectedChar) {
            playThock(); // <--- Sound on correct type
            const newUserInput = userInput + charTyped;
            setUserInput(newUserInput);
            setStats(prev => ({ ...prev, charsTyped: prev.charsTyped + 1 }));

            setCombo(c => {
                const next = c + 1;
                if (next > maxCombo) setMaxCombo(next);
                return next;
            });

            // Check if finished
            if (newUserInput.length === normalizedTarget.length) {
                playSuccess(); // <--- Sound on logic finish
                finishGame();
            }
        } else {
            playError(); // <--- Sound on error
            setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
            setCombo(0);

            // Fail immediately for 100% accuracy challenges
            if (activeChallenge?.criteria.minAccuracy === 100) {
                setIsFinished(true);
                onFinish(stats, maxCombo);
            }
        }
    }, [userInput, normalizedTarget, isFinished, isLoading, stats, maxCombo, activeChallenge, onFinish, playThock, playError, playSuccess]);

    // Handle backspace
    const handleBackspace = useCallback(() => {
        if (isFinished || isLoading) return;
        setUserInput(prev => prev.slice(0, -1));
        setCombo(0);
    }, [isFinished, isLoading]);

    // Use the Khmer input hook
    const {
        inputRef,
        isComposing,
        platform,
        handleInput,
        handleKeyDown: hookKeyDown,
        handleCompositionStart,
        handleCompositionEnd,
        focusInput,
        clearInput,
    } = useKhmerInput({
        lang,
        onCharacter: handleCharacter,
        onBackspace: handleBackspace,
        disabled: isFinished || isLoading,
    });

    // Handle keyboard visual feedback (key highlighting)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLoading || isFinished) return;

            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.add(e.code);
                return newSet;
            });

            if (e.key === 'Shift') {
                setIsShiftActive(true);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setPressedKeys(prev => {
                const newSet = new Set(prev);
                newSet.delete(e.code);
                return newSet;
            });

            if (e.key === 'Shift') {
                setIsShiftActive(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isLoading, isFinished]);

    // Auto-scroll teleprompter
    useEffect(() => {
        if (activeCharRef.current && textContainerRef.current) {
            const container = textContainerRef.current;
            const char = activeCharRef.current;
            const containerWidth = container.offsetWidth;
            const charLeft = char.offsetLeft;
            const charWidth = char.offsetWidth;
            const targetScrollLeft = charLeft - (containerWidth / 2) + (charWidth / 2);
            container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        }
    }, [userInput, targetText]);

    // Update WPM/Accuracy in real-time
    useEffect(() => {
        if (!stats.startTime || isFinished) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const timeElapsedMin = (now - stats.startTime!) / 60000;
            const wpm = Math.round((stats.charsTyped / 5) / (timeElapsedMin || 0.001));
            const accuracy = stats.charsTyped > 0
                ? Math.round(((stats.charsTyped - stats.errors) / stats.charsTyped) * 100)
                : 100;

            setStats(prev => ({ ...prev, wpm, accuracy: Math.max(0, accuracy) }));

            // Handle time limit
            if (activeChallenge?.criteria.timeLimitSeconds) {
                const elapsedSec = (now - stats.startTime!) / 1000;
                const left = Math.max(0, activeChallenge.criteria.timeLimitSeconds - elapsedSec);
                setChallengeTimeLeft(Math.ceil(left));
                if (left <= 0) finishGame();
            }
        }, 500);

        return () => clearInterval(interval);
    }, [stats.startTime, isFinished, activeChallenge, stats.charsTyped, stats.errors]);

    const finishGame = () => {
        setIsFinished(true);
        onFinish(stats, maxCombo);
    };

    // Get active finger for hand visualization
    const getActiveFinger = (): Finger | null => {
        if (isFinished) return null;
        const nextChar = normalizedTarget[userInput.length];
        if (!nextChar) return null;

        for (const row of KEYBOARD_LAYOUT) {
            for (const key of row) {
                if (key[lang].normal === nextChar || key[lang].shift === nextChar) {
                    return key.finger;
                }
            }
        }
        if (nextChar === '\n') return 'R-pinky';
        return null;
    };

    const activeFinger = getActiveFinger();
    const progressPercent = Math.min(100, Math.max(0, (userInput.length / (normalizedTarget.length || 1)) * 100));

    return (
        <div className={`min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200 text-slate-800 flex flex-col font-sans overflow-hidden ${lang === 'km' ? 'font-khmer' : ''} relative`}>

            {/* Hidden Input for IME Support */}
            <input
                ref={inputRef}
                type="text"
                className="absolute opacity-0 pointer-events-none"
                style={{ position: 'fixed', top: -1000, left: -1000 }}
                onInput={handleInput}
                onKeyDown={hookKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Typing input"
            />

            {/* Header */}
            <header className="flex justify-between items-center p-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onReturnToMenu}
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2 text-slate-800 font-khmer">
                            {mode === 'adventure' && currentLevelData ? (
                                <>
                                    <span className="text-blue-500"><Map className="w-4 h-4" /></span>
                                    {currentLevelData.title}
                                </>
                            ) : activeChallenge ? (
                                <>
                                    <span className="text-yellow-500"><Trophy className="w-4 h-4" /></span>
                                    {lang === 'km' && activeChallenge.title_km ? activeChallenge.title_km : activeChallenge.title}
                                </>
                            ) : (
                                <>
                                    <span className="text-emerald-500"><Play className="w-4 h-4" /></span>
                                    {t.practiceTitle}
                                </>
                            )}
                        </h1>
                        <div className="flex items-center gap-2">
                            {mode === 'adventure' && currentLevelData && (
                                <span className="text-xs text-blue-600 uppercase tracking-widest font-bold bg-blue-50 px-2 py-0.5 rounded font-khmer border border-blue-100">
                                    {lang === 'km' ? 'កម្រិត' : 'Lvl'} {currentLevelData.level}
                                </span>
                            )}
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold bg-white px-2 py-0.5 rounded font-khmer border border-slate-200">
                                {lang === 'km' ? 'ខ្មែរ' : 'English'}
                            </span>
                            {/* Platform indicator for debugging */}
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                                {platform}
                            </span>
                            {isComposing && (
                                <span className="text-[10px] text-orange-500 uppercase tracking-widest font-bold animate-pulse">
                                    IME
                                </span>
                            )}
                            {!isOnline && (
                                <span className="text-[10px] text-rose-500 uppercase tracking-widest font-bold border border-rose-200 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 font-khmer">
                                    <WifiOff className="w-3 h-3" /> {t.offline}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Visualizer */}
                    {!isFinished && (
                        <div className="mr-2 transform hover:scale-110 transition-transform duration-300 drop-shadow-md">
                            <TypingVisualizer progress={progressPercent} wpm={stats.wpm} accuracy={stats.accuracy} />
                        </div>
                    )}

                    {/* Combo Counter */}
                    {combo > 5 && !isFinished && (
                        <div className="animate-bounce flex items-center gap-1 text-orange-500 font-black italic text-2xl drop-shadow-sm">
                            <Flame className="w-6 h-6 fill-orange-500 text-orange-600 animate-pulse" />
                            {combo}x
                        </div>
                    )}

                    {/* Timer */}
                    {challengeTimeLeft !== null && (
                        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${challengeTimeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                            <Clock className="w-5 h-5" />
                            {challengeTimeLeft}s
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 text-sm font-mono bg-white/80 px-4 py-2 rounded-xl border border-white/60 backdrop-blur-md shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">{t.wpm}</span>
                            <span className="text-slate-800 font-bold text-lg">{stats.wpm}</span>
                        </div>
                        <div className="w-px bg-slate-200 h-6"></div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">{t.acc}</span>
                            <span className={`font-bold text-lg ${stats.accuracy === 100 ? 'text-emerald-500' : stats.accuracy > 90 ? 'text-slate-800' : 'text-rose-500'}`}>
                                {stats.accuracy}%
                            </span>
                        </div>
                    </div>

                    {/* Refresh button for practice mode */}
                    {mode === 'practice' && (
                        <button
                            onClick={onRefresh}
                            className="p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all bg-white border border-slate-200 shadow-sm"
                            title="Restart"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main
                className="flex-grow flex flex-col items-center justify-center p-4 gap-8 max-w-7xl mx-auto w-full relative z-10"
                onClick={focusInput}
            >

                {/* Helper Instructions for Level */}
                {mode === 'adventure' && currentLevelData && !isFinished && (
                    <div className="bg-white/80 text-blue-800 px-6 py-2 rounded-full border border-blue-200 text-sm font-medium animate-float-slow backdrop-blur-sm shadow-md font-khmer">
                        🎯 {t.goal}: {currentLevelData.description} ({t.needs} {currentLevelData.criteria.minAccuracy}% {t.accuracy}, {currentLevelData.criteria.minWpm} {t.wpm})
                    </div>
                )}

                {/* Typing Area (Clean & Reactive) */}
                <div className={`relative w-full max-w-4xl transition-transform duration-100 ${(stats.errors > 0 || isBossLevel) && stats.errors > 0 ? 'animate-shake' : ''}`}>
                    {/* Boss Banner */}
                    {isBossLevel && !isFinished && (
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-4 py-1.5 rounded-full font-black tracking-widest shadow-lg border-2 border-rose-400 animate-pulse z-20 flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm">
                            <Flame className="w-4 h-4 animate-bounce" /> BOSS BATTLE <Flame className="w-4 h-4 animate-bounce" />
                        </div>
                    )}

                    {/* TTS Button */}
                    {ttsSupported && (
                        <button
                            onClick={() => speak(targetText, lang)}
                            disabled={speaking}
                            className={`absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all ${speaking ? 'text-blue-500 animate-pulse ring-2 ring-blue-400' : 'text-slate-600 hover:text-blue-600'}`}
                            title={lang === 'km' ? "ស្តាប់" : "Listen"}
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                    )}

                    <div className="w-full h-40 relative flex flex-col justify-center">
                        {/* Center Marker - Subtle */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-16 bg-slate-400/30 rounded-full z-0 pointer-events-none"></div>

                        <div
                            ref={textContainerRef}
                            className={`flex items-center overflow-x-auto h-full px-[50%] no-scrollbar transition-colors duration-500 ${isBossLevel ? 'drop-shadow-[0_0_15px_rgba(225,29,72,0.3)]' : ''}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <div className={`flex items-center whitespace-nowrap font-mono text-5xl md:text-6xl ${lang === 'km' ? 'font-khmer leading-relaxed' : ''}`}>
                                {normalizedTarget.split('').map((char, idx) => {
                                    const isTyped = idx < userInput.length;
                                    const isCurrent = idx === userInput.length;
                                    let base = "mx-0.5 px-0.5 transition-all duration-150 relative ";

                                    if (isTyped) {
                                        // Typed characters fade out slightly
                                        base += "text-slate-800 opacity-40 scale-90 blur-[0.5px]";
                                    } else if (isCurrent) {
                                        // Active Character - Big & Bouncy
                                        base += `font-black scale-125 z-10 animate-bounce drop-shadow-md ${isBossLevel ? 'text-rose-600' : 'text-blue-700'}`;
                                    } else {
                                        // Future characters
                                        base += "text-slate-700 opacity-90";
                                    }

                                    return (
                                        <span
                                            key={idx}
                                            ref={isCurrent ? activeCharRef : null}
                                            className={base}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                            {/* Cursor / Caret underneath */}
                                            {isCurrent && (
                                                <div className={`absolute -bottom-2 left-0 right-0 h-1 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] ${isBossLevel ? 'bg-rose-500 shadow-rose-500/50' : 'bg-blue-500 shadow-blue-500/50'}`}></div>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Keyboard & Hands Container */}
                <div className="w-full flex justify-center items-end gap-2 lg:gap-8 max-w-[1600px] mx-auto pb-4 px-4 mt-auto">
                    {/* Left Hand */}
                    <div className="hidden lg:block w-40 h-40 xl:w-56 xl:h-56 shrink-0 opacity-90 pointer-events-none select-none">
                        <Hand side="left" activeFinger={activeFinger} />
                    </div>

                    {/* Keyboard */}
                    <div className="flex-1 max-w-[950px] min-w-0 z-10">
                        <VirtualKeyboard
                            lang={lang}
                            pressedKeys={pressedKeys}
                            nextKeyToType={!isFinished ? normalizedTarget[userInput.length] : null}
                            isShiftActive={isShiftActive}
                        />
                    </div>

                    {/* Right Hand */}
                    <div className="hidden lg:block w-40 h-40 xl:w-56 xl:h-56 shrink-0 opacity-90 pointer-events-none select-none">
                        <Hand side="right" activeFinger={activeFinger} />
                    </div>
                </div>
            </main>
        </div>
    );
};
