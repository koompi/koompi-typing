import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MainMenu } from './components/MainMenu';
import { TypingGame } from './components/TypingGame';
import { ResultsModal } from './components/ResultsModal';
import { RoadmapMinimap } from './components/RoadmapMinimap';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { Hand } from './components/FingerGuide';
import { TypingVisualizer } from './components/TypingVisualizer';
import { useKhmerInput, normalizeKhmerText } from './hooks/useKhmerInput';
import { generatePracticeText } from './services/geminiService';
import { KEYBOARD_LAYOUT } from './utils/keyboardData';
import { CHALLENGES } from './utils/challenges';
import {
  saveScore, getUserLevel, saveUserLevel, saveLevelProgress,
  getUserXP, addXP, getStreak, updateStreak
} from './services/storageService';
import { getLevelData, LevelData } from './utils/levels';
import { Language, GameStats, Finger, Challenge } from './types';
import {
  RefreshCw, Globe, Keyboard, Trophy, AlertCircle, Play,
  ArrowLeft, Clock, Map, Star, ChevronRight, Flame, Zap,
  Sparkles, Wifi, WifiOff, Cloud, BookOpen, User, Settings
} from 'lucide-react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { SettingsPanel } from './components/SettingsPanel';
import { ProfilePage } from './components/ProfilePage';
import { LeaderboardPage } from './components/LeaderboardPage';

type AppMode = 'menu' | 'practice' | 'challenge-play' | 'adventure' | 'profile' | 'leaderboard';

// Translation Dictionary
const UI_TEXT = {
  en: {
    streak: "Streak",
    days: "Days",
    experience: "Experience",
    online: "ONLINE",
    offline: "OFFLINE",
    language: "Language",
    heroTitle: "KOOMPI",
    heroSubtitle: "Typing",
    heroDesc: "Master Khmer & English typing through gamified adventures. Build your streak and level up!",
    adventureTitle: "Adventure Path",
    adventureDesc: "Journey from novice to master.",
    currentLevel: "Current Level",
    practiceTitle: "Quick Practice",
    practiceDesc: "Relaxed typing with AI texts.",
    randomDrills: "Random drills",
    startSession: "Start Session",
    challengeTitle: "Arena",
    wpm: "WPM",
    acc: "ACC",
    menu: "Menu",
    nextLevel: "Next Level",
    tryAgain: "Try Again",
    finished: "Finished!",
    challengeFailed: "Challenge Failed",
    challengeCompleted: "Challenge Completed!",
    levelComplete: "Level Complete!",
    practiceSession: "Great practice session!",
    speed: "Speed",
    accuracy: "Accuracy",
    bestCombo: "Best Combo",
    poweredBy: "Powered by",
    goal: "Goal",
    needs: "Needs",
    minSpeed: "Min Speed",
    minAcc: "Min Acc",
    timeLimit: "Time Limit",
    learningPath: "Learning Path",
    quickPlay: "Quick Play",
    guest: "Guest",
    level: "Level",
    xp: "XP",
    topPerformers: "Top Performers",
    player: "Player",
    premium: "Premium",
    unlockFeatures: "Unlock unlimited hearts and mastery quizzes.",
    learnMore: "Learn More",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  },
  km: {
    streak: "ការបន្ត",
    days: "ថ្ងៃ",
    experience: "បទពិសោធន៍",
    online: "អនឡាញ",
    offline: "ក្រៅបណ្តាញ",
    language: "ភាសា",
    heroTitle: "KOOMPI",
    heroSubtitle: "Typing",
    heroDesc: "រៀនវាយអក្សរខ្មែរ និងអង់គ្លេស តាមរយៈការផ្សងព្រេង។ បង្កើនសមត្ថភាពរបស់អ្នក!",
    adventureTitle: "វគ្គផ្សងព្រេង",
    adventureDesc: "ចាប់ផ្តើមពីកម្រិតដំបូង រហូតដល់ក្លាយជាអ្នកជំនាញ។",
    currentLevel: "កម្រិតបច្ចុប្បន្ន",
    practiceTitle: "ការអនុវត្តសេរី",
    practiceDesc: "វាយអក្សរដោយសេរីជាមួយអត្ថបទ AI ។ ល្អបំផុតសម្រាប់ការហ្វឹកហាត់ប្រចាំថ្ងៃ។",
    randomDrills: "លំហាត់ចៃដន្យ",
    startSession: "ចាប់ផ្តើម",
    challengeTitle: "សមរភូមិប្រកួត",
    wpm: "ពាក្យ/នាទី",
    acc: "ត្រឹមត្រូវ",
    menu: "ម៉ឺនុយ",
    nextLevel: "កម្រិតបន្ទាប់",
    tryAgain: "ព្យាយាមម្តងទៀត",
    finished: "បានបញ្ចប់!",
    challengeFailed: "បរាជ័យ",
    challengeCompleted: "ជោគជ័យ!",
    levelComplete: "ឆ្លងវគ្គ!",
    practiceSession: "ការអនុវត្តបានល្អ!",
    speed: "ល្បឿន",
    accuracy: "ភាពត្រឹមត្រូវ",
    bestCombo: "បន្តល្អបំផុត",
    poweredBy: "ឧបត្ថម្ភដោយ",
    goal: "គោលដៅ",
    needs: "តម្រូវការ",
    minSpeed: "ល្បឿនអប្បបរមា",
    minAcc: "ត្រឹមត្រូវអប្បបរមា",
    timeLimit: "ពេលវេលា",
    learningPath: "ផ្លូវសិក្សា",
    quickPlay: "ការលេងរហ័ស",
    guest: "ភ្ញៀវ",
    level: "កម្រិត",
    xp: "ពិន្ទុ",
    topPerformers: "អ្នកលេងល្អបំផុត",
    player: "អ្នកលេង",
    premium: "សេវាពិសេស",
    unlockFeatures: "ដោះស្រាយមុខងារពិសេស និងការលេងគ្មានដែនកំណត់។",
    learnMore: "ស្វែងយល់បន្ថែម",
    easy: "ងាយស្រួល",
    medium: "មធ្យម",
    hard: "ពិបាក"
  }
};

