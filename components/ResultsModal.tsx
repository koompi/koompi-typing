import React from 'react';
import { Leaderboard } from './Leaderboard';
import { GameStats, Challenge, Language } from '../types';
import { LevelData } from '../utils/levels';
import { Trophy, AlertCircle, Sparkles, Zap, ChevronRight, Crown } from 'lucide-react';

interface ResultsModalProps {
    stats: GameStats;
    maxCombo: number;
    xpGained: number;
    userStreak: number;
    challengeResult: { success: boolean; message: string } | null;
    mode: 'practice' | 'challenge-play' | 'adventure';
    activeChallenge: Challenge | null;
    currentLevelData: LevelData | null;
    lang: Language;
    t: Record<string, string>;
    onReturnToMenu: () => void;
    onNextLevel: () => void;
    onTryAgain: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
    stats,
    maxCombo,
    xpGained,
    userStreak,
    challengeResult,
    mode,
    activeChallenge,
    currentLevelData,
    lang,
    t,
    onReturnToMenu,
    onNextLevel,
    onTryAgain,
}) => {
    const isBossLevel = mode === 'adventure' && currentLevelData && ((currentLevelData.level + 1) % 10 === 0);
    const isSuccess = challengeResult?.success;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className={`bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full flex flex-col items-center relative border transition-all duration-500 overflow-hidden ${isBossLevel && isSuccess ? 'border-amber-400 ring-4 ring-amber-200' : 'border-white/50'}`}>

                {/* Boss Victory Background Effect */}
                {isBossLevel && isSuccess && (
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-100/50 to-transparent pointer-events-none"></div>
                )}

                {/* Icon */}
                {(isBossLevel && isSuccess) ? (
                    <div className="relative mb-6 scale-125">
                        <div className="absolute inset-0 bg-yellow-400 blur-[60px] opacity-40 animate-pulse"></div>
                        <Crown className="w-24 h-24 text-amber-500 animate-bounce drop-shadow-lg relative z-10" strokeWidth={1.5} />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            <span className="text-4xl animate-ping opacity-75">✨</span>
                        </div>
                    </div>
                ) : (mode === 'adventure' || activeChallenge) ? (
                    challengeResult?.success ? (
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-yellow-400 blur-[50px] opacity-20"></div>
                            <Trophy className="w-24 h-24 text-yellow-500 animate-bounce drop-shadow-md" />
                        </div>
                    ) : (
                        <AlertCircle className="w-20 h-20 text-rose-500 mb-6" />
                    )
                ) : (
                    <Trophy className="w-16 h-16 text-emerald-500 mb-6" />
                )}

                {/* Title */}
                <h2 className={`text-3xl md:text-4xl font-bold mb-2 tracking-tight font-khmer text-center ${isBossLevel && isSuccess ? 'text-amber-600 uppercase tracking-widest scale-110' : 'text-slate-800'}`}>
                    {isBossLevel && isSuccess ? "BOSS DEFEATED!" : (challengeResult?.message || t.finished)}
                </h2>

                {/* XP/Streak Banner */}
                {challengeResult?.success && (
                    <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 bg-slate-50 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-1 sm:gap-2 text-purple-600 font-bold text-sm sm:text-base">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> +{xpGained} XP
                        </div>
                        <div className="w-px h-4 sm:h-6 bg-slate-300"></div>
                        <div className="flex items-center gap-1 sm:gap-2 text-yellow-600 font-bold text-sm sm:text-base">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> {t.streak}: {userStreak}
                        </div>
                    </div>
                )}

                {/* Stats Grid - responsive columns */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-base sm:text-lg md:text-xl font-mono mb-6 sm:mb-8 md:mb-10 w-full px-1 sm:px-4">
                    <div className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                        <span className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest mb-1 font-khmer">{t.speed}</span>
                        <span className="text-slate-800 font-bold text-2xl sm:text-3xl md:text-4xl">{stats.wpm}</span>
                        <span className="text-slate-400 text-[10px] sm:text-xs">{t.wpm}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                        <span className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest mb-1 font-khmer">{t.accuracy}</span>
                        <span className={`font-bold text-2xl sm:text-3xl md:text-4xl ${stats.accuracy >= 98 ? 'text-emerald-500' : 'text-slate-800'}`}>
                            {stats.accuracy}%
                        </span>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                        <span className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest mb-1 font-khmer">{t.bestCombo}</span>
                        <span className="text-orange-500 font-bold text-2xl sm:text-3xl md:text-4xl">{maxCombo}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center px-2">
                    <button
                        onClick={onReturnToMenu}
                        className="px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all border border-slate-200 shadow-sm font-khmer w-full sm:w-auto sm:min-w-[140px]"
                    >
                        {t.menu}
                    </button>

                    {mode === 'adventure' ? (
                        challengeResult?.success ? (
                            <button
                                onClick={onNextLevel}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 font-khmer w-full sm:w-auto sm:min-w-[160px]"
                            >
                                {t.nextLevel} <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={onTryAgain}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all font-khmer w-full sm:w-auto sm:min-w-[160px]"
                            >
                                {t.tryAgain}
                            </button>
                        )
                    ) : (
                        <button
                            onClick={onTryAgain}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all font-khmer w-full sm:w-auto sm:min-w-[160px]"
                        >
                            {t.tryAgain}
                        </button>
                    )}
                </div>

                {/* Leaderboard for Challenges */}
                {activeChallenge && (
                    <div className="w-full mt-6 sm:mt-8">
                        <Leaderboard challenge={activeChallenge} lang={lang} />
                    </div>
                )}
            </div>
        </div>
    );
};
