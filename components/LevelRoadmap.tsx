import React, { useEffect } from 'react';
import { LEVEL_METADATA } from '../utils/levels';
import { Language } from '../types';
import { Lock, Star, Play, Crown, Trophy, Keyboard, BookOpen, Plane, Coffee, Users, Clock, Briefcase, Leaf, Heart, Smile, Palette, Microscope, Scroll } from 'lucide-react';
import { getLevelProgress } from '../services/storageService';

interface LevelRoadmapProps {
  currentLevel: number;
  lang: Language;
  onSelectLevel: (level: number) => void;
}

// Map strings to icons
const ICON_MAP: Record<string, any> = {
  Keyboard, BookOpen, Trophy, Plane, Coffee, Users, Clock, Briefcase, Leaf, Heart, Smile, Palette, Microscope, Scroll
};

// Define 15 Units with Rainbow Colors
const UNITS = [
  { id: 1, title_en: "Keyboard Basics", title_km: "មូលដ្ឋានគ្រឹះក្ដារចុច", desc_en: "Home Row & Fingers", desc_km: "ជួរកណ្ដាល និងម្រាមដៃ", range: [0, 9], color: "bg-rose-500", borderColor: "border-rose-600", icon: "Keyboard" },
  { id: 2, title_en: "First Words", title_km: "ពាក្យដំបូង", desc_en: "Simple Vocabulary", desc_km: "វាក្យសព្ទសាមញ្ញ", range: [10, 19], color: "bg-orange-500", borderColor: "border-orange-600", icon: "BookOpen" },
  { id: 3, title_en: "Sentences", title_km: "ប្រយោគ", desc_en: "Basic Grammar", desc_km: "វេយ្យាករណ៍មូលដ្ឋាន", range: [20, 29], color: "bg-amber-500", borderColor: "border-amber-600", icon: "Trophy" },
  { id: 4, title_en: "Common Phrases", title_km: "ឃ្លាប្រើប្រាស់ញឹកញាប់", desc_en: "Daily Conversation", desc_km: "ការសន្ទនាប្រចាំថ្ងៃ", range: [30, 39], color: "bg-yellow-500", borderColor: "border-yellow-600", icon: "Smile" },
  { id: 5, title_en: "Food & Drink", title_km: "អាហារ និងភេសជ្ជៈ", desc_en: "Yummy Typing", desc_km: "ការវាយអក្សរឆ្ងាញ់ៗ", range: [40, 49], color: "bg-lime-500", borderColor: "border-lime-600", icon: "Coffee" },
  { id: 6, title_en: "Travel", title_km: "ការធ្វើដំណើរ", desc_en: "Places & Transport", desc_km: "ទីកន្លែង និងការដឹកជញ្ជូន", range: [50, 59], color: "bg-green-500", borderColor: "border-green-600", icon: "Plane" },
  { id: 7, title_en: "Family & People", title_km: "គ្រួសារ និងមនុស្ស", desc_en: "Relationships", desc_km: "ទំនាក់ទំនង", range: [60, 69], color: "bg-emerald-500", borderColor: "border-emerald-600", icon: "Users" },
  { id: 8, title_en: "Time & Numbers", title_km: "ពេលវេលា និងលេខ", desc_en: "Counting & Schedules", desc_km: "ការរាប់ និងកាលវិភាគ", range: [70, 79], color: "bg-teal-500", borderColor: "border-teal-600", icon: "Clock" },
  { id: 9, title_en: "Work & School", title_km: "ការងារ និងសាលារៀន", desc_en: "Professional Skills", desc_km: "ជំនាញវិជ្ជាជីវៈ", range: [80, 89], color: "bg-cyan-500", borderColor: "border-cyan-600", icon: "Briefcase" },
  { id: 10, title_en: "Nature", title_km: "ធម្មជាតិ", desc_en: "Environment", desc_km: "បរិស្ថាន", range: [90, 99], color: "bg-sky-500", borderColor: "border-sky-600", icon: "Leaf" },
  { id: 11, title_en: "Health", title_km: "សុខភាព", desc_en: "Body & Mind", desc_km: "រាងកាយ និងចិត្ត", range: [100, 109], color: "bg-blue-500", borderColor: "border-blue-600", icon: "Heart" },
  { id: 12, title_en: "Emotions", title_km: "អារម្មណ៍", desc_en: "Feelings", desc_km: "ការបញ្ចេញអារម្មណ៍", range: [110, 119], color: "bg-indigo-500", borderColor: "border-indigo-600", icon: "Smile" },
  { id: 13, title_en: "Culture & Arts", title_km: "វប្បធម៌ និងសិល្បៈ", desc_en: "Traditions", desc_km: "ប្រពៃណី", range: [120, 129], color: "bg-violet-500", borderColor: "border-violet-600", icon: "Palette" },
  { id: 14, title_en: "Science", title_km: "វិទ្យាសាស្ត្រ", desc_en: "Discovery", desc_km: "ការរកឃើញ", range: [130, 139], color: "bg-purple-500", borderColor: "border-purple-600", icon: "Microscope" },
  { id: 15, title_en: "History", title_km: "ប្រវត្តិសាស្ត្រ", desc_en: "Past Events", desc_km: "ព្រឹត្តិការណ៍អតីតកាល", range: [140, 149], color: "bg-fuchsia-500", borderColor: "border-fuchsia-600", icon: "Scroll" },
];

const ROW_HEIGHT = 110; // Vertical spacing
const X_AMPLITUDE = 80; // Horizontal sway

