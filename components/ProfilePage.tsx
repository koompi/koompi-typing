import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Clock, Calendar, ArrowLeft, Target, Award } from 'lucide-react';
import { getUserXP, getStreak, getLeaderboard, getLevelProgress } from '../services/storageService';
import { Language, LeaderboardEntry } from '../types';
import { LEVEL_METADATA } from '../utils/levels';

interface ProfilePageProps {
    lang: Language;
    onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ lang, onBack }) => {
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState<LeaderboardEntry[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [levelsCompleted, setLevelsCompleted] = useState(0);

    useEffect(() => {
        setXp(getUserXP());
        setStreak(getStreak());
        setHistory(getLeaderboard());

        // Calculate Stars & Progress
        let stars = 0;
        let completed = 0;
        // Iterate through a reasonable range or use LEVEL_METADATA
        // We'll scan up to 150 levels (15 units * 10)
        for (let i = 0; i < 150; i++) {
            const prog = getLevelProgress(lang, i);
            if (prog.stars > 0) {
                stars += prog.stars;
                completed++;
            }
        }
        setTotalStars(stars);
        setLevelsCompleted(completed);
    }, [lang]);

    const t = {
        profile: lang === 'km' ? 'ប្រវត្តិរូប' : 'Profile',
        stats: lang === 'km' ? 'ស្ថិតិ' : 'Statistics',
        history: lang === 'km' ? 'ប្រវត្តិ' : 'History',
        totalXP: lang === 'km' ? 'ពិន្ទុសរុប' : 'Total XP',
        streak: lang === 'km' ? 'ជាប់ៗគ្នា' : 'Day Streak',
        stars: lang === 'km' ? 'ផ្កាយ' : 'Stars',
        levels: lang === 'km' ? 'កម្រិតបានបញ្ចប់' : 'Levels Cleared',
        date: lang === 'km' ? 'កាលបរិច្ឆេទ' : 'Date',
        wpm: lang === 'km' ? 'ពាក្យ/នាទី' : 'WPM',
        acc: lang === 'km' ? 'ភាពត្រឹមត្រូវ' : 'Accuracy',
    };

    return (
        <div className="flex-1 flex flex-col relative z-10 overflow-hidden h-full">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:p-6 bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className={`text-2xl font-bold text-slate-800 ${lang === 'km' ? 'font-khmer' : ''}`}>
                        {t.profile}
                    </h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Stats Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                            <div className="p-3 bg-indigo-100 text-indigo-500 rounded-full">
                                <Zap className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{xp.toLocaleString()}</div>
                            <div className={`text-xs text-slate-400 font-bold uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.totalXP}</div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                            <div className="p-3 bg-orange-100 text-orange-500 rounded-full">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{streak} 🔥</div>
                            <div className={`text-xs text-slate-400 font-bold uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.streak}</div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                            <div className="p-3 bg-yellow-100 text-yellow-500 rounded-full">
                                <Star className="w-6 h-6 fill-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{totalStars}</div>
                            <div className={`text-xs text-slate-400 font-bold uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.stars}</div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                            <div className="p-3 bg-emerald-100 text-emerald-500 rounded-full">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800">{levelsCompleted}</div>
                            <div className={`text-xs text-slate-400 font-bold uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.levels}</div>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <h3 className={`font-bold text-lg text-slate-700 ${lang === 'km' ? 'font-khmer' : ''}`}>{t.history}</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.date}</th>
                                        <th className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.wpm}</th>
                                        <th className={`px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider ${lang === 'km' ? 'font-khmer' : ''}`}>{t.acc}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.length > 0 ? history.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                                {new Date(entry.date).toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                {entry.wpm}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded font-bold text-xs ${entry.accuracy >= 98 ? 'bg-emerald-100 text-emerald-600' :
                                                        entry.accuracy >= 90 ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {entry.accuracy}%
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                                No history yet. Start typing!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
