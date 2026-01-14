import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Language } from '../types';

export type Platform = 'linux' | 'macos' | 'windows' | 'web';

interface UseKhmerInputOptions {
    lang: Language;
    onCharacter: (char: string) => void;
    onBackspace: () => void;
    disabled?: boolean;
}

interface UseKhmerInputReturn {
    inputRef: React.RefObject<HTMLInputElement | null>;
    isComposing: boolean;
    platform: Platform;
    inputValue: string;
    handleInput: (e: React.FormEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleCompositionStart: () => void;
    handleCompositionEnd: (e: React.CompositionEvent<HTMLInputElement>) => void;
    focusInput: () => void;
    clearInput: () => void;
}

/**
 * Custom hook for handling Khmer (and English) keyboard input
 * with proper IME/composition support across platforms.
 * 
 * This is crucial for Linux where IBus/Fcitx compose multiple
 * keystrokes into single Khmer Unicode characters.
 */
export const useKhmerInput = ({
    lang,
    onCharacter,
    onBackspace,
    disabled = false,
}: UseKhmerInputOptions): UseKhmerInputReturn => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const lastProcessedLength = useRef(0);

    // Detect platform
    const platform = useMemo<Platform>(() => {
        if (typeof navigator === 'undefined') return 'web';

        const ua = navigator.userAgent.toLowerCase();
        const platform = (navigator as any).userAgentData?.platform?.toLowerCase() ||
            navigator.platform?.toLowerCase() || '';

        if (ua.includes('linux') || platform.includes('linux')) return 'linux';
        if (ua.includes('mac') || platform.includes('mac')) return 'macos';
        if (ua.includes('win') || platform.includes('win')) return 'windows';
        return 'web';
    }, []);

    // Determine if we need special composition handling
    // Linux + Khmer often requires waiting for IME to compose characters
    const needsCompositionHandling = useMemo(() => {
        return (platform === 'linux' || platform === 'web') && lang === 'km';
    }, [platform, lang]);

    // Focus the hidden input
    const focusInput = useCallback(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    // Clear input state
    const clearInput = useCallback(() => {
        setInputValue('');
        lastProcessedLength.current = 0;
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, []);

    // Handle composition start (IME begins composing)
    const handleCompositionStart = useCallback(() => {
        setIsComposing(true);
    }, []);

    // Handle composition end (IME finishes composing)
    const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
        setIsComposing(false);

        // The composed data contains the final character(s)
        const composedData = e.data;
        if (composedData) {
            // Process each character in the composed string
            for (const char of composedData) {
                onCharacter(char);
            }
        }

        // Clear input after processing
        setTimeout(() => {
            clearInput();
        }, 0);
    }, [onCharacter, clearInput]);

    // Handle direct input (non-composition)
    const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        if (disabled) return;

        const newValue = e.currentTarget.value;

        // If we're in composition mode, don't process yet
        if (isComposing) {
            setInputValue(newValue);
            return;
        }

        // Calculate what new characters were added
        const newChars = newValue.slice(lastProcessedLength.current);

        if (newChars.length > 0) {
            // Process each new character
            for (const char of newChars) {
                onCharacter(char);
            }
        }

        // Update tracking
        lastProcessedLength.current = newValue.length;
        setInputValue(newValue);

        // Clear input periodically to prevent overflow
        if (newValue.length > 100) {
            clearInput();
        }
    }, [disabled, isComposing, onCharacter, clearInput]);

    // Handle special keys (Backspace, etc.)
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        // Don't intercept during composition
        if (isComposing) return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            onBackspace();
            clearInput();
            return;
        }

        // Prevent default for space to avoid scrolling
        if (e.key === ' ') {
            e.preventDefault();
            // Handle Space implementation: 
            // KM Loop: Space -> ZWSP (u200B), Shift+Space -> ' ' (u0020)
            // EN Loop: Space -> ' '
            if (lang === 'km') {
                if (e.shiftKey) {
                    onCharacter(' ');
                } else {
                    onCharacter('\u200B'); // Zero Width Space
                }
            } else {
                onCharacter(' ');
            }
            clearInput();
            return;
        }

        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault();
            onCharacter('\n');
            clearInput();
            return;
        }
    }, [disabled, isComposing, onBackspace, onCharacter, clearInput]);

    // Auto-focus on mount and when language changes
    useEffect(() => {
        const timer = setTimeout(focusInput, 100);
        return () => clearTimeout(timer);
    }, [focusInput, lang]);

    // Re-focus when clicking anywhere in the document
    useEffect(() => {
        const handleClick = () => {
            if (!disabled) {
                focusInput();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [focusInput, disabled]);

    return {
        inputRef,
        isComposing,
        platform,
        inputValue,
        handleInput,
        handleKeyDown,
        handleCompositionStart,
        handleCompositionEnd,
        focusInput,
        clearInput,
    };
};

/**
 * Utility function to normalize Khmer text for comparison.
 * Handles differences in Unicode normalization between platforms.
 */
export const normalizeKhmerText = (text: string): string => {
    // Remove Zero Width Space (common in Khmer for line breaking)
    let normalized = text.replace(/[\u200B]/g, '');

    // Apply NFC normalization (canonical composition)
    normalized = normalized.normalize('NFC');

    // Collapse multiple spaces
    normalized = normalized.replace(/\s+/g, ' ');

    return normalized;
};

/**
 * Check if a character is a Khmer combining mark.
 * These need special handling as they attach to previous characters.
 */
export const isKhmerCombiningMark = (char: string): boolean => {
    if (!char || char.length !== 1) return false;
    const code = char.charCodeAt(0);

    // Khmer vowels (U+17B6-U+17C5)
    // Khmer signs (U+17C6-U+17D3)
    return code >= 0x17B6 && code <= 0x17D3;
};

/**
 * Get the display representation of a Khmer character.
 * Combining marks are shown with a dotted circle placeholder.
 */
export const getKhmerCharDisplay = (char: string): string => {
    if (isKhmerCombiningMark(char)) {
        return `◌${char}`;
    }
    return char;
};
