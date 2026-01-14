#!/usr/bin/env bun
/**
 * Offline Content Generator for KOOMPI TYPING
 * Generates 150 levels of typing content for both Khmer and English
 * 
 * Usage: bun run scripts/generate-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import word banks
import { COMMON_WORDS, HOME_ROW_WORDS, TOP_ROW_WORDS, BOTTOM_ROW_WORDS, CATEGORIES } from './data/words-en';
import { CONSONANTS, DEPENDENT_VOWELS, INDEPENDENT_VOWELS, SIGNS, COMMON_WORDS as KM_COMMON_WORDS, CATEGORIES as KM_CATEGORIES, SUBSCRIPT_WORDS, PROVERBS } from './data/words-km';
import * as templatesEn from './data/templates-en';
import * as templatesKm from './data/templates-km';
import { PARAGRAPHS_EN, PARAGRAPHS_KM } from './data/paragraphs';

// Types
interface LessonContent {
    level: number;
    en: string[];  // Array of practice texts for English
    km: string[];  // Array of practice texts for Khmer
}

interface GeneratedContent {
    version: string;
    generatedAt: string;
    lessons: LessonContent[];
}

// Utility functions
function shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function pickRandom<T>(array: T[], count: number): T[] {
    return shuffle(array).slice(0, count);
}

function fillTemplate(template: string, data: Record<string, string[]>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
        const values = data[key];
        if (!values || values.length === 0) return key;
        return values[Math.floor(Math.random() * values.length)];
    });
}

// Content generators by level range

// Levels 0-9: Keyboard Basics (Key drills)
function generateKeyboardBasics(level: number): { en: string[]; km: string[] } {
    const en: string[] = [];
    const km: string[] = [];

    if (level <= 2) {
        // Home row
        en.push(HOME_ROW_WORDS.slice(0, 5).join(' '));
        en.push(pickRandom(HOME_ROW_WORDS, 8).join(' '));
        km.push(CONSONANTS.slice(0, 5).join(' '));
        km.push(pickRandom(CONSONANTS.slice(0, 10), 8).join(' '));
    } else if (level <= 5) {
        // Top row
        en.push(TOP_ROW_WORDS.slice(0, 5).join(' '));
        en.push(pickRandom(TOP_ROW_WORDS, 8).join(' '));
        km.push(CONSONANTS.slice(10, 20).join(' '));
        km.push(pickRandom(CONSONANTS.slice(5, 15), 8).join(' '));
    } else if (level <= 7) {
        // Independent Vowels
        en.push(BOTTOM_ROW_WORDS.slice(0, 5).join(' '));
        en.push(pickRandom([...HOME_ROW_WORDS, ...TOP_ROW_WORDS], 10).join(' '));
        km.push(INDEPENDENT_VOWELS.join(' '));
        km.push(pickRandom([...CONSONANTS, ...INDEPENDENT_VOWELS], 10).join(' '));
    } else {
        // Signs & Mix
        en.push(pickRandom([...HOME_ROW_WORDS, ...TOP_ROW_WORDS, ...BOTTOM_ROW_WORDS], 12).join(' '));
        km.push(SIGNS.join(' '));
        km.push(pickRandom([...CONSONANTS, ...INDEPENDENT_VOWELS, ...SIGNS], 12).join(' '));
    }

    return { en, km };
}

// Levels 10-29: Simple sentences
function generateSimpleSentences(level: number): { en: string[]; km: string[] } {
    const en: string[] = [];
    const km: string[] = [];
    const count = 3 + Math.floor((level - 10) / 5);

    for (let i = 0; i < count; i++) {
        const templateEn = templatesEn.SIMPLE_TEMPLATES[i % templatesEn.SIMPLE_TEMPLATES.length];
        const templateKm = templatesKm.SIMPLE_TEMPLATES[i % templatesKm.SIMPLE_TEMPLATES.length];

        en.push(fillTemplate(templateEn, templatesEn.TEMPLATE_DATA));
        km.push(fillTemplate(templateKm, templatesKm.TEMPLATE_DATA));
    }

    return { en, km };
}

// Levels 30-59: Medium sentences (Daily Life themes)
function generateMediumSentences(level: number): { en: string[]; km: string[] } {
    const en: string[] = [];
    const km: string[] = [];
    const count = 4 + Math.floor((level - 30) / 8);

    const categoryKeys = Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>;
    const categoryIndex = (level - 30) % categoryKeys.length;
    const category = categoryKeys[categoryIndex];

    // Add themed words
    const themedWords = CATEGORIES[category].slice(0, 5).join(', ');
    en.push(themedWords);

    const kmCategoryKeys = Object.keys(KM_CATEGORIES) as Array<keyof typeof KM_CATEGORIES>;
    const kmCategory = kmCategoryKeys[categoryIndex % kmCategoryKeys.length];
    const kmThemedWords = KM_CATEGORIES[kmCategory].slice(0, 5).join(' ');
    km.push(kmThemedWords);

    // Add sentences
    for (let i = 0; i < count; i++) {
        const templateEn = templatesEn.MEDIUM_TEMPLATES[i % templatesEn.MEDIUM_TEMPLATES.length];
        const templateKm = templatesKm.MEDIUM_TEMPLATES[i % templatesKm.MEDIUM_TEMPLATES.length];

        en.push(fillTemplate(templateEn, templatesEn.TEMPLATE_DATA));
        km.push(fillTemplate(templateKm, templatesKm.TEMPLATE_DATA));
    }

    return { en, km };
}

// Levels 60-99: Complex sentences (Themes)
function generateComplexSentences(level: number): { en: string[]; km: string[] } {
    const en: string[] = [];
    const km: string[] = [];
    const count = 5 + Math.floor((level - 60) / 10);

    // Add subscript practice for Khmer
    if (level >= 70) {
        km.push(pickRandom(SUBSCRIPT_WORDS, 6).join(' '));
    }

    for (let i = 0; i < count; i++) {
        const templateEn = templatesEn.COMPLEX_TEMPLATES[i % templatesEn.COMPLEX_TEMPLATES.length];
        const templateKm = templatesKm.COMPLEX_TEMPLATES[i % templatesKm.COMPLEX_TEMPLATES.length];

        en.push(fillTemplate(templateEn, templatesEn.TEMPLATE_DATA));
        km.push(fillTemplate(templateKm, templatesKm.TEMPLATE_DATA));
    }

    // Add proverbs for Khmer at higher levels
    if (level >= 80) {
        km.push(PROVERBS[level % PROVERBS.length]);
    }

    return { en, km };
}

// Levels 100-149: Advanced (Paragraphs)
function generateParagraphs(level: number): { en: string[]; km: string[] } {
    const en: string[] = [];
    const km: string[] = [];

    const enTopics = Object.keys(PARAGRAPHS_EN) as Array<keyof typeof PARAGRAPHS_EN>;
    const kmTopics = Object.keys(PARAGRAPHS_KM) as Array<keyof typeof PARAGRAPHS_KM>;

    const topicEnIndex = (level - 100) % enTopics.length;
    const topicKmIndex = (level - 100) % kmTopics.length;

    const enTopic = enTopics[topicEnIndex];
    const kmTopic = kmTopics[topicKmIndex];

    const paragraphEnIndex = Math.floor((level - 100) / enTopics.length) % PARAGRAPHS_EN[enTopic].length;
    const paragraphKmIndex = Math.floor((level - 100) / kmTopics.length) % PARAGRAPHS_KM[kmTopic].length;

    en.push(PARAGRAPHS_EN[enTopic][paragraphEnIndex]);
    km.push(PARAGRAPHS_KM[kmTopic][paragraphKmIndex] || PROVERBS[level % PROVERBS.length]);

    // Add starter + sentence combo
    const starter = templatesEn.PARAGRAPH_STARTERS[level % templatesEn.PARAGRAPH_STARTERS.length];
    en.push(`${starter} ${fillTemplate(templatesEn.COMPLEX_TEMPLATES[0], templatesEn.TEMPLATE_DATA)}`);

    const starterKm = templatesKm.PARAGRAPH_STARTERS[level % templatesKm.PARAGRAPH_STARTERS.length];
    km.push(`${starterKm} ${fillTemplate(templatesKm.COMPLEX_TEMPLATES[0], templatesKm.TEMPLATE_DATA)}`);

    return { en, km };
}

// Main generator
function generateAllContent(): GeneratedContent {
    const lessons: LessonContent[] = [];

    for (let level = 0; level < 150; level++) {
        let content: { en: string[]; km: string[] };

        if (level < 10) {
            content = generateKeyboardBasics(level);
        } else if (level < 30) {
            content = generateSimpleSentences(level);
        } else if (level < 60) {
            content = generateMediumSentences(level);
        } else if (level < 100) {
            content = generateComplexSentences(level);
        } else {
            content = generateParagraphs(level);
        }

        lessons.push({
            level,
            en: content.en,
            km: content.km,
        });
    }

    return {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        lessons,
    };
}

// Run generator
console.log('🔄 Generating offline content for KOOMPI TYPING...\n');

const content = generateAllContent();

// Write output
const outputPath = path.join(__dirname, 'output', 'lessons.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(content, null, 2), 'utf-8');

console.log(`✅ Generated ${content.lessons.length} lessons`);
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
