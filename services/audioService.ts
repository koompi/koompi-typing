// Audio Service for KOOMPI TYPING
// Provides typing sounds, success jingles, and dynamic background music

type SoundProfile = 'clicky' | 'thocky' | 'silent';
type JingleType = 'level' | 'badge' | 'streak' | 'combo';

const STORAGE_KEY = 'koompi_audio_settings';

interface AudioSettings {
    soundProfile: SoundProfile;
    musicVolume: number;
    sfxVolume: number;
    enabled: boolean;
}

class AudioService {
    private settings: AudioSettings;
    private audioContext: AudioContext | null = null;
    private keystrokeSounds: Map<string, AudioBuffer[]> = new Map();
    private jingleSounds: Map<string, AudioBuffer> = new Map();
    private initialized = false;

    // Music State
    private musicNodes: AudioScheduledSourceNode[] = [];
    private musicGainNodes: GainNode[] = [];
    private musicPlaying = false;

    constructor() {
        this.settings = this.loadSettings();
    }

    private loadSettings(): AudioSettings {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch { }

        return {
            soundProfile: 'clicky',
            musicVolume: 0.3, // Lower default for background music
            sfxVolume: 0.7,
            enabled: true,
        };
    }

    saveSettings(settings: Partial<AudioSettings>) {
        this.settings = { ...this.settings, ...settings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));