// --- Animated Background Components ---
const BackgroundDecor = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
    <div className="absolute top-[5%] left-[10%] animate-float text-yellow-300 drop-shadow-lg"><Star className="w-8 h-8 fill-yellow-300" /></div>
    <div className="absolute top-[15%] right-[20%] animate-float-delayed text-pink-300 drop-shadow-md"><Star className="w-6 h-6 fill-pink-300" /></div>
    <div className="absolute top-[10%] left-[-10%] opacity-90 animate-drift text-white/80"><Cloud className="w-32 h-20 fill-white" /></div>
    <div className="absolute top-[20%] left-[40%] opacity-70 animate-drift-slow text-white/60" style={{ animationDelay: '5s' }}><Cloud className="w-24 h-16 fill-white" /></div>
    <div className="absolute top-[15%] left-[80%] opacity-80 animate-drift text-white/70" style={{ animationDelay: '15s' }}><Cloud className="w-40 h-24 fill-white" /></div>
  </div>
);

// Reusable Footer Component
const KoompiFooter: React.FC<{ t: typeof UI_TEXT.en, lang: Language }> = ({ t, lang }) => (
  <footer className="w-full py-6 flex justify-center items-center gap-2 mt-auto relative z-10">
    <span className={`text-xs font-bold text-slate-600 flex items-center gap-1 ${lang === 'km' ? 'font-khmer' : ''}`}>
      {lang === 'km' ? 'បង្កើតដោយ' : 'Built with'} <span className="text-red-500">❤️</span> {lang === 'km' ? 'ដោយ' : 'by'}
    </span>
    <a href="https://koompi.com" target="_blank" rel="noopener noreferrer" className="flex items-center group transition-all hover:scale-105">
      <img src="/icons/koompi.png" alt="KOOMPI" className="h-6 w-auto opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm" />
    </a>
    <span className={`text-xs font-bold text-slate-600 ${lang === 'km' ? 'font-khmer' : ''}`}>
      {lang === 'km' ? 'សម្រាប់អ្នកកសាងជំនាន់ក្រោយ។' : 'for next generation of builders.'}
    </span>
  </footer>
);

