import React, { useMemo, useRef, useState, useEffect } from 'react';
import { KEYBOARD_LAYOUT } from '../utils/keyboardData';
import { Language, KeyData, Finger } from '../types';

interface VirtualKeyboardProps {
  lang: Language;
  pressedKeys: Set<string>;
  nextKeyToType: string | null; // The character expected next
  isShiftActive: boolean;
}

// Helper to ensure Khmer combining characters are visible
const formatCharDisplay = (char: string, lang: Language): string => {
  if (lang === 'km') {
    // Check for combining marks (Vowels, Coeng, Diacritics)
    // Coeng (u17D2), Vowels (u17B6-u17C5), Signs (u17C6-u17D3)
    if (/[\u17B6-\u17D3]/.test(char)) {
      return `◌${char}`;
    }
  }
  return char;
};

// Calculate total width units for a row (standard key = 1 unit)
const getRowWidthUnits = (row: KeyData[]): number => {
  return row.reduce((sum, key) => sum + (key.width || 1), 0);
};

// Get max row width for scaling calculations
const MAX_ROW_WIDTH_UNITS = Math.max(...KEYBOARD_LAYOUT.map(getRowWidthUnits));

// Base key size in pixels - optimized for 12"-30" screens
const BASE_KEY_SIZE = 56; // Larger base size for better visibility
const KEY_GAP = 4; // Gap between keys

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  lang,
  pressedKeys,
  nextKeyToType,
  isShiftActive
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keySize, setKeySize] = useState(BASE_KEY_SIZE);

  // Calculate key size based on container width
  useEffect(() => {
    const updateKeySize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      // Calculate available width (subtract padding)
      const padding = 32;
      const totalGaps = (MAX_ROW_WIDTH_UNITS - 1) * KEY_GAP;
      const availableWidth = containerWidth - padding - totalGaps;

      // Calculate key size to fit container
      const calculatedSize = availableWidth / MAX_ROW_WIDTH_UNITS;

      // Clamp between reasonable sizes (44px min for touch, 64px max for aesthetics)
      const clampedSize = Math.min(64, Math.max(44, calculatedSize));
      setKeySize(clampedSize);
    };

    updateKeySize();
    window.addEventListener('resize', updateKeySize);
    return () => window.removeEventListener('resize', updateKeySize);
  }, []);

  // Helper to find which key produces the 'nextKeyToType'
  const targetKeyInfo = useMemo(() => {
    if (!nextKeyToType) return null;
    
    // Flatten layout
    for (const row of KEYBOARD_LAYOUT) {
      for (const key of row) {
        const charNormal = key[lang].normal;
        const charShift = key[lang].shift;
        
        if (charNormal === nextKeyToType) {
          return { code: key.code, shiftRequired: false, finger: key.finger };
        }
        if (charShift === nextKeyToType) {
          return { code: key.code, shiftRequired: true, finger: key.finger };
        }
      }
    }
    // Handle Enter separately
    if (nextKeyToType === '\n') {
       return { code: 'Enter', shiftRequired: false, finger: 'R-pinky' };
    }
    // Handle Space
    if (nextKeyToType === ' ') {
      return { code: 'Space', shiftRequired: false, finger: 'thumb' };
    }
    
    return null;
  }, [nextKeyToType, lang]);


  const getKeyStyles = (key: KeyData) => {
    const isPressed = pressedKeys.has(key.code);
    const isTarget = targetKeyInfo?.code === key.code;
    const isShiftKey = key.code === 'ShiftLeft' || key.code === 'ShiftRight';

    // Check if this key is a modifier that should be active for the target
    const isTargetShift = isShiftKey && targetKeyInfo?.shiftRequired;

    // Visual 'Active' state for Shift keys (when modifier is engaged by user or required)
    const isModifierActive = isShiftKey && isShiftActive;

    // Physical Keycap Base - removed fixed height, now set via inline style
    let base = "relative flex flex-col justify-center items-center rounded-[6px] transition-all duration-75 select-none overflow-hidden font-medium active:shadow-none";

    // Default: Light keycap on dark chassis
    // Using box-shadow for the 3D 'side' of the key to avoid layout shifts on press
    let appearance = "bg-slate-100 text-slate-700 shadow-[0_3px_0_0_#94a3b8] translate-y-0";

    if (isPressed) {
      // Pressed: Remove shadow (side), move down
      appearance = "bg-blue-500 text-white shadow-none translate-y-[3px]";
    } else if (isModifierActive) {
      // Sticky Modifier active
      appearance = "bg-indigo-500 text-white shadow-[0_2px_0_0_#4338ca] translate-y-[1px]";
    } else if (isTarget || isTargetShift) {
      // Guide highlight
      appearance = "bg-sky-400 text-white shadow-[0_3px_0_0_#0ea5e9] animate-pulse";
    }

    return `${base} ${appearance}`;
  };

  // Calculate derived sizes based on key size
  const keyHeight = keySize * 0.9; // Slightly shorter than wide
  const fontSize = Math.max(14, keySize * 0.35); // Primary character size
  const secondaryFontSize = Math.max(10, keySize * 0.22); // Secondary character size
  const specialKeyFontSize = Math.max(9, keySize * 0.18); // Special keys like Shift, Enter

  return (
    // Chassis: Dark Slate with depth - designed for 12"-30" screens
    <div
      ref={containerRef}
      className="relative p-3 md:p-4 rounded-xl bg-slate-800 shadow-2xl border-b-4 md:border-b-6 border-slate-900 w-full overflow-hidden"
    >
      <div className="flex flex-col items-center w-full">
        {KEYBOARD_LAYOUT.map((row, rIdx) => (
          <div
            key={rIdx}
            className="flex w-full justify-center"
            style={{ gap: `${KEY_GAP}px`, marginBottom: `${KEY_GAP}px` }}
          >
            {row.map((key) => {
              // Display Logic
              const primaryChar = isShiftActive ? key[lang].shift : key[lang].normal;
              const secondaryChar = isShiftActive ? key[lang].normal : key[lang].shift;

              const displayPrimary = formatCharDisplay(primaryChar, lang);
              const displaySecondary = formatCharDisplay(secondaryChar, lang);

              // Calculate width for this key
              const keyWidthUnits = key.width || 1;
              const keyWidth = keySize * keyWidthUnits + (keyWidthUnits > 1 ? (keyWidthUnits - 1) * KEY_GAP : 0);

              return (
                <div
                  key={key.code}
                  className={getKeyStyles(key)}
                  style={{
                    width: `${keyWidth}px`,
                    height: `${keyHeight}px`,
                  }}
                >
                  {/* Homing Bump (F & J) */}
                  {(key.code === 'KeyF' || key.code === 'KeyJ') && (
                    <div
                      className="absolute bottom-1.5 bg-current opacity-40 rounded-full"
                      style={{ width: `${Math.max(14, keySize * 0.35)}px`, height: '3px' }}
                    />
                  )}

                  {/* Secondary Char (Top Right) */}
                  {key.label.length === 1 && (
                    <span
                      className={`absolute top-1 right-1.5 opacity-50 font-mono leading-none ${lang === 'km' ? 'font-khmer' : ''}`}
                      style={{ fontSize: `${secondaryFontSize}px` }}
                    >
                      {displaySecondary}
                    </span>
                  )}

                  {/* Primary Char (Center) */}
                  <span
                    className={`font-bold leading-none ${lang === 'km' ? 'font-khmer' : ''}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {key.label.length > 1 ? (
                      // Special keys
                      <span
                        className="uppercase tracking-wider font-semibold"
                        style={{ fontSize: `${specialKeyFontSize}px` }}
                      >
                        {key.label}
                      </span>
                    ) : (
                      displayPrimary
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};