import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Keyboard, Flame, Target, Sparkles } from 'lucide-react';
import { KoompiBird } from './KoompiBird';

interface OnboardingProps {
    lang: 'en' | 'km';
    onComplete: () => void;
}

const ONBOARDING_STEPS = {
    en: [
        {
            title: "Welcome to KOOMPI Typing!",
            subtitle: "Let's learn to type together",
            description: "Master Khmer and English typing through fun adventures. This quick tutorial will show you how everything works!",
            icon: 'bird',
        },
        {
            title: "Finger Placement",
            subtitle: "Home row is your home base",
            description: "Keep your fingers on the home row keys (ASDF for left hand, JKL; for right). The hand guides will show you which finger to use for each key.",
            icon: 'keyboard',
            interactive: 'homerow',
        },
        {
            title: "Build Your Combo",
            subtitle: "Type correctly to grow your flame",
            description: "Every correct keystroke builds your combo. Reach 10 for blue flames, 50 for rainbow! Watch the bird get excited as you type faster.",
            icon: 'flame',
        },
        {
            title: "Complete 150 Levels",
            subtitle: "Journey through beautiful biomes",
            description: "Progress from Sky Kingdom to Cosmic Void. Each level teaches new skills. Beat boss levels every 10 stages to unlock new worlds!",
            icon: 'target',
        },
        {
            title: "You're Ready!",
            subtitle: "Start your typing adventure",
            description: "Practice daily to build your streak. The more you play, the faster you'll type. Good luck, young typist!",
            icon: 'sparkles',
        },
    ],
    km: [
        {
            title: "សូមស្វាគមន៍មកកាន់ KOOMPI Typing!",
            subtitle: "តោះរៀនវាយអក្សរជាមួយគ្នា",
            description: "រៀនវាយអក្សរខ្មែរ និងអង់គ្លេស តាមរយៈការផ្សងព្រេងដ៏រីករាយ។ ការបង្រៀនខ្លីនេះនឹងបង្ហាញអ្នកពីរបៀបដែលអ្វីៗដំណើរការ!",
            icon: 'bird',
        },
        {
            title: "ការដាក់ម្រាមដៃ",
            subtitle: "ជួរ Home គឺជាមូលដ្ឋានរបស់អ្នក",
            description: "រក្សាម្រាមដៃរបស់អ្នកនៅលើគ្រាប់ចុចជួរ Home (ASDF សម្រាប់ដៃឆ្វេង, JKL; សម្រាប់ដៃស្តាំ)។ មគ្គុទេសក៍ដៃនឹងបង្ហាញអ្នកថាម្រាមណាត្រូវប្រើសម្រាប់គ្រាប់ចុចនីមួយៗ។",
            icon: 'keyboard',
            interactive: 'homerow',
        },
        {
            title: "បង្កើត Combo របស់អ្នក",
            subtitle: "វាយត្រឹមត្រូវដើម្បីបង្កើនភ្លើង",
            description: "រាល់ការចុចគ្រាប់ចុចត្រឹមត្រូវនឹងបង្កើន combo។ ឈានដល់ ១០ សម្រាប់ភ្លើងខៀវ, ៥០ សម្រាប់ភ្លើងឥន្ទធនូ! មើលសត្វរីករាយពេលអ្នកវាយលឿនជាងមុន។",
            icon: 'flame',
        },
        {
            title: "បញ្ចប់ 150 កម្រិត",
            subtitle: "ធ្វើដំណើរកាត់ Biomes ស្រស់ស្អាត",
            description: "រីកចម្រើនពី Sky Kingdom ដល់ Cosmic Void។ កម្រិតនីមួយៗបង្រៀនជំនាញថ្មី។ ឈ្នះកម្រិត Boss រៀងរាល់ ១០ ដំណាក់កាលដើម្បីដោះសោពិភពថ្មី!",
            icon: 'target',
        },
        {
            title: "អ្នករួចរាល់ហើយ!",
            subtitle: "ចាប់ផ្តើមការផ្សងព្រេងវាយអក្សរ",
            description: "អនុវត្តប្រចាំថ្ងៃដើម្បីបង្កើន Streak។ កាលអ្នកលេងច្រើន អ្នកនឹងវាយលឿនជាងមុន។ សូមសំណាងល្អ អ្នកវាយអក្សរវ័យក្មេង!",
            icon: 'sparkles',
        },
    ],
};

