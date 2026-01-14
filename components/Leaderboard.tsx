import React from 'react';
import { Challenge, Language } from '../types';
import { getChallengeScores } from '../services/storageService';
import { Trophy } from 'lucide-react';

export const Leaderboard: React.FC<{ challenge: Challenge, lang: Language }> = ({ challenge, lang }) => {
  const scores = getChallengeScores(challenge.id);
  const isKm = lang === 'km';
  const title = (isKm && challenge.title_km) ? challenge.title_km : challenge.title;

  if (scores.length === 0) return null;

  return (
    <div className="w-full bg-white/40 border border-white/50 rounded-2xl p-4 mt-6 backdrop-blur-sm">
      <h4 className={`text-slate-600 text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isKm ? 'font-khmer' : ''}`}>
        <Trophy className="w-4 h-4 text-amber-500" />
        {isKm ? 'តារាងពិន្ទុ' : 'Leaderboard'}: {title}
      </h4>
      <div className="flex flex-col gap-2">
        {scores.map((score, idx) => (
          <div key={score.id} className="flex items-center justify-between text-sm p-3 bg-white/70 rounded-xl border border-white/50 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold w-6 text-center ${idx === 0 ? 'text-amber-500 text-lg' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-orange-700' : 'text-slate-400'}`}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
              </span>
              <span className="text-slate-600 font-medium">{new Date(score.date).toLocaleDateString()}</span>
            </div>
            <div className="font-mono text-slate-800 font-bold">
              {score.wpm} WPM <span className="text-slate-400 mx-1 font-normal">/</span> <span className="text-emerald-600">{score.accuracy}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};