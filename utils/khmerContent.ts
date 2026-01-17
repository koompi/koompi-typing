// Khmer Content Library for KOOMPI TYPING
// Contains poems, articles, and cultural content for typing practice

export interface KhmerContent {
    id: string;
    title: string;
    text: string;
    category: 'poem' | 'article' | 'proverb' | 'story';
    difficulty: 'easy' | 'medium' | 'hard';
    source?: string;
}

// === KHMER POEMS (កំណាព្យខ្មែរ) ===
export const KHMER_POEMS: KhmerContent[] = [
    {
        id: 'poem_1',
        title: 'ស្នេហ៍ជាតិ',
        text: 'កម្ពុជាស្រុកខ្ញុំ មានប្រាសាទអង្គរ សត្វពេលិកាន ទន្លេមេគង្គ។ ខ្ញុំស្រលាញ់ជាតិ ស្រលាញ់ភូមិស្រុក ខ្ញុំស្រលាញ់មាតា បិតា និង បងប្អូន។',
        category: 'poem',
        difficulty: 'easy',
        source: 'បទចម្រៀងកុមារ'
    },
    {
        id: 'poem_2',
        title: 'ទន្លេសាប',
        text: 'ទន្លេសាបខ្មែរ បានចិញ្ចឹមប្រជាជន តាំងពីបុរាណ រហូតមកដល់សព្វថ្ងៃ។ ត្រីទឹកសាប ខ្យល់ព្រឹកព្រាល ស្រូវប្រាំង ស្រូវដើម ចំការផ្លែឈើ។',
        category: 'poem',
        difficulty: 'medium'
    },
    {
        id: 'poem_3',
        title: 'ព្រះអាទិត្យរះ',
        text: 'ព្រះអាទិត្យរះ នៅភាគខាងកើត ពន្លឺមាសរលាយ លើដីសុវណ្ណភូមិ។ សត្វបក្សីស្រែក ចាកដំណេក អាកាសថ្លា ខ្យល់ព្រឹកត្រជាក់។',
        category: 'poem',
        difficulty: 'medium'
    },
    {
        id: 'poem_4',
        title: 'អង្គរវត្ត',
        text: 'អង្គរវត្តមហា ប្រាសាទមរតក ដ៏អស្ចារ្យក្រៃលែង ពិភពស្ញាក់រំភើប។ ស្ថាបត្យកម្មខ្មែរ សព្វកាលល្បី ចម្លាក់សិល៍ថ្ម បុរាណវិថី។',
        category: 'poem',
        difficulty: 'hard'
    },
    {
        id: 'poem_5',
        title: 'និទាឃរដូវ',
        text: 'ប្រាំមួយខែក្តៅ ផ្កាកំពុងរីក បាយ៉ូមាន់រង់ កំពុងស្រែក។ ដើមឈើស្រស់ស្រាយ ស្លឹកខ្ចី ដីមានជីវិត អាកាសស្រស់។',
        category: 'poem',
        difficulty: 'easy'
    }
];

// === KHMER ARTICLES (អត្ថបទខ្មែរ) ===
export const KHMER_ARTICLES: KhmerContent[] = [
    {
        id: 'article_1',
        title: 'ប្រាសាទអង្គរ',
        text: 'ប្រាសាទអង្គរ គឺជាក្រុមប្រាសាទធំបំផុតមួយក្នុងពិភពលោក។ វាត្រូវបានសាងសង់ក្នុងសតវត្សទី១២ ដោយព្រះបាទសូរ្យវរ្ម័នទី២។ ប្រាសាទនេះមានផ្ទៃក្រឡា ១៦២ហិកតារ ហើយជារោងចក្រខ្មែរដ៏អស្ចារ្យ។',
        category: 'article',
        difficulty: 'medium',
        source: 'ប្រវត្តិសាស្ត្រ'
    },
    {
        id: 'article_2',
        title: 'វប្បធម៌ខ្មែរ',
        text: 'វប្បធម៌ខ្មែរ មានប្រវត្តិយូរលង់។ ប្រជាជនខ្មែរ មានទំនៀមទម្លាប់ល្អៗជាច្រើន ដូចជា ការគោរពចាស់ទុំ ការជួយគ្នាទៅវិញទៅមក និង ការរក្សាសុភមង្គល។ អក្សរខ្មែរ មានអក្សរសរសេរ២៣គូ និង ស្រៈ១៦។',
        category: 'article',
        difficulty: 'medium'
    },
    {
        id: 'article_3',
        title: 'បច្ចេកវិទ្យា និង ការអប់រំ',
        text: 'ក្នុងសម័យសព្វថ្ងៃ បច្ចេកវិទ្យា បានចូលរួមក្នុងការអប់រំយ៉ាងខ្លាំង។ សិស្សអាចរៀនតាមអ៊ីនធើណិត និង ប្រើកុំព្យូទ័រ ដើម្បីសិក្សា។ ការវាយអក្សរ គឺជាជំនាញដ៏សំខាន់សម្រាប់អនាគត។',
        category: 'article',
        difficulty: 'hard'
    },
    {
        id: 'article_4',
        title: 'ប្រពៃណីចូលឆ្នាំខ្មែរ',
        text: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ ប្រារព្ធធ្វើប្រចាំឆ្នាំ នៅកណ្តាលខែមេសា។ មានល្បែងប្រពៃណីផ្សេងៗ ដូចជា បោស្សទឹក ដាក់ភ្នំខ្សាច់ និង ចូលវត្តវិហារ។ គ្រួសារមកជួបជុំគ្នា និង រីករាយជាមួយគ org្កាន់។',
        category: 'article',
        difficulty: 'medium'
    },
    {
        id: 'article_5',
        title: 'ធម្មជាតិកម្ពុជា',
        text: 'កម្ពុជា មានធម្មជាតិស្រស់ស្អាត។ មានព្រៃឈើ ភ្នំ ទន្លេ និង សមុទ្រ។ សត្វព្រៃជាច្រើនប្រភេទ រស់នៅក្នុងព្រៃ ដូចជា ដំរី ខ្លា និង ពស់វែក។ យើងត្រូវការពារធម្មជាតិ។',
        category: 'article',
        difficulty: 'easy'
    }
];

