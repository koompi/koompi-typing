import React, { useEffect, useState } from 'react';
import { Crown, Trophy, Star, Sparkles, Rocket, Medal } from 'lucide-react';

interface MilestoneCelebrationProps {
    level: number;
    lang: 'en' | 'km';
    onClose: () => void;
}

const MILESTONES: Record<number, {
    title: { en: string; km: string };
    subtitle: { en: string; km: string };
    icon: 'crown' | 'trophy' | 'rocket' | 'medal';
    gradient: string;
    particles: string;
}> = {
    10: {
        title: { en: 'First Boss Defeated!', km: 'ឈ្នះបារី​ដំបូង!' },
        subtitle: { en: 'You completed Unit 1!', km: 'អ្នកបានបញ្ចប់វគ្គ ១!' },
        icon: 'trophy',
        gradient: 'from-amber-400 to-orange-500',
        particles: 'amber',
    },
    50: {
        title: { en: 'Halfway Hero!', km: 'វីរបុរសពាក់កណ្តាល!' },
        subtitle: { en: '50 levels mastered!', km: 'បានបញ្ចប់ 50 កម្រិត!' },
        icon: 'medal',
        gradient: 'from-emerald-400 to-teal-500',
        particles: 'emerald',
    },
    100: {
        title: { en: 'Century Champion!', km: 'ជើងឯក ១០០!' },
        subtitle: { en: '100 levels conquered!', km: 'បានបញ្ចប់ 100 កម្រិត!' },
        icon: 'crown',
        gradient: 'from-purple-400 to-indigo-500',
        particles: 'purple',
    },
    150: {
        title: { en: 'TYPING MASTER!', km: 'មេស្ដេចវាយអក្សរ!' },
        subtitle: { en: 'All 150 levels completed!', km: 'បានបញ្ចប់ 150 កម្រិតទាំងអស់!' },
        icon: 'rocket',
        gradient: 'from-rose-400 via-pink-500 to-purple-500',
        particles: 'rainbow',
    },
};

const ConfettiParticle: React.FC<{ color: string; delay: number; x: number }> = ({ color, delay, x }) => (
    <div
        className={`absolute w-3 h-3 ${color} rounded-sm animate-confetti`}
        style={{
            left: `${x}%`,
            animationDelay: `${delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
        }}
    />
);

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
    level,
    lang,
    onClose,
}) => {
    const [showContent, setShowContent] = useState(false);
    const milestone = MILESTONES[level];

    useEffect(() => {
        // Stagger reveal
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, []);

    if (!milestone) return null;

    const IconComponent = {
        crown: Crown,
        trophy: Trophy,
        rocket: Rocket,
        medal: Medal,
    }[milestone.icon];

    const particleColors = {
        amber: ['bg-amber-300', 'bg-yellow-400', 'bg-orange-300'],
        emerald: ['bg-emerald-300', 'bg-teal-400', 'bg-green-300'],
        purple: ['bg-purple-300', 'bg-indigo-400', 'bg-violet-300'],
        rainbow: ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'],
    }[milestone.particles];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                    <ConfettiParticle
                        key={i}
                        color={particleColors[i % particleColors.length]}
                        delay={Math.random() * 2}
                        x={Math.random() * 100}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div
                className={`relative bg-white rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg w-full mx-4 flex flex-col items-center transform transition-all duration-500 ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${milestone.gradient} opacity-10 rounded-3xl`} />

                {/* Icon */}
                <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${milestone.gradient} blur-[60px] opacity-50 animate-pulse`} />
                    <div className={`relative bg-gradient-to-br ${milestone.gradient} p-6 rounded-full shadow-xl`}>
                        <IconComponent className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg" strokeWidth={1.5} />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
                    <Star className="absolute -bottom-1 -left-3 w-6 h-6 text-yellow-400 animate-pulse fill-yellow-400" />
                </div>

                {/* Title */}
                <h1 className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${milestone.gradient} text-center mb-2 font-khmer`}>
                    {milestone.title[lang]}
                </h1>

                {/* Subtitle */}
                <p className="text-slate-600 text-lg md:text-xl text-center mb-6 font-khmer">
                    {milestone.subtitle[lang]}
                </p>

                {/* Level Badge */}
                <div className={`bg-gradient-to-r ${milestone.gradient} text-white text-2xl md:text-3xl font-black px-8 py-3 rounded-full shadow-lg mb-8`}>
                    Level {level}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`px-8 py-4 bg-gradient-to-r ${milestone.gradient} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-khmer`}
                >
                    {lang === 'km' ? 'បន្តដំណើរ' : 'Continue Journey'}
                </button>
            </div>
        </div>
    );
};
