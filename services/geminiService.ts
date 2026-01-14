import { GoogleGenAI } from "@google/genai";
import { Difficulty, Language } from "../types";

// Safety check for API key access to prevent crashes in environments where process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("process.env.API_KEY access failed");
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const SYSTEM_PROMPT = `You are an assistant that generates typing practice text. 
Return ONLY plain text. No markdown formatting, no code blocks, no intro/outro.
Keep sentences grammatically correct.
For Khmer text, use spaces to separate phrases but DO NOT use Zero Width Spaces (U+200B).`;

export type ContentType = 'words' | 'sentences' | 'paragraph';

const OFFLINE_DATA = {
  en: {
    words: [
      "apple banana cat dog elephant fish grape house ice jump kite lion moon nest orange pencil queen rabbit sun tree umbrella violin water xylophone yellow zebra",
      "red blue green yellow orange purple black white pink brown gray silver gold violet indigo",
      "happy sad angry excited nervous calm brave shy proud loud quiet fast slow big small"
    ],
    sentences: [
      "The sun rises in the east and sets in the west. Birds sing in the morning.",
      "She loves to read books in the quiet library. It is her favorite place to be.",
      "The quick brown fox jumps over the lazy dog. This is a famous typing sentence.",
      "Coding is fun and useful. It helps us solve problems and build new things.",
      "Practice makes perfect. The more you type, the faster you will become."
    ],
    paragraph: [
      "Technology is changing the way we live. Computers are faster than ever before. We can communicate with people all over the world instantly. The internet has become an essential part of our daily lives, connecting us to information and each other.",
      "Nature is beautiful and full of surprises. Trees provide oxygen for us to breathe, and forests are home to many animals. Protecting our environment is important so that future generations can enjoy the beauty of the earth.",
      "Learning a new language opens many doors. It helps you understand different cultures and ways of thinking. It also exercises your brain and improves memory. Typing in a new language is a great way to learn spelling and grammar."
    ]
  },
  km: {
    words: [
      "កុក សេះ គោ មាន់ ទា ត្រី ផ្ទះ សាលា សៀវភៅ ប៊ិច ខ្មៅដៃ តុ កៅអី ទឹក ភ្លើង ដី ខ្យល់ ឈើ ផ្លែឈើ បាយ",
      "ក្រហម ខៀវ បៃតង លឿង ស្វាយ ខ្មៅ ស ផ្កាឈូក ត្នោត ប្រផេះ មាស ប្រាក់",
      "សប្បាយ ពិបាក ងាយស្រួល លឿន យឺត ធំ តូច ខ្ពស់ ទាប វែង ខ្លី"
    ],
    sentences: [
      "ខ្ញុំទៅសាលារៀនរាល់ថ្ងៃ។ ខ្ញុំចូលចិត្តរៀនអក្សរខ្មែរ។",
      "ម៉ាក់ខ្ញុំធ្វើម្ហូបឆ្ងាញ់ណាស់។ យើងញ៉ាំបាយជុំគ្រួសារយ៉ាងសប្បាយរីករាយ។",
      "កម្ពុជាគឺជាប្រទេសដ៏ស្រស់ស្អាត។ ប្រាសាទអង្គរវត្តគឺជាសម្បត្តិវប្បធម៌ពិភពលោក។",
      "ការខិតខំរៀនសូត្រនាំមកនូវជោគជ័យ។ ចំណេះវិជ្ជាគឺជាទ្រព្យធនដែលមិនអាចលួចបាន។",
      "យើងត្រូវចេះជួយគ្នាទៅវិញទៅមក។ សាមគ្គីភាពនាំមកនូវសន្តិភាពនិងការអភិវឌ្ឍ។"
    ],
    paragraph: [
      "ប្រទេសកម្ពុជាសម្បូរទៅដោយធនធានធម្មជាតិ។ ព្រៃឈើ និងទន្លេ គឺជាប្រភពជីវិតដ៏សំខាន់។ ប្រជាជនខ្មែរភាគច្រើនរស់នៅដោយពឹងផ្អែកលើកសិកម្ម និងការនេសាទ។ ការថែរក្សាបបរិស្ថានគឺជាកាតព្វកិច្ចរបស់យើងទាំងអស់គ្នា។",
      "ការអប់រំមានសារៈសំខាន់ណាស់សម្រាប់អនាគត។ កុមារគ្រប់រូបគួរតែទទួលបានការរៀនសូត្រនៅសាលា។ ការអានសៀវភៅជួយឱ្យយើងមានគំនិតថ្មីៗ និងយល់ដឹងពីពិភពលោកកាន់តែច្បាស់។",
      "វប្បធម៌ខ្មែរមានលក្ខណៈពិសេស និងគួរឱ្យកោតសរសើរ។ របាំអប្សរា និងល្ខោនស្បែកធំ គឺជាសិល្បៈដ៏មានតម្លៃ។ យើងត្រូវចូលរួមថែរក្សា និងផ្សព្វផ្សាយមរតកដូនតាឱ្យបានគង់វង្ស។"
    ]
  }
};

