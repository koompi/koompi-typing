import React, { useEffect, useState } from 'react';
import { Trophy, ArrowLeft, Medal, Crown, Zap, Clock, Target } from 'lucide-react';
import { getLeaderboard } from '../services/storageService';
import { Language, LeaderboardEntry } from '../types';

interface LeaderboardPageProps {
    lang: Language;
    onBack: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ lang, onBack }) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        // Load local leaderboard data
        const data = getLeaderboard();
        setEntries(data.slice(0, 20)); // Top 20
    }, []);

    const t = {
        title: lang === 'km' ? 'បញ្ជីអ្នកឈ្នះ' : 'Hall of Fame',
        rank: lang === 'km' ? 'ចំណាត់ថ្នាក់' : 'Rank',
        wpm: lang === 'km' ? 'ពាក្យ/នាទី' : 'WPM',
        accuracy: lang === 'km' ? 'ភាពត្រឹមត្រូវ' : 'Accuracy',
        date: lang === 'km' ? 'កាលបរិច្ឆេទ' : 'Date',
        empty: lang === 'km' ? 'មិនទាន់មានកំណត់ត្រា។ ចាប់ផ្តើមវាយអក្សរឥឡូវនេះ!' : 'No records yet. Start typing to make history!',
        yourBest: lang === 'km' ? 'កំណត់ត្រាល្អបំផុតរបស់អ្នក' : 'Your Best Records',
    };

    const getMedalColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-500'; // Gold
        if (rank === 1) return 'text-slate-400'; // Silver
        if (rank === 2) return 'text-amber-600'; // Bronze
        return 'text-slate-300';
    };

    const getMedalIcon = (rank: number) => {
        if (rank === 0) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-200" />;
        if (rank === 1) return <Medal className="w-5 h-5 text-slate-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="text-slate-400 font-bold text-sm">{rank + 1}</span>;
    };

    return (
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-fuchsia-500">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:p-6 bg-white/10 backdrop-blur-md sticky top-0 z-20 border-b border-white/20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-400 rounded-xl shadow-lg">
                            <Trophy className="w-6 h-6 text-yellow-900" />
                        </div>
                        <h1 className={`text-2xl font-bold text-white ${lang === 'km' ? 'font-khmer' : ''}`}>
                            {t.title}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-2xl mx-auto">
                    {entries.length === 0 ? (
                        <div className="text-center py-16 bg-white/10 rounded-3xl backdrop-blur-sm">
                            <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
                            <p className={`text-white/80 text-lg ${lang === 'km' ? 'font-khmer' : ''}`}>
                                {t.empty}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {entries.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${index < 3
                                            ? 'bg-white shadow-xl border-2 border-yellow-200'
                                            : 'bg-white/90 shadow-md'
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-slate-100' : index === 2 ? 'bg-amber-100' : 'bg-slate-50'
                                        }`}>
                                        {getMedalIcon(index)}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Zap className={`w-4 h-4 ${getMedalColor(index)}`} />
                                            <span className={`text-2xl font-black ${index < 3 ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                {entry.wpm}
                                            </span>
                                            <span className="text-xs text-slate-400 font-bold uppercase">{t.wpm}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                {entry.accuracy}%
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(entry.date).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Rank Number (for non-top-3) */}
                                    {index >= 3 && (
                                        <div className="text-2xl font-black text-slate-200">
                                            #{index + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
