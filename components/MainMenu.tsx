import React from 'react';
import { LevelRoadmap } from './LevelRoadmap';
import { CHALLENGES } from '../utils/challenges';
import { Language, Challenge } from '../types';
import {
    Keyboard, Globe, Trophy, Flame, Sparkles,
    Star, Cloud, User, Settings
} from 'lucide-react';
import { BiomeBackground } from './BiomeBackground';
import { getBiomeForLevel } from '../utils/biomes';
import { StreakFlame } from './StreakFlame';

interface MainMenuProps {
    lang: Language;
    userXP: number;
    userStreak: number;
    currentLevel: number;
    t: Record<string, string>;
    onToggleLang: () => void;
    onStartPractice: () => void;
    onStartDrill?: () => void;
    onStartChallenge: (challenge: Challenge) => void;
    onSelectLevel: (level: number) => void;
    onOpenSettings?: () => void;
    onOpenProfile?: () => void;
    onOpenLeaderboard?: () => void;
}

// Footer Component
const KoompiFooter: React.FC<{ t: Record<string, string>, lang: Language }> = ({ t, lang }) => (
    <footer className="w-full py-6 flex justify-center items-center gap-2 mt-auto">
        <span className={`text-xs font-bold text-slate-600 flex items-center gap-1 ${lang === 'km' ? 'font-khmer' : ''}`}>
            {lang === 'km' ? 'បង្កើតដោយ' : 'Built with'} <span className="text-red-500">❤️</span> {lang === 'km' ? 'ដោយ' : 'by'}
        </span>
        <a
            href="https://koompi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group transition-all hover:scale-105"
        >
            <img
                src="/icons/koompi.png"
                alt="KOOMPI"
                className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm"
            />
        </a>
        <span className={`text-xs font-bold text-slate-600 ${lang === 'km' ? 'font-khmer' : ''}`}>
            {lang === 'km' ? 'សម្រាប់អ្នកកសាងជំនាន់ក្រោយ។' : 'for next generation of builders.'}
        </span>
    </footer>
);

