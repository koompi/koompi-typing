import { Language } from "../types";
import { KEYBOARD_LAYOUT } from "./keyboardData";
import lessonsData from "../data/lessons.json"; // Import generated content

export interface LevelData {
  level: number;
  title: string;
  description: string;
  text: string;
  criteria: {
    minAccuracy: number;
    minWpm: number;
  };
}

export type LevelIconType = 'keyboard' | 'brain' | 'rocket' | 'trophy' | 'star' | 'book' | 'laptop' | 'user';

export interface LevelMeta {
  id: number;
  title: string;
  title_km: string;
  icon: LevelIconType;
  description_en: string;
  description_km: string;
}

// --- CONSTANT DATA: 15 UNITS OF CONTENT ---

const UNIT_TITLES_EN = [
  "Basics", "Words", "Sentences", "Phrases", "Food", "Travel", "Family", "Numbers",
  "Work", "Nature", "Health", "Emotions", "Culture", "Science", "History"
];

const UNIT_TITLES_KM = [
  "មូលដ្ឋាន", "ពាក្យ", "ប្រយោគ", "ឃ្លា", "អាហារ", "ដំណើរ", "គ្រួសារ", "លេខ",
  "ការងារ", "ធម្មជាតិ", "សុខភាព", "អារម្មណ៍", "វប្បធម៌", "វិទ្យាសាស្ត្រ", "ប្រវត្តិ"
];

// --- METADATA GENERATION ---

export const LEVEL_METADATA: LevelMeta[] = [];

for (let i = 0; i < 150; i++) {
  const unitIdx = Math.floor(i / 10); // 0-14
  const unitNum = unitIdx + 1;
  const levelInUnit = (i % 10) + 1;

  // Custom metadata logic based on Unit ID
  let title = `Level ${levelInUnit}`;
  let title_km = `កម្រិត ${levelInUnit}`;
  let icon: LevelIconType = 'star';
  let desc_en = "Practice typing";
  let desc_km = "អនុវត្តការវាយអក្សរ";

  if (unitNum === 1) { // Basics
    icon = 'keyboard';
    desc_en = "Master keys";
    desc_km = "គ្រប់គ្រងគ្រាប់ចុច";
    if (i === 9) icon = 'trophy';
  } else {
    // General procedural titles
    title = `${UNIT_TITLES_EN[unitIdx]} ${levelInUnit}`;
    title_km = `${UNIT_TITLES_KM[unitIdx]} ${levelInUnit}`;

    // Icons pattern
    if (levelInUnit === 1) icon = 'book'; // Intro
    else if (levelInUnit === 5) icon = 'brain'; // Practice
    else if (levelInUnit === 10) icon = 'trophy'; // Boss
    else icon = 'star';

    desc_en = `${UNIT_TITLES_EN[unitIdx]} Practice`;
    desc_km = `ការអនុវត្ត ${UNIT_TITLES_KM[unitIdx]}`;
  }

  // Override specific Basics levels for clarity
  if (i === 0) { title = "Home Row: Index"; title_km = "ជួរកណ្ដាល៖ ចង្អុលដៃ"; }
  if (i === 1) { title = "Home Row: Middle"; title_km = "ជួរកណ្ដាល៖ ម្រាមកណ្ដាល"; }
  if (i === 2) { title = "Home Row: Ring"; title_km = "ជួរកណ្ដាល៖ ម្រាមនាង"; }
  if (i === 3) { title = "Home Row: Pinky"; title_km = "ជួរកណ្ដាល៖ ម្រាមកូន"; }
  if (i === 9) { title = "Alphabet Check"; title_km = "ការត្រួតពិនិត្យអក្ខរក្រម"; }

  LEVEL_METADATA.push({
    id: i,
    title,
    title_km,
    icon,
    description_en: desc_en,
    description_km: desc_km
  });
}

// Helper to find characters for specific key codes in the layout (reused)
const getChars = (keyCodes: string[], lang: Language): string[] => {
  const chars: string[] = [];
  KEYBOARD_LAYOUT.forEach(row => {
    row.forEach(key => {
      if (keyCodes.includes(key.code)) {
        chars.push(key[lang].normal);
      }
    });
  });
  return chars;
};

// Generate a random drill string from a set of characters
const generateDrill = (chars: string[], length: number = 20): string => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
    if (i % 5 === 4 && i !== length - 1) result += " ";
  }
  return result;
};

export const getLevelData = async (level: number, lang: Language): Promise<LevelData> => {

  const meta = LEVEL_METADATA[level];
  const title = meta ? (lang === 'km' ? meta.title_km : meta.title) : `Level ${level}`;
  const description = meta ? (lang === 'km' ? meta.description_km : meta.description_en) : "";

  // Base Data Structure
  let data: LevelData = {
    level,
    title,
    description,
    text: "loading...",
    criteria: { minAccuracy: 85, minWpm: 15 + Math.floor(level / 5) }
  };

  try {
    // --- UNIT 1: KEYBOARD BASICS (0-9) ---
    // Procedurally generated from keymaps for dynamic drills
    if (level < 10) {
      data.criteria = { minAccuracy: 90, minWpm: 10 + level };
      let chars: string[] = [];

      switch (level) {
        case 0: chars = getChars(['KeyF', 'KeyJ'], lang); break;
        case 1: chars = [...getChars(['KeyD', 'KeyK'], lang), ...getChars(['KeyF', 'KeyJ'], lang)]; break;
        case 2: chars = [...getChars(['KeyS', 'KeyL'], lang), ...getChars(['KeyD', 'KeyK'], lang)]; break;
        case 3: chars = [...getChars(['KeyA', 'Semicolon'], lang), ...getChars(['KeyS', 'KeyL'], lang)]; break;
        case 4: chars = getChars(['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], lang); break;
        case 5: chars = getChars(['KeyR', 'KeyU', 'KeyT', 'KeyY'], lang); break;
        case 6: chars = getChars(['KeyE', 'KeyI', 'KeyW', 'KeyO'], lang); break;
        case 7: chars = [...getChars(['KeyQ', 'KeyP'], lang), ...getChars(['KeyW', 'KeyO'], lang)]; break;
        case 8: chars = getChars(['KeyV', 'KeyM', 'KeyB', 'KeyN'], lang); break;
        case 9: chars = getChars(['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'], lang); break;
      }

      data.text = generateDrill(chars, level === 9 ? 60 : 40);
      return data;
    }

    // --- UNITS 2-15: OFFLINE CONTENT (Curriculum) ---
    // Use generated content from lessons.json

    // Find the lesson in the generated data
    const lesson = lessonsData.lessons.find((l: any) => l.level === level);

    if (lesson) {
      const contentArray = lang === 'km' ? lesson.km : lesson.en;

      // For levels > 10, we usually have multiple sentences/paragraphs in the array.
      // We can join them to create a longer practice session, or pick random ones.
      // For a consistent "curriculum" feel, let's join them with newlines or spaces.
      // If it's words (L10-19), space is better.
      // If it's sentences (L20+), space is also fine.

      if (contentArray && contentArray.length > 0) {
        // Join with space. For paragraphs, they are already long strings.
        data.text = contentArray.join(' ');
        return data;
      }
    }

    // Fallback if content is missing
    data.text = lang === 'en' ? "Practice makes perfect." : "ការរៀនធ្វើឱ្យប្រសើរឡើង។";
    return data;

  } catch (e) {
    console.error("Level generation error", e);
    data.text = lang === 'en' ? "Error loading level." : "មានបញ្ហាក្នុងការផ្ទុក។";
    return data;
  }
};