export const LevelRoadmap: React.FC<LevelRoadmapProps> = ({ currentLevel, lang, onSelectLevel }) => {

  // Auto-scroll to current level
  useEffect(() => {
    const timer = setTimeout(() => {
      // If unlocked up to 50, scroll to 50 or currentLevel, whichever is relevant
      // Default to currentLevel
      const element = document.getElementById(`level-btn-${currentLevel}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300); // Slight delay to allow layout to settle
    return () => clearTimeout(timer);
  }, [currentLevel]);

  return (
    <div className="w-full max-w-lg mx-auto pb-32">
      {UNITS.map((unit) => {
        // Levels in this unit
        const unitLevels = Array.from({ length: 10 }, (_, i) => unit.range[0] + i);
        // FORCE UNLOCK for Levels 0-50
        const isUnitLocked = unitLevels[0] > 50 && unitLevels[0] > currentLevel;

        // Calculate SVG path points
        const points = unitLevels.map((_, i) => {
          const y = (i + 1) * ROW_HEIGHT;
          // Sine wave: Center -> Left -> Center -> Right
          const x = Math.sin(i * 0.6) * X_AMPLITUDE;
          return { x, y };
        });

        const UnitIcon = ICON_MAP[unit.icon] || Star;

        return (
          <div key={unit.id} className="mb-8 relative">
            {/* Unit Header */}
            <div className={`sticky top-4 z-20 mb-12 rounded-2xl p-4 text-white shadow-lg border-b-4 transform transition-transform hover:scale-[1.01] ${unit.color} ${unit.borderColor} flex justify-between items-center ${isUnitLocked ? 'opacity-70' : ''}`}>
              <div>
                <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">
                  {lang === 'km' ? `មេរៀនទី ${unit.id}` : `Unit ${unit.id}`}
                </div>
                <h3 className={`text-xl font-bold uppercase tracking-wide ${lang === 'km' ? 'font-khmer' : ''}`}>
                  {lang === 'km' ? unit.title_km : unit.title_en}
                </h3>
                <p className={`text-white/90 text-sm font-medium ${lang === 'km' ? 'font-khmer' : ''}`}>
                  {lang === 'km' ? unit.desc_km : unit.desc_en}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <UnitIcon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Path Container */}
            <div className="relative flex flex-col items-center">

              {/* SVG Connector Path - Simple vertical dashed line */}
              <svg
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                width="200"
                height={unitLevels.length * ROW_HEIGHT + 50}
                style={{ overflow: 'visible' }}
              >
                <path
                  d={`M 100 0 ${points.map((p) => `L ${100 + p.x} ${p.y}`).join(' ')}`}
                  fill="none"
                  stroke={isUnitLocked ? "#e2e8f0" : "#cbd5e1"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="20 20"
                  className="opacity-50"
                />
              </svg>

              {/* Levels */}
              {unitLevels.map((levelId, i) => {
                // Fetch real progress data
                const progress = getLevelProgress(lang, levelId);
                const isLocked = !progress.unlocked;
                const isCompleted = progress.stars > 0;
                const isCurrent = !isLocked && !isCompleted; // Or logic based on lastPlayed

                // Override for strict sequential (if needed) or just trust storage
                // const isLocked = levelId > currentLevel; 

                const isBoss = (i === 9); // Last level of unit is boss

                const pos = points[i];

                let btnColor = isLocked
                  ? "bg-slate-200 border-slate-300 text-slate-400"
                  : isCompleted
                    ? `${unit.color} ${unit.borderColor} text-white`
                    : `${unit.color} ${unit.borderColor} text-white`;

                if (levelId === currentLevel && !isLocked) {
                  // Highlight current level specifically
                  btnColor = `${unit.color} ${unit.borderColor.replace('border', 'border-b-8')} text-white shadow-xl ring-4 ring-white scale-110`;
                } else if (!isLocked) {
                  btnColor = `${unit.color} ${unit.borderColor} text-white opacity-90`;
                }

                // Correct border for locked/unlocked
                if (levelId !== currentLevel) {
                  btnColor += isLocked ? " border-b-4" : " border-b-4 hover:-translate-y-1 hover:brightness-110";
                }

                const iconSize = isBoss ? "w-8 h-8" : "w-6 h-6";
                const btnSize = isBoss ? "w-24 h-24" : "w-20 h-20";

                return (
                  <div
                    key={levelId}
                    className="absolute flex flex-col items-center z-10"
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                  >
                    <button
                      id={`level-btn-${levelId}`}
                      onClick={() => !isLocked && onSelectLevel(levelId)}
                      disabled={isLocked}
                      className={`
                        ${btnSize} rounded-3xl flex items-center justify-center
                        transition-all duration-300 ease-out shadow-lg
                        ${btnColor}
                      `}
                    >
                      {isLocked ? (
                        <Lock className="w-8 h-8 opacity-50" />
                      ) : isCompleted ? (
                        <span className="font-bold text-3xl">{levelId}</span>
                      ) : (
                        <div className="flex flex-col items-center animate-bounce-slow">
                          <span className="font-bold text-3xl">{levelId}</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Start</span>
                        </div>
                      )}
                    </button>

                    {/* STARS Display */}
                    {!isLocked && (
                      <div className="flex gap-1 mt-2 p-1 bg-white/40 rounded-full backdrop-blur-sm shadow-sm scale-90">
                        {[1, 2, 3].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= progress.stars ? 'fill-yellow-400 text-yellow-500' : 'fill-slate-300 text-slate-400'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Height Spacer */}
              <div style={{ height: (unitLevels.length + 1) * ROW_HEIGHT }}></div>
            </div >
          </div >
        );
      })}

      <div className="flex flex-col items-center justify-center mt-4 opacity-50 pb-20">
        <Crown className="w-24 h-24 text-slate-300" />
        <p className="mt-2 text-slate-400 font-bold">More coming soon!</p>
      </div>
    </div >
  );
};