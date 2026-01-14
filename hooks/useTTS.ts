import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const loadVoices = () => {
                const available = window.speechSynthesis.getVoices();
                setVoices(available);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speak = useCallback((text: string, lang: 'en' | 'km' = 'en') => {
        if (!supported) return;

        // Cancel current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Improve voice selection logic
        // For Khmer ('km'), look for specific locale or Google Khmer
        const targetLang = lang === 'km' ? 'km-KH' : 'en-US';

        let voice = voices.find(v => v.lang === targetLang);

        // Fallback for Khmer if exact match not found
        if (lang === 'km' && !voice) {
            voice = voices.find(v => v.name.includes("Khmer") || v.name.includes("Cambodia"));
        }

        // Fallback for English
        if (lang === 'en' && !voice) {
            voice = voices.find(v => v.lang.startsWith('en'));
        }

        if (voice) {
            utterance.voice = voice;
        } else if (lang === 'km') {
            console.warn("Khmer voice not found. TTS might not work for Khmer.");
        }

        utterance.lang = targetLang;
        utterance.rate = 0.9; // Slightly slower for clarity

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, voices]);

    const stop = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [supported]);

    return { speak, stop, speaking, supported };
};
