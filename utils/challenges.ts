import { Challenge } from "../types";

export const CHALLENGES: Challenge[] = [
  {
    id: 'c_beginner_speed',
    title: 'Novice Sprinter',
    title_km: 'អ្នករត់ប្រណាំងដំបូង',
    description: 'Type a simple text maintaining at least 30 WPM.',
    description_km: 'វាយអត្ថបទសាមញ្ញដោយរក្សាល្បឿនយ៉ាងតិច ៣០ ពាក្យ/នាទី។',
    type: 'speed',
    difficulty: 'easy',
    criteria: {
      minWpm: 30,
      minAccuracy: 90
    }
  },
  {
    id: 'c_precision_master',
    title: 'Precision Master',
    title_km: 'អ្នកជំនាញសុក្រិតភាព',
    description: 'Complete a complex text with 100% accuracy.',
    description_km: 'បញ្ចប់អត្ថបទស្មុគស្មាញដោយមានភាពត្រឹមត្រូវ ១០០%។',
    type: 'accuracy',
    difficulty: 'hard',
    criteria: {
      minAccuracy: 100
    }
  },
  {
    id: 'c_minute_madness',
    title: 'Minute Madness',
    title_km: 'មួយនាទីដ៏រន្ធត់',
    description: 'Type as much as you can in 60 seconds.',
    description_km: 'វាយឱ្យបានច្រើនបំផុតតាមដែលអាចធ្វើទៅបានក្នុងរយៈពេល ៦០ វិនាទី។',
    type: 'endurance',
    difficulty: 'medium',
    criteria: {
      timeLimitSeconds: 60,
      minWpm: 40 // Minimum threshold to qualify for leaderboard
    }
  },
  {
    id: 'c_khmer_scholar',
    title: 'Khmer Scholar',
    title_km: 'អ្នកប្រាជ្ញខ្មែរ',
    description: 'Type a formal Khmer text with high accuracy.',
    description_km: 'វាយអត្ថបទខ្មែរផ្លូវការដោយមានភាពត្រឹមត្រូវខ្ពស់។',
    type: 'accuracy',
    difficulty: 'hard',
    criteria: {
      minAccuracy: 98,
      minWpm: 25
    }
  }
];