// === KHMER PROVERBS (សុភាសិតខ្មែរ) ===
export const KHMER_PROVERBS: KhmerContent[] = [
    {
        id: 'proverb_1',
        title: 'សុភាសិត ១',
        text: 'ចេះអត់ធ្មត់មានដី។ ទឹកជ្រៅកុំនាំគេផឹក។',
        category: 'proverb',
        difficulty: 'easy'
    },
    {
        id: 'proverb_2',
        title: 'សុភាសិត ២',
        text: 'ប្រញាប់ប្រសើរ ជាងរញ់។ របស់ខ្ចីមិនមែនរបស់ខ្លួន។ ចង់បានឈើ ត្រូវចូលព្រៃ។',
        category: 'proverb',
        difficulty: 'easy'
    },
    {
        id: 'proverb_3',
        title: 'សុភាសិត ៣',
        text: 'អ្វីដែលដាំក៏ដុះ អ្វីដែលធ្វើក៏បាន។ ដើមណាដុះស្រួល ដើមអ្នកដូចមេអំបៅ។',
        category: 'proverb',
        difficulty: 'medium'
    },
    {
        id: 'proverb_4',
        title: 'សុភាសិត ៤',
        text: 'ចេកមួយភួង ចេកមួយសន្ទុះ។ អ្នកដើរមុន រើសជើងថ្មីមុន។ រៀនមិនច្រើន ប្រៀបដូចដំរីអង្គុយក្រោមស្មៅ។',
        category: 'proverb',
        difficulty: 'medium'
    },
    {
        id: 'proverb_5',
        title: 'សុភាសិត ៥',
        text: 'មាត់មានន້ முង្គ្រា។ មាស់ខ្មៅមិនថ្លា។ សកម្មភាពប្រសើរជាងពាក្យសម្តី។ អ្នកល្អរាប់រយ អ្នកអាក្រក់មានម្នាក់។',
        category: 'proverb',
        difficulty: 'hard'
    }
];

// === KHMER SHORT STORIES (រឿងខ្លីខ្មែរ) ===
export const KHMER_STORIES: KhmerContent[] = [
    {
        id: 'story_1',
        title: 'ទន្សាយនិងអណ្តើក',
        text: 'ទន្សាយមួយក្បាល និង អណ្តើកមួយក្បាល បានប្រកួតរត់គ្នា។ ទន org្សា់យ ដោយមើលងាយអណ្តើក បានសម្រាកដេកលក់។ អណ្តើកមានការតាំងចិត្តខ្លាំង បន្តដើរទៅមុខ រហូតដល់ទីបំផុត។',
        category: 'story',
        difficulty: 'easy'
    },
    {
        id: 'story_2',
        title: 'កុមារឧស្សាហ៍ព្យាយាម',
        text: 'កុមារម្នាក់ ឈ្មោះ សុផល រៀនសូត្រ និង វាយអក្សរ រាល់ org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org org ពេល រហូតបានជោគជ័យ។ គាត់បានក្លាយជាវិស្វករដ៏អស្ចារ្យម្នាក់។',
        category: 'story',
        difficulty: 'medium'
    }
];

// Combined content by category and difficulty
export const getAllKhmerContent = (): KhmerContent[] => {
    return [
        ...KHMER_POEMS,
        ...KHMER_ARTICLES,
        ...KHMER_PROVERBS,
        ...KHMER_STORIES
    ];
};

export const getKhmerContentByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): KhmerContent[] => {
    return getAllKhmerContent().filter(c => c.difficulty === difficulty);
};

export const getKhmerContentByCategory = (category: 'poem' | 'article' | 'proverb' | 'story'): KhmerContent[] => {
    return getAllKhmerContent().filter(c => c.category === category);
};

export const getRandomKhmerContent = (difficulty?: 'easy' | 'medium' | 'hard'): KhmerContent => {
    const pool = difficulty ? getKhmerContentByDifficulty(difficulty) : getAllKhmerContent();
    return pool[Math.floor(Math.random() * pool.length)];
};
