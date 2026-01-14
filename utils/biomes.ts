import { LevelIconType } from "./levels";

export type BiomeType = 'sky' | 'sunset' | 'modern' | 'forest' | 'space' | 'paper';

export interface BiomeConfig {
    id: BiomeType;
    name: string;
    gradient: string;
    particleColor: string;
    textColor: string;
    accentColor: string;
}

export const BIOMES: Record<BiomeType, BiomeConfig> = {
    sky: {
        id: 'sky',
        name: 'Sky Kingdom',
        gradient: 'bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200',
        particleColor: 'text-white',
        textColor: 'text-slate-700',
        accentColor: 'text-blue-600'
    },
    sunset: {
        id: 'sunset',
        name: 'Golden Horizon',
        gradient: 'bg-gradient-to-b from-orange-300 via-amber-200 to-rose-200',
        particleColor: 'text-amber-100',
        textColor: 'text-rose-900',
        accentColor: 'text-orange-600'
    },
    modern: {
        id: 'modern',
        name: 'Tech City',
        gradient: 'bg-gradient-to-b from-slate-200 via-gray-100 to-slate-200',
        particleColor: 'text-slate-400',
        textColor: 'text-slate-800',
        accentColor: 'text-indigo-600'
    },
    forest: {
        id: 'forest',
        name: 'Emerald Woods',
        gradient: 'bg-gradient-to-b from-emerald-300 via-green-200 to-teal-200',
        particleColor: 'text-emerald-100',
        textColor: 'text-emerald-900',
        accentColor: 'text-green-700'
    },
    space: {
        id: 'space',
        name: 'Cosmic Void',
        gradient: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900',
        particleColor: 'text-purple-200',
        textColor: 'text-white',
        accentColor: 'text-purple-400'
    },
    paper: {
        id: 'paper',
        name: 'Ancient Scrolls',
        gradient: 'bg-[#fdf6e3]', // Solarized light style solid for paper texture feel
        particleColor: 'text-amber-800/20',
        textColor: 'text-amber-900',
        accentColor: 'text-amber-700'
    }
};

export const getBiomeForLevel = (level: number): BiomeType => {
    // 150 levels total
    // 0-40: Sky (Basics)
    if (level <= 40) return 'sky';
    // 41-60: Sunset (Travel)
    if (level <= 60) return 'sunset';
    // 61-90: Modern (Work, Family)
    if (level <= 90) return 'modern';
    // 91-120: Forest (Nature, Health)
    if (level <= 120) return 'forest';
    // 121-140: Space (Science)
    if (level <= 140) return 'space';
    // 141+: Paper (History)
    return 'paper';
};