export const MainMenu: React.FC<MainMenuProps> = ({
    lang,
    userXP,
    userStreak,
    currentLevel,
    t,
    onToggleLang,
    onStartPractice,
    onStartDrill,
    onStartChallenge,
    onSelectLevel,
    onOpenSettings,
    onOpenProfile,
    onOpenLeaderboard,
}) => {
    return (
        <div className={`h-screen text-slate-800 flex flex-col font-sans ${lang === 'km' ? 'font-khmer' : ''} overflow-hidden relative`}>
            {/* Dynamic Biome Background */}
            <BiomeBackground biome={getBiomeForLevel(currentLevel)} />

            {/* Top Navigation Bar */}
            <div className="shrink-0 z-50 px-4 py-3 relative">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-500 rounded-xl p-1.5 shadow-lg shadow-blue-200">
                            <Keyboard className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-black text-slate-700 tracking-tight hidden md:block">
                            KOOMPI <span className="text-blue-500">TYPING</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <StreakFlame streak={userStreak} />
                        <div className="flex items-center gap-2" title={t.experience}>
                            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-slate-600">{userXP}</span>
                        </div>
                        <button
                            onClick={onToggleLang}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-600 text-sm transition-colors uppercase border-b-2 border-slate-200"
                        >
                            <Globe className="w-4 h-4" />
                            {lang}
                        </button>
                        {onOpenProfile && (
                            <button
                                onClick={onOpenProfile}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors border-b-2 border-slate-200"
                                title={lang === 'km' ? 'ប្រវត្តិរូប' : 'Profile'}
                            >
                                <User className="w-4 h-4" />
                            </button>
                        )}
                        {onOpenLeaderboard && (
                            <button
                                onClick={onOpenLeaderboard}
                                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-yellow-600 transition-colors border-b-2 border-yellow-300"
                                title={lang === 'km' ? 'បញ្ជីអ្នកឈ្នះ' : 'Leaderboard'}
                            >
                                <Trophy className="w-4 h-4" />
                            </button>
                        )}
                        {onOpenSettings && (
                            <button
                                onClick={onOpenSettings}
                                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors border-b-2 border-slate-200"
                                title={lang === 'km' ? 'ការកំណត់' : 'Settings'}
                            >
                                <Settings className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth" id="main-scroll-container">
                <div className="flex justify-center w-full max-w-6xl mx-auto pt-8 px-4 gap-8 min-h-full">

                    {/* Left Column: Quick Actions */}
                    <div className="hidden lg:flex flex-col gap-6 w-64 shrink-0 sticky top-6 h-fit">
                        <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-sm flex flex-col gap-4">
                            <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wider pl-2">
                                {t.quickPlay}
                            </h3>

                            <button
                                onClick={onStartPractice}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                            >
                                <div className="bg-blue-100 text-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                    <Keyboard className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700">{t.practiceTitle}</div>
                                    <div className="text-xs text-slate-400">{t.randomDrills}</div>
                                </div>
                            </button>

                            {/* Repair Mode (Drill) */}
                            <button
                                onClick={() => onStartDrill && onStartDrill()}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                            >
                                <div className="bg-rose-100 text-rose-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700">{lang === 'km' ? 'ជួសជុលចំណុចខ្សោយ' : 'Repair Mode'}</div>
                                    <div className="text-xs text-slate-400">{lang === 'km' ? 'ហ្វឹកហាត់លើអក្សរដែលខុស' : 'Drill your problem keys'}</div>
                                </div>
                            </button>

                            <div className="w-full h-0.5 bg-slate-100"></div>

                            <div className="space-y-1">
                                {CHALLENGES.slice(0, 3).map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => onStartChallenge(c)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left group"
                                    >
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-500 truncate">
                                            {lang === 'km' ? c.title_km : c.title}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${c.difficulty === 'easy'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-rose-100 text-rose-600'
                                            }`}>
                                            {c.difficulty === 'easy' ? t.easy : c.difficulty === 'hard' ? t.hard : t.medium}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User Profile Card */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-12 h-12 bg-slate-100 p-2 rounded-full text-slate-400" />
                                <div>
                                    <div className="font-bold text-lg text-slate-700">{t.guest}</div>
                                    <div className="text-xs text-slate-400">{t.level} {Math.floor(userXP / 1000) + 1}</div>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-yellow-400 h-full rounded-full"
                                    style={{ width: `${(userXP % 1000) / 10}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold">
                                <span>{userXP % 1000} {t.xp}</span>
                                <span>1000 {t.xp}</span>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: The Roadmap */}
                    <div className="flex-grow max-w-lg w-full pb-10">
                        <LevelRoadmap
                            currentLevel={currentLevel}
                            lang={lang}
                            onSelectLevel={onSelectLevel}
                        />
                    </div>

                    {/* Right Column: Leaderboard / Status */}
                    <div className="hidden xl:flex flex-col gap-6 w-72 shrink-0 sticky top-6 h-fit">
                        <div className="bg-white rounded-2xl border-2 border-slate-100 p-4 shadow-sm">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" /> {t.topPerformers}
                            </h3>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${i === 1 ? 'bg-yellow-100 text-yellow-600' :
                                            i === 2 ? 'bg-slate-100 text-slate-500' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {i}
                                        </div>
                                        <div className="flex-grow font-medium text-slate-600">{t.player} {i}</div>
                                        <div className="font-bold text-slate-800">{100 - i * 5} {t.wpm}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About KOOMPI Card */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                    {lang === 'km' ? 'អំពីយើង' : 'About'}
                                </h3>
                                <p className={`text-sm text-blue-100 mb-3 leading-relaxed ${lang === 'km' ? 'font-khmer' : ''}`}>
                                    {lang === 'km'
                                        ? 'បង្កើតឡើងដោយក្រុមការងារ KOOMPI ដើម្បីផ្តល់ជូនសិស្សានុសិស្សនូវឧបករណ៍សិក្សាទំនើប។'
                                        : 'Built by the KOOMPI Team. Empowering students with tools for the future.'
                                    }
                                </p>
                                <a
                                    href="https://koompi.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center py-2 bg-white/10 hover:bg-white/20 border border-white/20 font-bold rounded-xl text-sm transition-colors"
                                >
                                    {lang === 'km' ? 'ស្វែងយល់បន្ថែម' : 'Learn More'}
                                </a>
                            </div>
                            <div className="absolute -bottom-6 -right-6 text-white opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <Trophy className="w-32 h-32" />
                            </div>
                        </div>
                    </div>
                </div>

                <KoompiFooter t={t} lang={lang} />
            </div>
        </div>
    );
};
