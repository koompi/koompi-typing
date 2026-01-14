import { KeyData } from '../types';

// Helper to create standard key data
const k = (code: string, enN: string, enS: string, kmN: string, kmS: string, finger: any, width = 1): KeyData => ({
  code,
  label: enN.toUpperCase(),
  en: { normal: enN, shift: enS },
  km: { normal: kmN, shift: kmS },
  finger,
  width,
});

export const KEYBOARD_LAYOUT: KeyData[][] = [
  // Row 1 (Numbers)
  [
    k('Backquote', '`', '~', '«', '»', 'L-pinky'),
    k('Digit1', '1', '!', '១', '!', 'L-pinky'),
    k('Digit2', '2', '@', '២', 'ៗ', 'L-ring'),
    k('Digit3', '3', '#', '៣', '"', 'L-middle'),
    k('Digit4', '4', '$', '៤', '៛', 'L-index'),
    k('Digit5', '5', '%', '៥', '%', 'L-index'),
    k('Digit6', '6', '^', '៦', '៍', 'R-index'),
    k('Digit7', '7', '&', '៧', '័', 'R-index'),
    k('Digit8', '8', '*', '៨', '៏', 'R-middle'),
    k('Digit9', '9', '(', '៩', '(', 'R-ring'),
    k('Digit0', '0', ')', '០', ')', 'R-pinky'),
    k('Minus', '-', '_', 'ឥ', '៌', 'R-pinky'), // Corrected: Minus is ឥ (I), Shift is ៌ (Robat) on standard NiDA
    k('Equal', '=', '+', 'ឱ្យ', 'ឬ', 'R-pinky'), // Corrected: Equal is ឱ្យ (Aoy), Shift is ឬ (Reu)
    { code: 'Backspace', label: 'Backspace', en: { normal: 'Backspace', shift: 'Backspace' }, km: { normal: 'Backspace', shift: 'Backspace' }, finger: 'R-pinky', width: 2 }
  ],
  // Row 2 (Tab + QWERTY)
  [
    { code: 'Tab', label: 'Tab', en: { normal: 'Tab', shift: 'Tab' }, km: { normal: 'Tab', shift: 'Tab' }, finger: 'L-pinky', width: 1.5 },
    k('KeyQ', 'q', 'Q', 'ឆ', 'ឈ', 'L-pinky'),
    k('KeyW', 'w', 'W', 'ឹ', 'ឺ', 'L-ring'),
    k('KeyE', 'e', 'E', 'េ', 'ែ', 'L-middle'),
    k('KeyR', 'r', 'R', 'រ', 'ឫ', 'L-index'),
    k('KeyT', 't', 'T', 'ត', 'ទ', 'L-index'),
    k('KeyY', 'y', 'Y', 'យ', 'ួ', 'R-index'),
    k('KeyU', 'u', 'U', 'ុ', 'ូ', 'R-index'),
    k('KeyI', 'i', 'I', 'ិ', 'ី', 'R-middle'),
    k('KeyO', 'o', 'O', 'ោ', 'ៅ', 'R-ring'),
    k('KeyP', 'p', 'P', 'ផ', 'ភ', 'R-pinky'),
    k('BracketLeft', '[', '{', 'ៀ', 'ឿ', 'R-pinky'),
    k('BracketRight', ']', '}', 'ឪ', 'ឧ', 'R-pinky'),
    k('Backslash', '\\', '|', 'ឮ', 'ឭ', 'R-pinky', 1.5)
  ],
  // Row 3 (Caps + ASDF)
  [
    { code: 'CapsLock', label: 'Caps Lock', en: { normal: '', shift: '' }, km: { normal: '', shift: '' }, finger: 'L-pinky', width: 1.8 },
    k('KeyA', 'a', 'A', 'ា', 'ាំ', 'L-pinky'),
    k('KeyS', 's', 'S', 'ស', 'ៃ', 'L-ring'),
    k('KeyD', 'd', 'D', 'ដ', 'ឌ', 'L-middle'),
    k('KeyF', 'f', 'F', 'ថ', 'ធ', 'L-index'),
    k('KeyG', 'g', 'G', 'ង', 'អ', 'L-index'),
    k('KeyH', 'h', 'H', 'ហ', 'ះ', 'R-index'),
    k('KeyJ', 'j', 'J', '្', 'ញ', 'R-index'),
    k('KeyK', 'k', 'K', 'ក', 'គ', 'R-middle'),
    k('KeyL', 'l', 'L', 'ល', 'ឡ', 'R-ring'),
    k('Semicolon', ';', ':', 'ើ', 'េះ', 'R-pinky'),
    k('Quote', "'", '"', '់', '៉', 'R-pinky'),
    { code: 'Enter', label: 'Enter', en: { normal: '\n', shift: '\n' }, km: { normal: '\n', shift: '\n' }, finger: 'R-pinky', width: 2.2 }
  ],
  // Row 4 (Shift + ZXCV)
  [
    { code: 'ShiftLeft', label: 'Shift', en: { normal: 'Shift', shift: 'Shift' }, km: { normal: 'Shift', shift: 'Shift' }, finger: 'L-pinky', width: 2.3 },
    k('KeyZ', 'z', 'Z', 'ឋ', 'ឍ', 'L-pinky'),
    k('KeyX', 'x', 'X', 'ខ', 'ឃ', 'L-ring'),
    k('KeyC', 'c', 'C', 'ច', 'ជ', 'L-middle'),
    k('KeyV', 'v', 'V', 'វ', 'ព', 'L-index'),
    k('KeyB', 'b', 'B', 'ប', 'ប', 'L-index'),
    k('KeyN', 'n', 'N', 'ន', 'ណ', 'R-index'),
    k('KeyM', 'm', 'M', 'ម', 'ំ', 'R-index'),
    k('Comma', ',', '<', 'ុំ', '៖', 'R-middle'), // Corrected Comma: ុំ / ៖
    k('Period', '.', '>', '។', '៕', 'R-ring'),  // Corrected Period: ។ / ៕
    k('Slash', '/', '?', '៊', '?', 'R-pinky'),  // Slash: ៊ / ? (Question mark is Shift+Slash in NiDA)
    { code: 'ShiftRight', label: 'Shift', en: { normal: 'Shift', shift: 'Shift' }, km: { normal: 'Shift', shift: 'Shift' }, finger: 'R-pinky', width: 2.3 }
  ],
  // Row 5 (Space)
  [
     { code: 'Space', label: 'Space', en: { normal: ' ', shift: ' ' }, km: { normal: ' ', shift: ' ' }, finger: 'thumb', width: 6.2 }
  ]
];