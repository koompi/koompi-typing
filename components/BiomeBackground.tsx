import React from 'react';
import { BiomeType, BIOMES } from '../utils/biomes';
import { Star, Cloud, Sparkles, TreePine, Moon, Sun, Hexagon, Feather } from 'lucide-react';

interface BiomeBackgroundProps {
    biome: BiomeType;
    children?: React.ReactNode;
}

export const BiomeBackground: React.FC<BiomeBackgroundProps> = ({ biome, children }) => {
    const config = BIOMES[biome];

    // Render different decorative elements based on biome
    const renderDecorations = () => {
        switch (biome) {
            case 'sky':
                return (
                    <>
                        <div className="absolute top-[6%] right-[8%] w-16 h-16 animate-float-slow">
                            <div className="absolute inset-0 bg-amber-300 rounded-full shadow-lg shadow-amber-200/60"></div>
                            <div className="absolute inset-[-30%] bg-amber-200/20 rounded-full animate-pulse"></div>
                        </div>
                        <Cloud className="absolute top-[15%] left-[10%] w-24 h-24 text-white/40 animate-drift-slow" />
                        <Cloud className="absolute top-[40%] right-[15%] w-32 h-32 text-white/30 animate-drift" style={{ animationDelay: '2s' }} />
                        <Cloud className="absolute bottom-[20%] left-[20%] w-20 h-20 text-white/40 animate-drift-slow" style={{ animationDelay: '5s' }} />
                    </>
                );
            case 'sunset':
                return (
                    <>
                        <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"></div>
                        <Sun className="absolute bottom-[30%] right-[10%] w-32 h-32 text-orange-400/20 animate-pulse" />
                        <Cloud className="absolute top-[20%] left-[10%] w-24 h-24 text-rose-100/30 animate-drift" />
                        <Cloud className="absolute top-[10%] right-[20%] w-32 h-32 text-orange-100/30 animate-drift-slow" style={{ animationDelay: '3s' }} />
                    </>
                );
            case 'modern':
                return (
                    <>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                        <Hexagon className="absolute top-[10%] left-[5%] w-24 h-24 text-slate-300/30 animate-float-slow rotate-12" />
                        <Hexagon className="absolute bottom-[10%] right-[5%] w-32 h-32 text-slate-300/30 animate-float rotate-[-12deg]" />
                        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-200/50 rounded-full animate-spin-slow opacity-20"></div>
                    </>
                );
            case 'forest':
                return (
                    <>
                        {/* Fireflies */}
                        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-yellow-200 rounded-full animate-ping opacity-60"></div>
                        <div className="absolute bottom-[40%] right-[30%] w-2 h-2 bg-yellow-200 rounded-full animate-ping opacity-50" style={{ animationDelay: '1.5s' }}></div>

                        <TreePine className="absolute bottom-0 left-[5%] w-48 h-48 text-emerald-800/5" />
                        <TreePine className="absolute bottom-0 right-[10%] w-64 h-64 text-emerald-800/5" />
                        <TreePine className="absolute bottom-0 left-[25%] w-32 h-32 text-emerald-800/10" />
                    </>
                );
            case 'space':
                return (
                    <>
                        <div className="absolute top-[10%] right-[10%] w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                        <Moon className="absolute top-[15%] right-[12%] w-16 h-16 text-indigo-200/80 animate-float" />
                        <Star className="absolute top-[20%] left-[15%] w-4 h-4 text-white animate-twinkle" />
                        <Star className="absolute bottom-[30%] right-[20%] w-6 h-6 text-white animate-twinkle" style={{ animationDelay: '1s' }} />
                        <Star className="absolute top-[40%] left-[40%] w-3 h-3 text-white animate-twinkle" style={{ animationDelay: '2s' }} />
                        {/* CSS-based Star Noise */}
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px', backgroundPosition: '15px 15px' }}></div>
                    </>
                );
            case 'paper':
                return (
                    <>
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM32 63c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm57-13c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
                        <Feather className="absolute top-[10%] right-[10%] w-32 h-32 text-amber-900/10 rotate-45 animate-float" />
                        <div className="absolute bottom-[10%] left-[10%] w-64 h-1 bg-amber-900/10 rounded-full transform rotate-3"></div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-0 transition-colors duration-1000 ${config.gradient}`}>
            {/* Base Biome Decorations */}
            {renderDecorations()}

            {/* Optional children (e.g. content overlay) */}
            {children}

            {/* Noise overlay for texture (optional) */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-white"></div>
        </div>
    );
};