// Main App Component - wrapper with SettingsProvider
export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
};

// Inner App Content
const AppContent: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('menu');
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  // Adventure Mode State
  const [currentLevelData, setCurrentLevelData] = useState<LevelData | null>(null);

  // Set Khmer as default language
  const [lang, setLang] = useState<Language>('km');
  const [targetText, setTargetText] = useState("Loading...");
  const [userInput, setUserInput] = useState("");
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // IME Composition State
  const [isComposing, setIsComposing] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const lastProcessedLength = useRef(0);

  // Gamification State
  const [userXP, setUserXP] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  // DOM Refs for Teleprompter
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  const [challengeTimeLeft, setChallengeTimeLeft] = useState<number | null>(null);

  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    charsTyped: 0,
    errors: 0,
    startTime: null
  });

  const [isFinished, setIsFinished] = useState(false);
  const [challengeResult, setChallengeResult] = useState<{ success: boolean, message: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const t = UI_TEXT[lang];

  // Normalize target text for comparison (important for Khmer)
  const normalizedTarget = normalizeKhmerText(targetText);

  useEffect(() => {
    setUserXP(getUserXP());
    setUserStreak(getStreak());
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const char = activeCharRef.current;
      const containerWidth = container.offsetWidth;
      const charLeft = char.offsetLeft;
      const charWidth = char.offsetWidth;
      const targetScrollLeft = charLeft - (containerWidth / 2) + (charWidth / 2);
      container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
  }, [userInput, targetText, mode]);

  // Focus hidden input when in game mode
  useEffect(() => {
    if (mode !== 'menu' && hiddenInputRef.current && !isFinished && !isLoading) {
      hiddenInputRef.current.focus();
    }
  }, [mode, isFinished, isLoading, lang]);

  // Re-focus on click anywhere
  useEffect(() => {
    if (mode === 'menu') return;

    const handleClick = () => {
      if (hiddenInputRef.current && !isFinished && !isLoading) {
        hiddenInputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mode, isFinished, isLoading]);

  const startPractice = () => {
    setMode('practice');
    setActiveChallenge(null);
    loadNewText('medium');
  };

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setMode('challenge-play');
    if (challenge.id === 'c_khmer_scholar') setLang('km');
    else if (challenge.difficulty === 'easy' && challenge.id !== 'c_khmer_scholar') setLang('en');
    loadNewText(challenge.difficulty);
  };

  const startLevel = async (level: number) => {
    setMode('adventure');
    loadLevel(level);
  };

  const loadLevel = async (level: number, forceLang?: Language) => {
    setIsLoading(true);
    resetGameState();
    const l = forceLang || lang;
    const data = await getLevelData(level, l);
    setCurrentLevelData(data);
    setTargetText(data.text);
    setIsLoading(false);
    // Focus hidden input
    setTimeout(() => hiddenInputRef.current?.focus(), 100);
  };

  const nextLevel = () => {
    if (currentLevelData) {
      const nextLvl = currentLevelData.level + 1;
      saveUserLevel(lang, nextLvl);
      loadLevel(nextLvl);
    }
  };

  const returnToMenu = () => {
    setMode('menu');
    setIsFinished(false);
    setUserInput("");
    setChallengeResult(null);
    setChallengeTimeLeft(null);
    setCurrentLevelData(null);
  };


  const toggleLanguage = () => {
    setLang(prev => {
      const newLang = prev === 'en' ? 'km' : 'en';

      // Reload content with new language immediately
      if (mode === 'practice') {
        const difficulty = activeChallenge ? activeChallenge.difficulty : 'medium';
        loadNewText(difficulty, newLang);
      } else if (mode === 'adventure' && currentLevelData) {
        // Reload current level with new language
        loadLevel(currentLevelData.level, newLang);
      } else if (mode === 'challenge-play' && activeChallenge) {
        // Some challenges are lang locked, but if not:
        if (activeChallenge.id !== 'c_khmer_scholar') {
          loadNewText(activeChallenge.difficulty, newLang);
        }
      }

      return newLang;
    });
  };

  const changeDifficulty = (diff: 'easy' | 'medium' | 'hard') => {
    // Only applies to practice/challenge modes usually, but we can store it or re-generate text
    if (mode === 'practice') {
      loadNewText(diff);
    }
    // For adventure, difficulty is usually fixed by level, but maybe we can adjust criteria?
    // For now, only practice mode supports explicit difficulty change for text generation.
  };

  const resetGameState = () => {
    setIsFinished(false);
    setChallengeResult(null);
    setUserInput("");
    setPressedKeys(new Set());
    setStats({ wpm: 0, accuracy: 100, charsTyped: 0, errors: 0, startTime: null });
    setCombo(0);
    setMaxCombo(0);
    setXpGained(0);
    lastProcessedLength.current = 0;
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = '';
    }
  };

  const loadNewText = async (difficulty: 'easy' | 'medium' | 'hard', forceLang?: Language) => {
    setIsLoading(true);
    resetGameState();
    const l = forceLang || lang;
    if (activeChallenge?.criteria.timeLimitSeconds) {
      setChallengeTimeLeft(activeChallenge.criteria.timeLimitSeconds);
    } else {
      setChallengeTimeLeft(null);
    }
    const text = await generatePracticeText(l, difficulty);
    setTargetText(text);
    setIsLoading(false);
    // Focus hidden input
    setTimeout(() => hiddenInputRef.current?.focus(), 100);
  };

  // Handle character typed (from hidden input or direct keyboard)
  const handleCharacterTyped = useCallback((charTyped: string) => {
    if (isLoading || isFinished || mode === 'menu') return;

    if (!stats.startTime) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }

    const expectedChar = normalizedTarget[userInput.length];
    if (!expectedChar) return;

    if (charTyped === expectedChar) {
      const newUserInput = userInput + charTyped;
      setUserInput(newUserInput);
      setStats(prev => ({ ...prev, charsTyped: prev.charsTyped + 1 }));

      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      if (newUserInput.length === normalizedTarget.length) {
        finishGame();
      }
    } else {
      setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
      setCombo(0);
      if (activeChallenge?.criteria.minAccuracy === 100) {
        setIsFinished(true);
        setChallengeResult({ success: false, message: t.challengeFailed });
      }
    }
  }, [userInput, normalizedTarget, isLoading, isFinished, stats.startTime, mode, activeChallenge, maxCombo, t]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (isLoading || isFinished || mode === 'menu') return;
    setUserInput(prev => prev.slice(0, -1));
    setCombo(0);
    lastProcessedLength.current = Math.max(0, lastProcessedLength.current - 1);
  }, [isLoading, isFinished, mode]);

  // IME Composition handlers
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);

    // CRITICAL FIX: On Linux IBus/Fcitx, e.data is often empty.
    // The composed character is already in the input field's value.
    // We must read from the input element directly.
    const inputElement = hiddenInputRef.current;
    if (!inputElement) return;

    // First try e.data (works on some platforms)
    let composedData = e.data;

    // Fallback: read directly from input value (essential for Linux IME)
    if (!composedData || composedData.length === 0) {
      const inputValue = inputElement.value;
      // Get only the new characters since last processed
      composedData = inputValue.slice(lastProcessedLength.current);
    }

    // Process each composed character
    if (composedData && composedData.length > 0) {
      for (const char of composedData) {
        handleCharacterTyped(char);
      }
    }

    // Clear input after processing
    inputElement.value = '';
    lastProcessedLength.current = 0;
  }, [handleCharacterTyped]);

  // Handle input from hidden text field
  const handleHiddenInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if (isLoading || isFinished || mode === 'menu') return;
    if (isComposing) return; // Wait for composition to end

    const newValue = e.currentTarget.value;
    const newChars = newValue.slice(lastProcessedLength.current);

    if (newChars.length > 0) {
      for (const char of newChars) {
        handleCharacterTyped(char);
      }
    }

    lastProcessedLength.current = newValue.length;

    // Clear input periodically to prevent overflow
    if (newValue.length > 100) {
      e.currentTarget.value = '';
      lastProcessedLength.current = 0;
    }
  }, [isLoading, isFinished, mode, isComposing, handleCharacterTyped]);

  // Handle special keys in hidden input
  const handleHiddenKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isLoading || isFinished || mode === 'menu') return;
    if (isComposing) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = '';
        lastProcessedLength.current = 0;
      }
      return;
    }

    // Prevent default for space to avoid page scrolling
    if (e.key === ' ') {
      e.preventDefault();
      handleCharacterTyped(' ');
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = '';
        lastProcessedLength.current = 0;
      }
      return;
    }

    // Handle Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCharacterTyped('\n');
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = '';
        lastProcessedLength.current = 0;
      }
      return;
    }
  }, [isLoading, isFinished, mode, isComposing, handleBackspace, handleCharacterTyped]);

  // Handle keyboard visual feedback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isLoading || isFinished || mode === 'menu') return;

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(e.code);
      return newSet;
    });

    if (e.key === 'Shift') {
      setIsShiftActive(true);
    }
  }, [isLoading, isFinished, mode]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
    if (e.key === 'Shift') {
      setIsShiftActive(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (!stats.startTime || isFinished) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsedMin = (now - stats.startTime!) / 60000;
      const wpm = Math.round((stats.charsTyped / 5) / (timeElapsedMin || 0.001));
      const accuracy = stats.charsTyped > 0
        ? Math.round(((stats.charsTyped - stats.errors) / stats.charsTyped) * 100)
        : 100;
      setStats(prev => ({ ...prev, wpm, accuracy: Math.max(0, accuracy) }));
      if (activeChallenge?.criteria.timeLimitSeconds) {
        const elapsedSec = (now - stats.startTime!) / 1000;
        const left = Math.max(0, activeChallenge.criteria.timeLimitSeconds - elapsedSec);
        setChallengeTimeLeft(Math.ceil(left));
        if (left <= 0) finishGame();
      }
    }, 500);
    return () => clearInterval(interval);
  }, [stats.startTime, isFinished, activeChallenge, stats.charsTyped, stats.errors]);

  const finishGame = () => {
    setIsFinished(true);
    const baseXP = Math.floor(stats.charsTyped * 0.5);
    const accBonus = stats.accuracy >= 95 ? 50 : 0;
    const wpmBonus = stats.wpm >= 40 ? 50 : 0;
    const totalXP = baseXP + accBonus + wpmBonus;
    const newXP = addXP(totalXP);
    const newStreak = updateStreak();
    setXpGained(totalXP);
    setUserXP(newXP);
    setUserStreak(newStreak);

    if (mode === 'adventure' && currentLevelData) {
      let success = true;
      let reasons: string[] = [];
      if (stats.accuracy < currentLevelData.criteria.minAccuracy) {
        success = false;
        reasons.push(`${t.needs} ${currentLevelData.criteria.minAccuracy}% ${t.accuracy}`);
      }
      if (stats.wpm < currentLevelData.criteria.minWpm) {
        success = false;
        reasons.push(`${t.needs} ${currentLevelData.criteria.minWpm} ${t.wpm}`);
      }
      if (success) {
        // Calculate Stars
        let stars = 1; // Base star for passing
        // Bonus for high accuracy
        if (stats.accuracy >= 98) stars++;
        // Bonus for speed (beat min by 20% or flat 40wpm)
        if (stats.wpm >= Math.max(40, currentLevelData.criteria.minWpm * 1.2)) stars++;

        // Cap at 3
        if (stars > 3) stars = 3;

        saveLevelProgress(lang, currentLevelData.level, stars, totalXP);
        setChallengeResult({ success: true, message: t.levelComplete });
      } else {
        setChallengeResult({ success: false, message: reasons.join('. ') });
      }
      return;
    }
    if (activeChallenge) {
      let success = true;
      let reasons: string[] = [];
      if (activeChallenge.criteria.minWpm && stats.wpm < activeChallenge.criteria.minWpm) {
        success = false;
        reasons.push(`${t.speed} < ${activeChallenge.criteria.minWpm} ${t.wpm}`);
      }
      if (activeChallenge.criteria.minAccuracy && stats.accuracy < activeChallenge.criteria.minAccuracy) {
        success = false;
        reasons.push(`${t.accuracy} < ${activeChallenge.criteria.minAccuracy}%`);
      }
      if (success) {
        setChallengeResult({ success: true, message: t.challengeCompleted });
        saveScore(activeChallenge.id, stats.wpm, stats.accuracy);
      } else {
        setChallengeResult({ success: false, message: reasons.join('. ') });
      }
      return;
    }
    setChallengeResult({ success: true, message: t.practiceSession });
  };

  const getActiveFinger = (): Finger | null => {
    if (isFinished) return null;
    const nextChar = normalizedTarget[userInput.length];
    if (!nextChar) return null;
    for (const row of KEYBOARD_LAYOUT) {
      for (const key of row) {
        if (key[lang].normal === nextChar || key[lang].shift === nextChar) {
          return key.finger;
        }
      }
    }
    if (nextChar === '\n') return 'R-pinky';
    return null;
  };

  const activeFinger = getActiveFinger();
  const progressPercent = Math.min(100, Math.max(0, (userInput.length / (normalizedTarget.length || 1)) * 100));

  // VIEW: MAIN MENU
  if (mode === 'menu') {
    return (
      <>
        <MainMenu
          lang={lang}
          userXP={userXP}
          userStreak={userStreak}
          currentLevel={getUserLevel(lang)}
          t={t}
          onToggleLang={() => setLang(prev => prev === 'en' ? 'km' : 'en')}
          onStartPractice={startPractice}
          onStartChallenge={startChallenge}
          onSelectLevel={startLevel}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenProfile={() => setMode('profile')}
          onOpenLeaderboard={() => setMode('leaderboard')}
        />
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} lang={lang} />
      </>
    );
  }

  if (mode === 'profile') {
    return (
      <div className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-hidden ${lang === 'km' ? 'font-khmer' : ''}`}>
        <ProfilePage lang={lang} onBack={() => setMode('menu')} />
      </div>
    );
  }

  if (mode === 'leaderboard') {
    return (
      <div className={`min-h-screen text-slate-800 flex flex-col font-sans overflow-hidden ${lang === 'km' ? 'font-khmer' : ''}`}>
        <LeaderboardPage lang={lang} onBack={() => setMode('menu')} />
      </div>
    );
  }

  // View: Game
  return (
    <>
      <div className={`min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-blue-200 text-slate-800 flex flex-col font-sans overflow-hidden ${lang === 'km' ? 'font-khmer' : ''} relative`}>
        <BackgroundDecor />

        {/* Hidden Input for IME Support - Critical for Khmer on Linux */}
        <input
          ref={hiddenInputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          style={{ position: 'fixed', top: -1000, left: -1000, width: 1, height: 1 }}
          onInput={handleHiddenInput}
          onKeyDown={handleHiddenKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Typing input"
          tabIndex={0}
        />

        {/* Full Screen Result Modal */}
        {isFinished && (
          <ResultsModal
            stats={stats}
            maxCombo={maxCombo}
            xpGained={xpGained}
            userStreak={userStreak}
            challengeResult={challengeResult}
            mode={mode}
            activeChallenge={activeChallenge}
            currentLevelData={currentLevelData}
            lang={lang}
            t={t}
            onReturnToMenu={returnToMenu}
            onNextLevel={nextLevel}
            onTryAgain={() => {
              if (mode === 'adventure' && currentLevelData) {
                loadLevel(currentLevelData.level);
              } else {
                loadNewText(activeChallenge ? activeChallenge.difficulty : 'medium');
              }
            }}
          />
        )}

        <header className="flex justify-between items-center p-2 sm:p-4 sticky top-0 z-50">
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={returnToMenu} className="p-1.5 sm:p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200 hover:shadow-sm" title={t.menu}>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>

            {/* Language Toggle In-Game */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1 bg-white/50 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-xs font-bold text-slate-600 uppercase"
              title={t.language}
            >
              <Globe className="w-3 h-3" />
              {lang}
            </button>

            <div>
              <h1 className="text-sm sm:text-lg font-bold flex items-center gap-1.5 sm:gap-2 text-slate-800 font-khmer">
                {mode === 'adventure' && currentLevelData ? (
                  <>
                    <span className="text-blue-500"><Map className="w-3 h-3 sm:w-4 sm:h-4" /></span>
                    <span className="truncate max-w-[120px] sm:max-w-none">{currentLevelData.title}</span>
                  </>
                ) : activeChallenge ? (
                  <>
                    <span className="text-yellow-500"><Trophy className="w-3 h-3 sm:w-4 sm:h-4" /></span>
                    <span className="truncate max-w-[120px] sm:max-w-none">{lang === 'km' && activeChallenge.title_km ? activeChallenge.title_km : activeChallenge.title}</span>
                  </>
                ) : (
                  <>
                    <span className="text-emerald-500"><Play className="w-3 h-3 sm:w-4 sm:h-4" /></span>
                    {t.practiceTitle}
                  </>
                )}
              </h1>
            </div>
          </div>



          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Visualizer - hide on small screens */}
            {!isFinished && (
              <div className="hidden sm:block mr-1 sm:mr-2 transform hover:scale-110 transition-transform duration-300 drop-shadow-md">
                <TypingVisualizer progress={progressPercent} wpm={stats.wpm} accuracy={stats.accuracy} />
              </div>
            )}

            {/* Combo Counter */}
            {combo > 5 && !isFinished && (
              <div className="animate-bounce flex items-center gap-1 text-orange-500 font-black italic text-lg sm:text-2xl drop-shadow-sm">
                <Flame className="w-4 h-4 sm:w-6 sm:h-6 fill-orange-500 text-orange-600 animate-pulse" />
                {combo}x
              </div>
            )}

            {/* Timer */}
            {challengeTimeLeft !== null && (
              <div className={`flex items-center gap-1 sm:gap-2 font-mono text-base sm:text-xl font-bold ${challengeTimeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-slate-700'}`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                {challengeTimeLeft}s
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-mono bg-white/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/60 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-slate-500 hidden sm:inline">{t.wpm}</span>
                <span className="text-slate-800 font-bold text-base sm:text-lg">{stats.wpm}</span>
                <span className="text-slate-400 text-[10px] sm:hidden">wpm</span>
              </div>
              <div className="w-px bg-slate-200 h-5 sm:h-6"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-slate-500 hidden sm:inline">{t.acc}</span>
                <span className={`font-bold text-base sm:text-lg ${stats.accuracy === 100 ? 'text-emerald-500' : stats.accuracy > 90 ? 'text-slate-800' : 'text-rose-500'}`}>{stats.accuracy}%</span>
              </div>
            </div>

            {/* Controls */}
            {/* Settings / Difficulty Control */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
              title={t.menu}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {mode === 'practice' && (
              <button
                onClick={() => loadNewText('medium')}
                className="p-2 rounded-full hover:bg-blue-500 hover:text-white transition-all bg-white border border-slate-200 shadow-sm"
                title="Restart"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </header>

        {/* Main Content - optimized for 12"-30" screens */}
        <main
          className="flex-grow flex flex-col items-center justify-between p-2 sm:p-4 gap-3 sm:gap-4 lg:gap-6 max-w-[1800px] mx-auto w-full relative z-10"
          onClick={() => hiddenInputRef.current?.focus()}
        >

          {/* Smartphone Minimap Positioned Absolute Right */}
          {mode === 'adventure' && currentLevelData && (
            <div className="hidden xl:block absolute right-4 top-1/2 transform -translate-y-1/2 z-20 animate-fade-in-right">
              <RoadmapMinimap
                currentLevel={currentLevelData.level}
                totalLevels={150}
                completedLevels={getUserLevel(lang)}
              />
            </div>
          )}

          {/* Helper Instructions for Level */}
          {mode === 'adventure' && currentLevelData && !isFinished && (
            <div className="bg-white/80 text-blue-800 px-6 py-2 rounded-full border border-blue-200 text-sm font-medium animate-float-slow backdrop-blur-sm shadow-md font-khmer">
              🎯 {t.goal}: {currentLevelData.description} ({t.needs} {currentLevelData.criteria.minAccuracy}% {t.accuracy}, {currentLevelData.criteria.minWpm} {t.wpm})
            </div>
          )}

          {/* Typing Area (Whiteboard Style) - compact for more keyboard space */}
          <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/80 shadow-2xl h-28 sm:h-32 md:h-36 lg:h-44 relative overflow-hidden flex flex-col justify-center group ring-2 sm:ring-4 ring-white/30">
            {/* Center Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 sm:h-10 bg-blue-500/20 rounded-full z-0 pointer-events-none"></div>

            <div
              ref={textContainerRef}
              className="flex items-center overflow-x-auto h-full px-[50%] no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className={`flex items-center whitespace-nowrap font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl ${lang === 'km' ? 'font-khmer leading-relaxed' : ''}`}>
                {normalizedTarget.split('').map((char, idx) => {
                  const isTyped = idx < userInput.length;
                  const isCurrent = idx === userInput.length;
                  let base = "mx-[1px] px-0.5 sm:px-1 py-1 sm:py-2 rounded-lg transition-all duration-200 ";

                  if (isTyped) {
                    base += "text-slate-400 opacity-50 scale-90 blur-[0.5px]";
                  } else if (isCurrent) {
                    base += "bg-white text-blue-600 shadow-lg scale-105 sm:scale-110 font-bold border border-blue-100 z-10 animate-bounce";
                  } else {
                    base += "text-slate-700 opacity-80";
                  }

                  return (
                    <span
                      key={idx}
                      ref={isCurrent ? activeCharRef : null}
                      className={base}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyboard & Hands Container - optimized for 12"-30" screens */}
          <div className="w-full flex justify-center items-end gap-4 2xl:gap-8 mx-auto pb-4 px-2 sm:px-4 lg:px-8 mt-auto">
            {/* Left Hand - show on large screens */}
            <div className="hidden lg:block w-28 h-28 xl:w-36 xl:h-36 2xl:w-48 2xl:h-48 shrink-0 opacity-90 pointer-events-none select-none">
              <Hand side="left" activeFinger={activeFinger} />
            </div>

            {/* Keyboard - generous sizing for desktop screens */}
            <div className="flex-1 max-w-5xl min-w-0 z-10">
              <VirtualKeyboard
                lang={lang}
                pressedKeys={pressedKeys}
                nextKeyToType={!isFinished ? normalizedTarget[userInput.length] : null}
                isShiftActive={isShiftActive}
              />
            </div>

            {/* Right Hand - show on large screens */}
            <div className="hidden lg:block w-28 h-28 xl:w-36 xl:h-36 2xl:w-48 2xl:h-48 shrink-0 opacity-90 pointer-events-none select-none">
              <Hand side="right" activeFinger={activeFinger} />
            </div>
          </div>
        </main>
        <KoompiFooter t={t} lang={lang} />
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} lang={lang} />
    </>
  );
};