/**
 * Khmer Sentence Templates
 * Structured for natural grammar flow
 */

export const TEMPLATE_DATA = {
    subject: ['ខ្ញុំ', 'គាត់', 'នាង', 'ពួកគេ', 'ម៉ាក់', 'ប៉ា', 'គ្រូ', 'សិស្ស', 'ពូ', 'មីង', 'តា', 'យាយ'],
    verb: ['ដើរ', 'រត់', 'ញ៉ាំ', 'ផឹក', 'អាន', 'សរសេរ', 'ទិញ', 'លក់', 'មើល', 'ស្តាប់', 'ទៅ', 'មក'],
    object: ['បាយ', 'ទឹក', 'សៀវភៅ', 'កាសែត', 'ប៊ិច', 'ឡាន', 'ផ្ទះ', 'ផ្លែឈើ', 'សំបុត្រ', 'កាហ្វេ'],
    place: ['ផ្សារ', 'សាលារៀន', 'ផ្ទះ', 'ការិយាល័យ', 'មន្ទីរពេទ្យ', 'ភ្នំពេញ', 'សួនច្បារ', 'បណ្ណាល័យ'],
    adjective: ['ធំ', 'តូច', 'ស្អាត', 'ល្អ', 'ឆ្ងាញ់', 'លឿន', 'យឺត', 'ថ្មី', 'ចាស់', 'សប្បាយ'],
    time: ['ព្រឹកនេះ', 'ថ្ងៃនេះ', 'ម្សិលមិញ', 'ឥឡូវនេះ', 'ថ្ងៃស្អែក', 'រាល់ថ្ងៃ', 'នៅពេលល្ងាច'],
    connector: ['និង', 'ព្រមទាំង', 'ប៉ុន្តែ', 'ឬ', 'ហើយ'],
};

// កម្រិតដំបូង (Simple) - 3-5 words
export const SIMPLE_TEMPLATES = [
    '{subject} {verb}។',                  // ខ្ញុំ ដើរ។
    '{subject} {verb} {object}។',         // គាត់ ញ៉ាំ បាយ។
    '{noun} នេះ {adjective}។',            // ផ្ទះ នេះ ធំ។
    '{subject} ជា {noun}។',               // គាត់ ជា គ្រូ។
    '{subject} ទៅ {place}។',              // ម៉ាក់ ទៅ ផ្សារ។
];

// កម្រិតមធ្យម (Medium) - 6-10 words
export const MEDIUM_TEMPLATES = [
    '{subject} {verb} {object} នៅ {place}។',              // គាត់ អាន សៀវភៅ នៅ បណ្ណាល័យ។
    '{time} {subject} {verb} {object}។',                  // ព្រឹកនេះ ខ្ញុំ ញ៉ាំ កាហ្វេ។
    '{subject} ចូលចិត្ត {object} និង {object}។',           // នាង ចូលចិត្ត ផ្លែប៉ោម និង ផ្លែក្រូច។
    '{subject} {verb} {adjective} ណាស់។',                 // ឡាន នេះ លឿន ណាស់។
    '{subject} មិន {verb} {object} ទេ។',                  // ខ្ញុំ មិន ផឹក ស្រា ទេ។
];

// កម្រិតខ្ពស់ (Complex) - 10+ words
export const COMPLEX_TEMPLATES = [
    'នៅ {place} មាន {object} {connector} {object} ជាច្រើន។',           // នៅ ផ្សារ មាន ត្រី និង បន្លែ ជាច្រើន។
    '{subject} {verb} {object} ដើម្បី {verb} {object} ទៀត។',           // គាត់ ខំរៀន សូត្រ ដើម្បី រក ការងារ ល្អ។
    'ប្រសិនបើ {subject} {verb} {object} {subject} នឹង {verb}។',        // ប្រសិនបើ អ្នក ខំរៀន អ្នក នឹង ចេះ។
    '{subject} បាន {verb} {object} នៅ {place} កាលពី {time}។',          // ម៉ាក់ បាន ទិញ ឡាន នៅ ភ្នំពេញ កាលពី ម្សិលមិញ។
    '{subject} និង {subject} ទៅ {place} ដើម្បី {verb} {object}។',      // ខ្ញុំ និង គាត់ ទៅ ផ្សារ ដើម្បី ទិញ ម្ហូប។
];

export const PARAGRAPH_STARTERS = [
    'កាលពី {time}',
    'នៅក្នុង {place}',
    'ជាធម្មតា {subject}',
    'នៅពេល {time}',
];
