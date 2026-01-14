import React from 'react';
import { X, Volume2, Music, Hand, RotateCcw, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'en' | 'km';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, lang }) => {
    const { settings, updateSetting, resetSettings } = useSettings();

    if (!isOpen) return null;

    const t = {
        title: lang === 'km' ? 'ការកំណត់' : 'Settings',
        autoRead: lang === 'km' ? 'អានដោយស្វ័យប្រវត្តិ' : 'Auto-read text',
        autoReadDesc: lang === 'km' ? 'អានអត្ថបទដោយស្វ័យប្រវត្តិពេលចាប់ផ្តើមកម្រិតថ្មី' : 'Automatically read text when starting a new level',
        soundEffects: lang === 'km' ? 'សំឡេងបែបផែន' : 'Sound effects',
        soundEffectsDesc: lang === 'km' ? 'បើក/បិទសំឡេងនៅពេលវាយ' : 'Play sounds when typing',
        backgroundMusic: lang === 'km' ? 'តន្ត្រីផ្ទៃខាងក្រោយ' : 'Background Music',
        backgroundMusicDesc: lang === 'km' ? 'តន្ត្រីបរិយាកាស និងការប្រយុទ្ធ' : 'Ambient & Boss battle music',
        fingerGuide: lang === 'km' ? 'ការណែនាំម្រាមដៃ' : 'Finger guide',
        fingerGuideDesc: lang === 'km' ? 'បង្ហាញរូបដៃជាមួយម្រាមដែលត្រូវប្រើ' : 'Show hand diagram with active finger',
        reset: lang === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset',
        done: lang === 'km' ? 'រួចរាល់' : 'Done',
    };

    // Toggle component matching our design
    const Toggle = ({ checked, onChange, color }: { checked: boolean; onChange: (v: boolean) => void; color: string }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${checked ? color : 'bg-slate-200'
                }`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${checked ? 'left-7' : 'left-1'
                }`} />
        </button>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white via-white to-sky-50 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-white/80">

                {/* Header */}
                <div className="relative p-6 pb-4">
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-16 w-3 h-3 bg-amber-300 rounded-full animate-pulse opacity-60" />
                    <div className="absolute top-8 right-12 w-2 h-2 bg-sky-300 rounded-full animate-pulse opacity-50" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl shadow-lg shadow-sky-200/50">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 font-khmer">{t.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Settings List */}
                <div className="px-6 pb-4 space-y-3">
                    {/* Auto-read */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-sky-200 transition-colors">
                        <div className="p-2.5 bg-sky-100 rounded-xl text-sky-500">
                            <Volume2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-700 font-khmer">{t.autoRead}</div>
                            <p className="text-xs text-slate-400 mt-0.5 font-khmer truncate">{t.autoReadDesc}</p>
                        </div>
                        <Toggle
                            checked={settings.autoRead}
                            onChange={(v) => updateSetting('autoRead', v)}
                            color="bg-sky-500"
                        />
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                        <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-500">
                            <Music className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-700 font-khmer">{t.soundEffects}</div>
                            <p className="text-xs text-slate-400 mt-0.5 font-khmer truncate">{t.soundEffectsDesc}</p>
                        </div>
                        <Toggle
                            checked={settings.soundEffects}
                            onChange={(v) => updateSetting('soundEffects', v)}
                            color="bg-emerald-500"
                        />
                    </div>

                    {/* Finger Guide */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm hover:border-amber-200 transition-colors">
                        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-500">
                            <Hand className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-700 font-khmer">{t.fingerGuide}</div>
                            <p className="text-xs text-slate-400 mt-0.5 font-khmer truncate">{t.fingerGuideDesc}</p>
                        </div>
                        <Toggle
                            checked={settings.showFingerGuide}
                            onChange={(v) => updateSetting('showFingerGuide', v)}
                            color="bg-amber-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-2 flex gap-3">
                    <button
                        onClick={resetSettings}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-bold font-khmer"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t.reset}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl hover:from-sky-600 hover:to-blue-600 transition-all font-bold font-khmer shadow-lg shadow-sky-200/50 hover:shadow-sky-300/50"
                    >
                        {t.done}
                    </button>
                </div>
            </div>
        </div>
    );
};
