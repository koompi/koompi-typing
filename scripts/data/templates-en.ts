/**
 * English Sentence Templates
 * Placeholders: {subject}, {verb}, {object}, {adjective}, {place}, {time}
 */

// Simple sentence patterns (Levels 10-29)
export const SIMPLE_TEMPLATES = [
    // Subject + Verb
    '{subject} {verb}.',
    'The {noun} {verb}.',
    '{subject} can {verb}.',

    // Subject + Verb + Object
    '{subject} {verb} the {object}.',
    'I {verb} {object}.',
    'We {verb} {object} together.',

    // Subject + Be + Adjective
    'The {noun} is {adjective}.',
    '{subject} is very {adjective}.',
    'This is a {adjective} {noun}.',

    // Questions
    'Do you {verb}?',
    'Can you {verb} the {object}?',
    'Is this {adjective}?',
];

// Medium sentence patterns (Levels 30-59)
export const MEDIUM_TEMPLATES = [
    // With prepositions
    '{subject} {verb} {object} in the {place}.',
    'The {noun} is on the {place}.',
    '{subject} went to the {place} {time}.',

    // Compound sentences
    '{subject} {verb} and {verb}.',
    'The {noun} is {adjective} but {adjective}.',
    '{subject} {verb} because {reason}.',

    // With adjectives
    'The {adjective} {noun} {verb} {adverb}.',
    '{subject} has a {adjective} {noun}.',
    'I saw a {adjective} {noun} at the {place}.',

    // Time expressions
    '{subject} {verb} {object} every {time}.',
    '{time}, we {verb} {object}.',
    '{subject} will {verb} {time}.',
];

// Complex sentence patterns (Levels 60-99)
export const COMPLEX_TEMPLATES = [
    // Relative clauses
    'The {noun} that {verb} is {adjective}.',
    '{subject} who {verb} is my {relation}.',
    'This is the {place} where {subject} {verb}.',

    // Conditionals
    'If {subject} {verb}, {result}.',
    'When the {noun} {verb}, {subject} will {verb}.',
    '{subject} would {verb} if {condition}.',

    // Multiple clauses
    'Although {subject} {verb}, {contrast}.',
    '{subject} {verb} while {another_action}.',
    'Not only does {subject} {verb}, but also {additional}.',

    // Advanced structures
    'Having {past_participle} the {object}, {subject} {verb}.',
    '{subject} is known for {gerund} {object}.',
    'It is important that {subject} {verb}.',
];

// Paragraph starters (Levels 100-149)
export const PARAGRAPH_STARTERS = [
    'In the beginning,',
    'First of all,',
    'On the other hand,',
    'Furthermore,',
    'In conclusion,',
    'As a result,',
    'However,',
    'Therefore,',
    'For example,',
    'In addition,',
];

// Fill-in data for templates
export const TEMPLATE_DATA = {
    subject: ['I', 'You', 'He', 'She', 'We', 'They', 'The student', 'My friend'],
    verb: ['run', 'walk', 'eat', 'read', 'write', 'play', 'study', 'work', 'sleep', 'talk'],
    object: ['book', 'food', 'water', 'phone', 'computer', 'letter', 'music', 'game'],
    noun: ['cat', 'dog', 'bird', 'tree', 'house', 'car', 'phone', 'book', 'child', 'teacher'],
    adjective: ['big', 'small', 'fast', 'slow', 'beautiful', 'happy', 'sad', 'new', 'old', 'good'],
    adverb: ['quickly', 'slowly', 'carefully', 'quietly', 'loudly', 'well', 'badly'],
    place: ['school', 'home', 'office', 'park', 'market', 'hospital', 'library', 'beach'],
    time: ['today', 'tomorrow', 'yesterday', 'morning', 'evening', 'night', 'day', 'week'],
    relation: ['friend', 'teacher', 'parent', 'brother', 'sister', 'colleague', 'neighbor'],
    reason: ['it is important', 'we need it', 'it helps us', 'we like it'],
    result: ['we will be happy', 'it will work', 'everything will be fine'],
    condition: ['we had time', 'it was possible', 'we knew'],
    contrast: ['we still try', 'it works well', 'we succeed'],
    another_action: ['reading a book', 'listening to music', 'watching TV'],
    additional: ['helps others', 'learns new things', 'stays healthy'],
    past_participle: ['finished', 'completed', 'started', 'opened', 'closed'],
    gerund: ['teaching', 'learning', 'helping', 'building', 'creating'],
};
