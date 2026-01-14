import { useCallback, useEffect, useRef } from 'react';

export const useAudioSynth = (enabled: boolean) => {
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize Audio Context on demand interaction
    useEffect(() => {
        if (enabled && !audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        }
    }, [enabled]);

    const playThock = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const t = ctx.currentTime;

        // 1. "Thump" - Low frequency sine wave for body
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.08); // Pitch drop
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);

        // 2. "Click" - High frequency noise burst
        const noiseSize = ctx.sampleRate * 0.05; // 50ms noise
        const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < noiseSize; i++) {
            data[i] = Math.random() * 2 - 1; // White noise
        }

        const noiseParams = ctx.createBufferSource();
        noiseParams.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1500; // Muffled click
        const noiseGain = ctx.createGain();

        noiseGain.gain.setValueAtTime(0.3, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        noiseParams.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseParams.start(t);
    }, [enabled]);

    const playError = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const t = ctx.currentTime;

        // Buzz/Thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(50, t + 0.2);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
    }, [enabled]);

    const playSuccess = useCallback(() => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const t = ctx.currentTime;

        // Arpeggio
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const time = t + i * 0.08;
            gain.gain.setValueAtTime(0.0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(time);
            osc.stop(time + 0.5);
        });
    }, [enabled]);

    return { playThock, playError, playSuccess };
};

export const useMusicSynth = (enabled: boolean) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const bgmNodesRef = useRef<any[]>([]);
    const bgmIntervalRef = useRef<number | null>(null);

    // Initialize Context
    useEffect(() => {
        if (enabled && !audioContextRef.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                audioContextRef.current = new AudioContext();
            }
        }
    }, [enabled]);

    const stopMusic = useCallback(() => {
        if (bgmIntervalRef.current) {
            clearInterval(bgmIntervalRef.current);
            bgmIntervalRef.current = null;
        }
        bgmNodesRef.current.forEach(node => {
            try { node.stop(); } catch (e) { }
            try { node.disconnect(); } catch (e) { }
        });
        bgmNodesRef.current = [];
    }, []);

    const startMusic = useCallback((type: 'ambient' | 'boss') => {
        if (!enabled || !audioContextRef.current) return;
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        stopMusic(); // Clear existing

        const playNote = (freq: number, dur: number, vol: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const t = ctx.currentTime;

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + dur * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + dur);

            bgmNodesRef.current.push(osc);
            // Cleanup logic is complex, real implementation would monitor nodes. 
            // For simple loops, we mostly rely on stopMusic clearing the interval.
        };

        if (type === 'ambient') {
            // Calm, Spacey Drone
            // Play a long pad every 4 seconds
            const playPad = () => {
                const root = 261.63; // C4
                playNote(root, 6, 0.05, 'sine');
                playNote(root * 1.5, 7, 0.03, 'sine'); // G
                setTimeout(() => playNote(root * 1.25, 5, 0.03, 'sine'), 2000); // E
            };
            playPad();
            bgmIntervalRef.current = setInterval(playPad, 8000);

        } else if (type === 'boss') {
            // Tense, Rhythmic Bass
            const playBeat = () => {
                const t = ctx.currentTime;
                // Bass Pulse
                playNote(55, 0.2, 0.15, 'triangle'); // A1
                setTimeout(() => playNote(55, 0.2, 0.1, 'triangle'), 250);
                setTimeout(() => playNote(55, 0.2, 0.1, 'triangle'), 500);

                // High tension ping
                if (Math.random() > 0.5) {
                    setTimeout(() => playNote(880, 0.1, 0.02, 'sine'), 750);
                }
            };
            playBeat();
            bgmIntervalRef.current = setInterval(playBeat, 1000);
        }

    }, [enabled, stopMusic]);

    // Cleanup on unmount or disable
    useEffect(() => {
        if (!enabled) {
            stopMusic();
        }
        return () => {
            stopMusic();
        };
    }, [enabled, stopMusic]);

    return { startMusic, stopMusic };
};
