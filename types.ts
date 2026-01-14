export type Language = 'en' | 'km';

export type Finger = 'L-pinky' | 'L-ring' | 'L-middle' | 'L-index' | 'thumb' | 'R-index' | 'R-middle' | 'R-ring' | 'R-pinky';

export interface KeyData {
  code: string; // DOM Key Code (e.g., KeyA, Space)
  label: string; // Default label (EN)
  en: { normal: string; shift: string };
  km: { normal: string; shift: string };
  finger: Finger;
  width?: number; // Relative width (1 is standard key)
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  charsTyped: number;
  errors: number;
  startTime: number | null;
  endTime?: number;
}

export interface HandProps {
  activeFinger: Finger | null;
  side: 'left' | 'right';
}

export type ChallengeType = 'speed' | 'accuracy' | 'endurance';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  title: string;
  title_km?: string;
  description: string;
  description_km?: string;
  type: ChallengeType;
  difficulty: Difficulty;
  criteria: {
    minWpm?: number;
    minAccuracy?: number;
    timeLimitSeconds?: number; // If set, user fights against clock
    wordCount?: number; // Target length
  };
}

export interface LevelProgress {
  stars: 0 | 1 | 2 | 3;
  score: number;
  unlocked: boolean;
  completedAt?: number;
}

export interface UserProgress {
  levels: Record<number, LevelProgress>;
  lastPlayedLevel: number;
}

export interface LeaderboardEntry {
  id: string;
  challengeId: string;
  wpm: number;
  accuracy: number;
  date: number; // timestamp
}