const HomeRowDemo: React.FC<{ lang: 'en' | 'km' }> = ({ lang }) => {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const homeKeys = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];
    const fingerColors = {
        'A': 'bg-rose-400',
        'S': 'bg-orange-400',
        'D': 'bg-amber-400',
        'F': 'bg-emerald-400',
        'J': 'bg-emerald-400',
        'K': 'bg-amber-400',
        'L': 'bg-orange-400',
        ';': 'bg-rose-400',
    };

    useEffect(() => {
        let idx = 0;
        const interval = setInterval(() => {
            setActiveKey(homeKeys[idx]);
            idx = (idx + 1) % homeKeys.length;
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-1 justify-center mt-4">
            {homeKeys.map((key) => (
                <div
                    key={key}
                    className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg
                        transition-all duration-200
                        ${activeKey === key
                            ? `${fingerColors[key as keyof typeof fingerColors]} text-white scale-110 shadow-lg`
                            : 'bg-slate-200 text-slate-600'
                        }
                    `}
                >
                    {key}
                </div>
            ))}
        </div>
    );
};

export const Onboarding: React.FC<OnboardingProps> = ({ lang, onComplete }) => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const steps = ONBOARDING_STEPS[lang];
    const currentStep = steps[step];

    const goNext = useCallback(() => {
        if (step >= steps.length - 1) {
            onComplete();
            return;
        }
        setIsAnimating(true);
        setTimeout(() => {
            setStep((s) => s + 1);
            setIsAnimating(false);
        }, 200);
    }, [step, steps.length, onComplete]);

    const goPrev = useCallback(() => {
        if (step === 0) return;
        setIsAnimating(true);
        setTimeout(() => {
            setStep((s) => s - 1);
            setIsAnimating(false);
        }, 200);
    }, [step]);

    const getIcon = () => {
        switch (currentStep.icon) {
            case 'bird':
                return (
                    <div className="scale-150 mb-2">
                        <KoompiBird
                            wpm={0}
                            isTyping={false}
                            isFinished={false}
                            lastTypedTime={Date.now()}
                            combo={0}
                        />
                    </div>
                );
            case 'keyboard':
                return <Keyboard className="w-16 h-16 text-blue-500" strokeWidth={1.5} />;
            case 'flame':
                return <Flame className="w-16 h-16 text-orange-500 fill-orange-400" strokeWidth={1.5} />;
            case 'target':
                return <Target className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />;
            case 'sparkles':
                return <Sparkles className="w-16 h-16 text-purple-500" strokeWidth={1.5} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-gradient-to-br from-sky-100 via-white to-amber-50 flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-emerald-200/30 rounded-full blur-2xl" />
            </div>

            {/* Main Content */}
            <div className="relative max-w-lg w-full">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`
                                w-3 h-3 rounded-full transition-all duration-300
                                ${i === step ? 'bg-blue-500 scale-125' : i < step ? 'bg-blue-300' : 'bg-slate-300'}
                            `}
                        />
                    ))}
                </div>

                {/* Card */}
                <div
                    className={`
                        bg-white rounded-3xl p-8 shadow-2xl border border-white/50
                        transform transition-all duration-200
                        ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}
                    `}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {getIcon()}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-2 font-khmer">
                        {currentStep.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-blue-600 text-center font-medium mb-4 font-khmer">
                        {currentStep.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 text-center mb-6 leading-relaxed font-khmer">
                        {currentStep.description}
                    </p>

                    {/* Interactive Demo */}
                    {currentStep.interactive === 'homerow' && <HomeRowDemo lang={lang} />}

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={goPrev}
                            disabled={step === 0}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all font-khmer
                                ${step === 0
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }
                            `}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            {lang === 'km' ? 'ថយក្រោយ' : 'Back'}
                        </button>

                        <button
                            onClick={goNext}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all font-khmer"
                        >
                            {step === steps.length - 1
                                ? (lang === 'km' ? 'ចាប់ផ្តើម!' : "Let's Go!")
                                : (lang === 'km' ? 'បន្ទាប់' : 'Next')
                            }
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Skip Button */}
                <button
                    onClick={onComplete}
                    className="w-full mt-4 text-slate-400 hover:text-slate-600 text-sm transition-colors font-khmer"
                >
                    {lang === 'km' ? 'រំលង' : 'Skip tutorial'}
                </button>
            </div>
        </div>
    );
};
