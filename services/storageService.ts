import { LeaderboardEntry, Language } from "../types";

const STORAGE_KEY = 'typemaster_leaderboard_v1';
const LEVEL_KEY_PREFIX = 'typemaster_level_v1_';
const XP_KEY = 'typemaster_xp';
const STREAK_KEY = 'typemaster_streak';
const LAST_PLAYED_KEY = 'typemaster_last_played';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveScore = (challengeId: string, wpm: number, accuracy: number) => {
  const entries = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    id: Date.now().toString(),
    challengeId,
    wpm,
    accuracy,
    date: Date.now()
  };

  // Keep top 100 global
  const updated = [...entries, newEntry].sort((a, b) => b.wpm - a.wpm).slice(0, 100);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getChallengeScores = (challengeId: string): LeaderboardEntry[] => {
  return getLeaderboard()
    .filter(e => e.challengeId === challengeId)
    .sort((a, b) => b.wpm - a.wpm) // Sort by speed primarily
    .slice(0, 5); // Top 5
};

// --- Level Progression ---

// --- Level Progression ---

export const getLevelProgress = (lang: Language, level: number): { stars: number; unlocked: boolean; score: number } => {
  try {
    const raw = localStorage.getItem(`${LEVEL_KEY_PREFIX}${lang}_${level}`);
    if (raw) return JSON.parse(raw);

    // Default: Level 1 (or 0) is unlocked by default
    return {
      stars: 0,
      unlocked: level === 0 || level === 1,
      score: 0
    };
  } catch {
    return { stars: 0, unlocked: level === 1, score: 0 };
  }
};

export const saveLevelProgress = (lang: Language, level: number, stars: number, score: number) => {
  const current = getLevelProgress(lang, level);

  // Only update if better score or more stars
  if (stars > current.stars || (stars === current.stars && score > current.score)) {
    localStorage.setItem(`${LEVEL_KEY_PREFIX}${lang}_${level}`, JSON.stringify({
      stars,
      score,
      unlocked: true,
      completedAt: Date.now()
    }));
  }

  // Unlock next level if passed (>=1 star)
  if (stars >= 1) {
    const nextLevel = level + 1;
    const nextData = getLevelProgress(lang, nextLevel);
    if (!nextData.unlocked) {
      localStorage.setItem(`${LEVEL_KEY_PREFIX}${lang}_${nextLevel}`, JSON.stringify({
        ...nextData,
        unlocked: true
      }));
    }
  }
};

// Deprecated but kept for backward compatibility if needed
export const getUserLevel = (lang: Language): number => {
  // Find highest unlocked level
  let lvl = 1;
  while (getLevelProgress(lang, lvl).unlocked) {
    lvl++;
  }
  return lvl - 1;
};

export const saveUserLevel = (lang: Language, level: number) => {
  // No-op, managed by saveLevelProgress now
};

// --- Gamification (XP & Streak) ---

export const getUserXP = (): number => {
  try {
    return parseInt(localStorage.getItem(XP_KEY) || '0', 10);
  } catch { return 0; }
};

export const addXP = (amount: number): number => {
  const current = getUserXP();
  const next = current + Math.max(0, Math.floor(amount));
  localStorage.setItem(XP_KEY, next.toString());
  return next;
};

export const getStreak = (): number => {
  try {
    return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
  } catch { return 0; }
};

export const updateStreak = (): number => {
  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);

  // If playing again same day, just return current
  if (lastPlayed === today) {
    return getStreak();
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  let newStreak = 1;
  // If played yesterday, increment. Otherwise (missed a day or first time), reset to 1.
  if (lastPlayed === yesterdayStr) {
    newStreak = getStreak() + 1;
  }

  localStorage.setItem(STREAK_KEY, newStreak.toString());
  localStorage.setItem(LAST_PLAYED_KEY, today);
  return newStreak;
};
