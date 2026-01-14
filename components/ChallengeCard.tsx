import React from 'react';
import { Challenge, Language } from '../types';
import { Trophy, Timer, Target, Zap } from 'lucide-react';
import { getChallengeScores } from '../services/storageService';

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (c: Challenge) => void;
  lang: Language;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onSelect, lang }) => {
  const topScore = getChallengeScores(challenge.id)[0];
  const isKm = lang === 'km';

  const getIcon = () => {
    switch(challenge.type) {
      case 'speed': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'accuracy': return <Target className="w-5 h-5 text-rose-500" />;
      case 'endurance': return <Timer className="w-5 h-5 text-blue-500" />;
    }
  };

  const difficultyColor = {
    easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    hard: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  const title = (isKm && challenge.title_km) ? challenge.title_km : challenge.title;
  const description = (isKm && challenge.description_km) ? challenge.description_km : challenge.description;

  return (
    <div 
      onClick={() => onSelect(challenge)}
      className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-3xl cursor-pointer hover:bg-white/80 hover:shadow-xl hover:scale-[1.02] transition-all group flex flex-col gap-4 relative overflow-hidden shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
      </div>

      <div>
        <h3 className={`text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors ${isKm ? 'font-khmer' : ''}`}>
          {title}
        </h3>
        <p className={`text-sm text-slate-600 mt-2 leading-relaxed ${isKm ? 'font-khmer' : ''}`}>{description}</p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200/50 flex flex-col gap-2 text-xs font-mono text-slate-500">
         {challenge.criteria.minWpm && <div>{isKm ? 'ល្បឿនអប្បបរមា' : 'Min Speed'}: <span className="text-slate-700 font-bold">{challenge.criteria.minWpm} WPM</span></div>}
         {challenge.criteria.minAccuracy && <div>{isKm ? 'ភាពត្រឹមត្រូវ' : 'Min Acc'}: <span className="text-slate-700 font-bold">{challenge.criteria.minAccuracy}%</span></div>}
         {challenge.criteria.timeLimitSeconds && <div>{isKm ? 'ពេលវេលា' : 'Time Limit'}: <span className="text-slate-700 font-bold">{challenge.criteria.timeLimitSeconds}s</span></div>}
      </div>

      {topScore && (
        <div className="absolute top-0 right-0 p-3 opacity-80">
           <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
             <Trophy className="w-3 h-3" />
             <span>{topScore.wpm} WPM</span>
           </div>
        </div>
      )}
    </div>
  );
};