// Procedural Web Audio API Sound Generator & Synthwave BGM Engine for Cyber Clash
export class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.sfxGain = null;
        this.bgmGain = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.bgmStep = 0;
    }

    init() {
        if (this.ctx) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // --- SFX GENERATORS ---

    playThruster(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(75, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        if (panner) {
            panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(this.sfxGain);
        } else {
            osc.connect(gain);
            gain.connect(this.sfxGain);
        }

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playSlash(isHeavy = false, pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const duration = isHeavy ? 0.22 : 0.14;

        // Noise buffer for swoosh
        const bufferSize = Math.floor(this.ctx.sampleRate * duration);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isHeavy ? 1400 : 2200, now);
        filter.frequency.exponentialRampToValueAtTime(isHeavy ? 350 : 600, now + duration);
        filter.Q.setValueAtTime(3, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isHeavy ? 0.45 : 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(now);
    }

    playHit(isHeavy = false, pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Punchy sub-drop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isHeavy ? 200 : 280, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + (isHeavy ? 0.25 : 0.15));

        gain.gain.setValueAtTime(isHeavy ? 0.7 : 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.25 : 0.15));

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + (isHeavy ? 0.26 : 0.16));

        // Impact snap
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snap.type = 'square';
        snap.frequency.setValueAtTime(800, now);
        snap.frequency.exponentialRampToValueAtTime(80, now + 0.05);

        snapGain.gain.setValueAtTime(0.3, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        snap.connect(snapGain);
        snapGain.connect(this.sfxGain);
        snap.start(now);
        snap.stop(now + 0.06);
    }

    playLaser(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.16);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.17);
    }

    playParry(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Crystal chime parry (Harmonic ring)
        [1046.5, 1567.98, 2093.0, 3135.96].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.3 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now);
            osc.stop(now + 0.61);
        });
    }

    playClash(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Dual blade metal spark resonance
        const freqs = [620, 880, 1240, 1850];
        freqs.forEach(f => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(f, now);
            osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + 0.35);

            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(now);
            osc.stop(now + 0.36);
        });

        // Shockwave burst
        this.playHit(true, pan);
    }

    playWallBounce(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.23);
    }

    playBlink(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.13);
    }

    playEMP(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.41);
    }

    playUltimate(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // Big Sci-Fi Beam Charge & Fire
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
        osc.frequency.setValueAtTime(300, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.8);

        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.86);
    }

    playRoundStart() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        [220, 330, 440, 660].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.36);
        });
    }

    playKO() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 1.2);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 1.31);
    }

    playDeath(pan = 0) {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;

        // 1. Deep sub-bass boom
        this.playKO();

        // 2. High-frequency digital glass / shield shatter
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1800, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.sfxGain);
            noise.start(now);
        } catch (e) {}

        // 3. Descending cyber overload power-down tone
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.9);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now);
            osc.stop(now + 0.92);
        } catch (e) {}
    }

    // --- CYBERPUNK SYNTHWAVE PROCEDURAL BGM ---

    startBGM() {
        if (this.bgmPlaying || !this.ctx) return;
        this.bgmPlaying = true;
        this.bgmStep = 0;

        const bpm = 128;
        const stepTime = (60 / bpm) / 4; // 16th note

        // Synthwave Bassline progression: Em -> C -> D -> Bm
        const bassNotes = [
            41.2, 41.2, 41.2, 41.2, 41.2, 41.2, 82.4, 41.2, // E1
            32.7, 32.7, 32.7, 32.7, 32.7, 32.7, 65.4, 32.7, // C1
            36.7, 36.7, 36.7, 36.7, 36.7, 36.7, 73.4, 36.7, // D1
            30.8, 30.8, 30.8, 30.8, 30.8, 30.8, 61.7, 30.8  // B0
        ];

        const playTick = () => {
            if (!this.bgmPlaying || !this.ctx) return;
            const now = this.ctx.currentTime;
            const step16 = this.bgmStep % 32;

            // Kick drum on 1, 5, 9, 13 (Four-on-the-floor)
            if (this.bgmStep % 4 === 0) {
                const kick = this.ctx.createOscillator();
                const kickGain = this.ctx.createGain();
                kick.frequency.setValueAtTime(130, now);
                kick.frequency.exponentialRampToValueAtTime(35, now + 0.1);
                kickGain.gain.setValueAtTime(0.4, now);
                kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                kick.connect(kickGain);
                kickGain.connect(this.bgmGain);
                kick.start(now);
                kick.stop(now + 0.13);
            }

            // Snare on 5, 13
            if (this.bgmStep % 8 === 4) {
                const snareGain = this.ctx.createGain();
                snareGain.gain.setValueAtTime(0.18, now);
                snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
                const snareNoise = this.ctx.createBufferSource();
                snareNoise.buffer = buffer;
                snareNoise.connect(snareGain);
                snareGain.connect(this.bgmGain);
                snareNoise.start(now);
            }

            // Hihat on offbeats
            if (this.bgmStep % 2 === 1) {
                const hatGain = this.ctx.createGain();
                hatGain.gain.setValueAtTime(0.06, now);
                hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);
                const hat = this.ctx.createBufferSource();
                hat.buffer = buffer;
                hat.connect(hatGain);
                hatGain.connect(this.bgmGain);
                hat.start(now);
            }

            // Rolling Synth Bass
            const freq = bassNotes[step16];
            const bass = this.ctx.createOscillator();
            const bassFilter = this.ctx.createBiquadFilter();
            const bassGain = this.ctx.createGain();

            bass.type = 'sawtooth';
            bass.frequency.setValueAtTime(freq, now);

            bassFilter.type = 'lowpass';
            bassFilter.frequency.setValueAtTime(450, now);
            bassFilter.frequency.exponentialRampToValueAtTime(180, now + stepTime * 0.85);

            bassGain.gain.setValueAtTime(0.22, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepTime * 0.9);

            bass.connect(bassFilter);
            bassFilter.connect(bassGain);
            bassGain.connect(this.bgmGain);

            bass.start(now);
            bass.stop(now + stepTime);

            this.bgmStep++;
            this.bgmTimer = setTimeout(playTick, stepTime * 1000);
        };

        playTick();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

export const sound = new SoundEngine();