const getRandomOfflineText = (lang: Language, type: ContentType): string => {
  const dataset = OFFLINE_DATA[lang][type];
  return dataset[Math.floor(Math.random() * dataset.length)];
};

export const generatePracticeText = async (lang: Language, difficulty: Difficulty = 'medium'): Promise<string> => {
  try {
    let prompt = "";
    let type: ContentType = 'paragraph';

    if (lang === 'en') {
      switch (difficulty) {
        case 'easy':
          prompt = "Generate 3 simple, short sentences in English using common words for kids. No complex punctuation.";
          type = 'sentences';
          break;
        case 'hard':
          prompt = "Generate a complex paragraph in English about quantum physics or philosophy. Use advanced vocabulary, semicolons, and varied sentence structures. Approx 60 words.";
          type = 'paragraph';
          break;
        default: // medium
          prompt = "Generate a random interesting paragraph about technology or nature in English. Approx 40 words. Simple vocabulary.";
          type = 'paragraph';
      }
    } else {
      // Khmer
      switch (difficulty) {
        case 'easy':
          prompt = "Generate 3 very simple sentences in Khmer about family. Use basic vocabulary.";
          type = 'sentences';
          break;
        case 'hard':
          prompt = "Generate a complex formal paragraph in Khmer about history or law. Use formal language and complex subscripts. Approx 300 characters. Use visible spaces instead of zero-width spaces.";
          type = 'paragraph';
          break;
        default:
          prompt = "Generate a random interesting paragraph in Khmer about daily life or nature. Approx 200 characters. Use standard Khmer spelling. Use visible spaces.";
          type = 'paragraph';
      }
    }

    return await generateFromPrompt(prompt, lang, type);
  } catch (error) {
    console.warn("Gemini generation failed, falling back to offline data", error);
    // Use fallback type determined above, but if error happens early, default to paragraph
    return getRandomOfflineText(lang, 'paragraph');
  }
};

export const generateFromPrompt = async (prompt: string, lang: Language = 'en', fallbackType: ContentType = 'paragraph'): Promise<string> => {
  // Check online status first to save time
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return getRandomOfflineText(lang, fallbackType);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    // Clean up response
    let text = response.text || '';
    text = text.replace(/`/g, '').trim();

    // IMPORTANT FIX FOR KHMER: Replace Zero Width Space (U+200B) with regular space (U+0020)
    // ZWSP is common in Khmer for line breaking but invisible and hard to type in practice mode.
    text = text.replace(/[\u200B]/g, ' ');

    // Normalize spaces (collapse multiple spaces into one)
    text = text.replace(/\s+/g, ' ');

    // Ensure unicode normalization (NFC is generally safer for web comparison)
    text = text.normalize('NFC');

    if (text.length < 5) throw new Error("Generated text too short");

    return text;
  } catch (error) {
    console.warn("Gemini prompt generation failed or offline", error);
    return getRandomOfflineText(lang, fallbackType);
  }
};