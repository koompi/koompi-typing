/**
 * English Word Banks organized by category
 * Used for generating typing practice content
 */

// Common words by frequency (1000 most common)
export const COMMON_WORDS = [
    // Top 100 most frequent
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
];

// Home row practice words
export const HOME_ROW_WORDS = [
    'sad', 'dad', 'add', 'all', 'fall', 'hall', 'ask', 'lass', 'lass', 'flask',
    'salad', 'shall', 'klass', 'flash', 'slash', 'glass', 'lass', 'flag', 'glad',
];

// Top row practice words
export const TOP_ROW_WORDS = [
    'quit', 'wire', 'pier', 'type', 'rope', 'riot', 'route', 'power', 'tower',
    'query', 'quote', 'equip', 'quiet', 'write', 'poetry', 'tower', 'outer',
];

// Bottom row practice words
export const BOTTOM_ROW_WORDS = [
    'vex', 'box', 'mix', 'fix', 'buzz', 'maze', 'zone', 'zoom', 'move', 'civic',
    'vivid', 'mixer', 'boxer', 'zebra', 'cozy', 'fizzy', 'dizzy', 'fuzzy',
];

// Words by category
export const CATEGORIES = {
    greetings: [
        'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
        'goodbye', 'bye', 'see you', 'take care', 'welcome', 'nice to meet you',
    ],

    family: [
        'mother', 'father', 'sister', 'brother', 'parent', 'child', 'son', 'daughter',
        'grandmother', 'grandfather', 'aunt', 'uncle', 'cousin', 'nephew', 'niece',
        'husband', 'wife', 'family', 'relative', 'sibling',
    ],

    food: [
        'apple', 'banana', 'orange', 'rice', 'bread', 'meat', 'fish', 'chicken',
        'vegetable', 'fruit', 'water', 'coffee', 'tea', 'milk', 'juice', 'soup',
        'salad', 'egg', 'cheese', 'butter', 'sugar', 'salt', 'pepper', 'sauce',
    ],

    travel: [
        'airport', 'hotel', 'ticket', 'passport', 'luggage', 'station', 'bus', 'train',
        'airplane', 'car', 'taxi', 'map', 'tour', 'guide', 'beach', 'mountain',
        'city', 'country', 'border', 'visa', 'booking', 'reservation', 'flight',
    ],

    work: [
        'office', 'meeting', 'project', 'deadline', 'report', 'email', 'computer',
        'phone', 'desk', 'chair', 'boss', 'colleague', 'team', 'client', 'customer',
        'salary', 'job', 'career', 'interview', 'resume', 'company', 'business',
    ],

    nature: [
        'tree', 'flower', 'grass', 'river', 'ocean', 'mountain', 'forest', 'sky',
        'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'storm', 'earth',
        'animal', 'bird', 'fish', 'insect', 'plant', 'leaf', 'seed', 'garden',
    ],

    health: [
        'doctor', 'nurse', 'hospital', 'medicine', 'health', 'exercise', 'sleep',
        'food', 'water', 'rest', 'pain', 'fever', 'cold', 'cough', 'headache',
        'body', 'heart', 'brain', 'muscle', 'bone', 'blood', 'skin', 'healthy',
    ],

    emotions: [
        'happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'brave', 'scared',
        'proud', 'shy', 'surprised', 'confused', 'tired', 'energetic', 'hopeful',
        'worried', 'relaxed', 'stressed', 'love', 'hate', 'joy', 'fear', 'peace',
    ],

    technology: [
        'computer', 'phone', 'internet', 'website', 'software', 'hardware', 'app',
        'download', 'upload', 'cloud', 'data', 'file', 'folder', 'screen', 'keyboard',
        'mouse', 'laptop', 'tablet', 'camera', 'video', 'audio', 'digital', 'online',
    ],

    time: [
        'second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'morning',
        'afternoon', 'evening', 'night', 'today', 'tomorrow', 'yesterday', 'now',
        'later', 'soon', 'always', 'never', 'often', 'sometimes', 'early', 'late',
    ],

    numbers: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'twenty', 'thirty', 'fifty', 'hundred', 'thousand', 'million',
        'first', 'second', 'third', 'fourth', 'fifth', 'last', 'next', 'half', 'quarter',
    ],

    colors: [
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white',
        'gray', 'brown', 'gold', 'silver', 'dark', 'light', 'bright', 'colorful',
    ],

    adjectives: [
        'big', 'small', 'tall', 'short', 'long', 'wide', 'narrow', 'thick', 'thin',
        'heavy', 'light', 'fast', 'slow', 'hot', 'cold', 'warm', 'cool', 'new', 'old',
        'young', 'beautiful', 'ugly', 'clean', 'dirty', 'easy', 'hard', 'simple',
    ],

    verbs: [
        'run', 'walk', 'jump', 'swim', 'fly', 'eat', 'drink', 'sleep', 'wake', 'sit',
        'stand', 'read', 'write', 'speak', 'listen', 'watch', 'play', 'work', 'study',
        'learn', 'teach', 'help', 'love', 'like', 'want', 'need', 'have', 'give', 'take',
    ],
};

export type CategoryName = keyof typeof CATEGORIES;