        // Update active music volume
        if (this.musicPlaying && settings.musicVolume !== undefined) {
            this.restartMusic(); // Simple restart to apply volume
        }
    }

    getSettings(): AudioSettings {
        return { ...this.settings };
    }

    async initialize(): Promise<void> {
        if (this.initialized) return;

        try {
            this.audioContext = new AudioContext();
            await this.generateSynthSounds();
            this.initialized = true;
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    // --- MUSIC SYSTEM ---

    async startMusic(): Promise<void> {
        if (!this.settings.enabled || this.musicPlaying) return;
        if (!this.audioContext || !this.initialized) await this.initialize();
        if (!this.audioContext) return;

        // Resume context if needed
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.musicPlaying = true;

        const now = this.audioContext.currentTime;

        // Layer 1: Base Pad (Drone)
        this.createLayer(0, 'low', 110, 0.4); // A2

        // Layer 2: Rhythmic Pulse (Mid)
        this.createLayer(1, 'mid', 220, 0); // A3 (starts silent)

        // Layer 3: High Sparkle (High)
        this.createLayer(2, 'high', 440, 0); // A4 (starts silent)
    }

    private createLayer(index: number, type: 'low' | 'mid' | 'high', freq: number, startGain: number) {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.frequency.value = freq;

        if (type === 'low') {
            osc.type = 'sine';
        } else if (type === 'mid') {
            osc.type = 'triangle';
            // Add a simple LFO for rhythm if possible, or just steady tone for now
        } else {
            osc.type = 'sine';
        }

        // Connect to master volume gain
        const masterGain = this.settings.musicVolume;
        gain.gain.value = startGain * masterGain;

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();

        this.musicNodes[index] = osc;
        this.musicGainNodes[index] = gain;
    }

    setMusicIntensity(level: number): void {
        if (!this.musicPlaying || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        const rampTime = 2; // Smooth fade
        const masterVol = this.settings.musicVolume;

        // Layer 0 always on if music playing
        if (this.musicGainNodes[0]) {
            this.musicGainNodes[0].gain.setTargetAtTime(0.4 * masterVol, now, rampTime);
        }

        // Layer 1 (Mid) comes in at level 1 (Combo > 10)
        if (this.musicGainNodes[1]) {
            const target = level >= 1 ? 0.3 * masterVol : 0;
            this.musicGainNodes[1].gain.setTargetAtTime(target, now, rampTime);
        }

        // Layer 2 (High) comes in at level 2 (Combo > 30)
        if (this.musicGainNodes[2]) {
            const target = level >= 2 ? 0.2 * masterVol : 0;
            this.musicGainNodes[2].gain.setTargetAtTime(target, now, rampTime);
        }
    }

    stopMusic(): void {
        this.musicNodes.forEach(node => {
            try { node.stop(); } catch { }
        });
        this.musicNodes = [];
        this.musicGainNodes = [];
        this.musicPlaying = false;
    }

    private restartMusic() {
        if (this.musicPlaying) {
            this.stopMusic();
            this.startMusic();
        }
    }

    // --- SFX SYSTEM ---

    private async generateSynthSounds(): Promise<void> {
        if (!this.audioContext) return;

        // Clicky sounds
        const clickySounds: AudioBuffer[] = [];
        for (let i = 0; i < 3; i++) {
            clickySounds.push(this.createClickSound(0.1, 800 + i * 100, 0.05));
        }
        this.keystrokeSounds.set('clicky', clickySounds);

        // Thocky sounds
        const thockySounds: AudioBuffer[] = [];
        for (let i = 0; i < 3; i++) {
            thockySounds.push(this.createClickSound(0.15, 200 + i * 50, 0.08));
        }
        this.keystrokeSounds.set('thocky', thockySounds);

        // Error sound
        this.jingleSounds.set('error', this.createErrorSound());

        // Jingles
        this.jingleSounds.set('level', this.createJingle([523, 659, 784, 1046], 0.15));
        this.jingleSounds.set('combo', this.createJingle([440, 554], 0.1));
        this.jingleSounds.set('streak', this.createJingle([392, 494, 587, 784], 0.12));
    }

    private createClickSound(duration: number, freq: number, decay: number): AudioBuffer {
        const ctx = this.audioContext!;
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t / decay);
            const tone = Math.sin(2 * Math.PI * freq * t) * 0.3;
            const noise = (Math.random() * 2 - 1) * 0.2;
            data[i] = (tone + noise) * envelope;
        }
        return buffer;
    }

    private createErrorSound(): AudioBuffer {
        const ctx = this.audioContext!;
        const sampleRate = ctx.sampleRate;
        const length = Math.floor(sampleRate * 0.15);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t / 0.05);
            data[i] = (Math.sin(2 * Math.PI * 150 * t) + Math.sin(2 * Math.PI * 180 * t)) * 0.3 * envelope;
        }
        return buffer;
    }

    private createJingle(frequencies: number[], noteDuration: number): AudioBuffer {
        const ctx = this.audioContext!;
        const sampleRate = ctx.sampleRate;
        const totalDuration = frequencies.length * noteDuration;
        const length = Math.floor(sampleRate * totalDuration);
        const buffer = ctx.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        frequencies.forEach((freq, noteIndex) => {
            const noteStart = noteIndex * noteDuration;
            const noteStartSample = Math.floor(noteStart * sampleRate);
            const noteLength = Math.floor(noteDuration * sampleRate);

            for (let i = 0; i < noteLength; i++) {
                const t = i / sampleRate;
                const envelope = Math.exp(-t / (noteDuration * 0.8));
                const sample = Math.sin(2 * Math.PI * freq * t) * 0.4 * envelope;
                if (noteStartSample + i < length) {
                    data[noteStartSample + i] += sample;
                }
            }
        });

        return buffer;
    }

    playKeystroke(correct: boolean = true): void {
        if (!this.settings.enabled || this.settings.soundProfile === 'silent') return;
        if (!this.audioContext || !this.initialized) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        if (!correct) {
            const errorBuffer = this.jingleSounds.get('error');
            if (errorBuffer) this.playBuffer(errorBuffer, this.settings.sfxVolume * 0.5);
            return;
        }

        const sounds = this.keystrokeSounds.get(this.settings.soundProfile);
        if (sounds && sounds.length > 0) {
            const buffer = sounds[Math.floor(Math.random() * sounds.length)];
            this.playBuffer(buffer, this.settings.sfxVolume);
        }
    }

    playJingle(type: JingleType): void {
        if (!this.settings.enabled) return;
        if (!this.audioContext || !this.initialized) return;

        const buffer = this.jingleSounds.get(type);
        if (buffer) this.playBuffer(buffer, this.settings.sfxVolume);
    }

    private playBuffer(buffer: AudioBuffer, volume: number): void {
        if (!this.audioContext) return;
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.value = volume;
        source.start(0);
    }

    setSoundProfile(profile: SoundProfile): void {
        this.saveSettings({ soundProfile: profile });
    }

    setEnabled(enabled: boolean): void {
        this.saveSettings({ enabled });
        if (!enabled) this.stopMusic();
        else if (!this.musicPlaying) this.startMusic();
    }

    setSfxVolume(volume: number): void {
        this.saveSettings({ sfxVolume: Math.max(0, Math.min(1, volume)) });
    }
}

// Singleton instance
export const audioService = new AudioService();

// React hook
export const useAudio = () => {
    return {
        playKeystroke: (correct?: boolean) => audioService.playKeystroke(correct),
        playJingle: (type: JingleType) => audioService.playJingle(type),
        initialize: () => audioService.initialize(),
        getSettings: () => audioService.getSettings(),
        setSoundProfile: (p: SoundProfile) => audioService.setSoundProfile(p),
        setEnabled: (e: boolean) => audioService.setEnabled(e),
        setSfxVolume: (v: number) => audioService.setSfxVolume(v),

        // Music controls
        startMusic: () => audioService.startMusic(),
        stopMusic: () => audioService.stopMusic(),
        setMusicIntensity: (l: number) => audioService.setMusicIntensity(l),
    };
};
