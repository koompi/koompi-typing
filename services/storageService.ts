import { LeaderboardEntry, Language } from "../types";

const STORAGE_KEY = 'typemaster_leaderboard_v1';
const LEVEL_KEY_PREFIX = 'typemaster_level_v1_';
const XP_KEY = 'typemaster_xp';
const STREAK_KEY = 'typemaster_streak';
const LAST_PLAYED_KEY = 'typemaster_last_played';
const ONBOARDING_KEY = 'koompi_onboarding_completed';

// Define Electron API Interface
declare global {
  interface Window {
    electronAPI?: {
      loadData: () => Promise<any>;
      saveData: (key: string, value: any) => Promise<boolean>;
    };
  }
}

// In-memory cache for synchronous access (since Electron IPC is async)
let memCache: Record<string, any> = {};

// Initialize cache from storage on app load
const initCache = async () => {
  if (window.electronAPI) {
    try {
      memCache = await window.electronAPI.loadData();
      console.log('Loaded data from Electron storage:', memCache);
    } catch (e) {
      console.error('Failed to load Electron data:', e);
    }
  } else {
    // Load all from localStorage into memCache? 
    // Actually we can just pull on demand for web, but for unifying logic, key-based sync is tricky.
    // Simpler: Use getters/setters that check mode.
  }
};

// Immediate init
initCache();

const setItem = (key: string, value: string) => {
  // Update memory cache
  memCache[key] = value;

  // Persist
  if (window.electronAPI) {
    // For Electron: parse back to JSON if it's an object string, or just save raw string?
    // main.ts expects save-data(key, value).
    // Let's rely on the caller passing stringified data, or we can handle objects.
    // To match localStorage behavior, value is string.
    window.electronAPI.saveData(key, value);
  } else {
    localStorage.setItem(key, value);
  }
};

const getItem = (key: string): string | null => {
  if (window.electronAPI) {
    // Return from memory cache (sync)
    return memCache[key] || null;
  }
  return localStorage.getItem(key);
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = getItem(STORAGE_KEY);
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

  setItem(STORAGE_KEY, JSON.stringify(updated));
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
    const raw = getItem(`${LEVEL_KEY_PREFIX}${lang}_${level}`);
    if (raw) return JSON.parse(raw);

    // Default: Only Level 0 is unlocked by default
    return {
      stars: 0,
      unlocked: level === 0,
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
    setItem(`${LEVEL_KEY_PREFIX}${lang}_${level}`, JSON.stringify({
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
      setItem(`${LEVEL_KEY_PREFIX}${lang}_${nextLevel}`, JSON.stringify({
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
    return parseInt(getItem(XP_KEY) || '0', 10);
  } catch { return 0; }
};

export const addXP = (amount: number): number => {
  const current = getUserXP();
  const next = current + Math.max(0, Math.floor(amount));
  setItem(XP_KEY, next.toString());
  return next;
};

export const getStreak = (): number => {
  try {
    return parseInt(getItem(STREAK_KEY) || '0', 10);
  } catch { return 0; }
};

export const updateStreak = (): number => {
  const today = new Date().toDateString();
  const lastPlayed = getItem(LAST_PLAYED_KEY);

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

  setItem(LAST_PLAYED_KEY, today);
  return newStreak;
};

// Problem Keys Tracking
const PROBLEM_KEYS_KEY = 'koompi_problem_keys';

interface ProblemKeyData {
  [char: string]: number; // Error score (higher = worse)
}

export const getProblemKeys = (): ProblemKeyData => {
  try {
    return JSON.parse(getItem(PROBLEM_KEYS_KEY) || '{}');
  } catch { return {}; }
};

export const recordKeyError = (char: string) => {
  const keys = getProblemKeys();
  const current = keys[char] || 0;
  // Increase score on error (cap at 10)
  keys[char] = Math.min(10, current + 1);
  setItem(PROBLEM_KEYS_KEY, JSON.stringify(keys));
};

export const recordKeySuccess = (char: string) => {
  const keys = getProblemKeys();
  if (!keys[char]) return;

  // Decrease score on success (decay)
  const current = keys[char];
  if (current > 0) {
    keys[char] = Math.max(0, current - 0.2); // Decay slower than error accumulation
    if (keys[char] <= 0) delete keys[char]; // Remove if healed
    setItem(PROBLEM_KEYS_KEY, JSON.stringify(keys));
  }
};

export const getTopProblemKeys = (limit: number = 5): string[] => {
  const keys = getProblemKeys();
  return Object.entries(keys)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([char]) => char);
};

// --- Onboarding ---

export const hasCompletedOnboarding = (): boolean => {
  try {
    return getItem(ONBOARDING_KEY) === 'true';
  } catch { return false; }
};

export const setOnboardingCompleted = () => {
  setItem(ONBOARDING_KEY, 'true');
};
