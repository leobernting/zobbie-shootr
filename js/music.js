// NES-style music engine using Web Audio API
// Metal Gear Solid inspired stealth-action theme

const Music = (() => {
    let ctx = null;
    let masterGain = null;
    let playing = false;
    let currentTrack = null;
    let stepTimer = null;
    let step = 0;
    let muted = false;
    let drumsEnabled = true;

    const BPM = 140;
    const STEP_TIME = 60 / BPM / 4; // 16th note duration

    // NES had ~5 channels: 2 pulse, 1 triangle, 1 noise, 1 DPCM
    // We'll use: pulse1 (melody), pulse2 (harmony), triangle (bass), noise (drums)

    function init() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(ctx.destination);
    }

    // NES pulse wave via periodic wave (duty cycle approximation)
    function createPulseOsc(freq, duty, startTime, duration, volume, attack, release) {
        attack = attack || 0.005;
        release = release || 0.02;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Approximate NES pulse with harmonics
        const n = 32;
        const real = new Float32Array(n);
        const imag = new Float32Array(n);
        real[0] = 0;
        imag[0] = 0;
        for (let i = 1; i < n; i++) {
            imag[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
        }
        const wave = ctx.createPeriodicWave(real, imag);
        osc.setPeriodicWave(wave);
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + attack);
        gain.gain.setValueAtTime(volume, startTime + duration - release);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // Soft oscillator for calm/ambient passages
    function createSoftOsc(freq, startTime, duration, volume, attack, release, type) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + attack);
        gain.gain.setValueAtTime(volume, startTime + duration - release);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // NES triangle wave (bass)
    function createTriangleOsc(freq, startTime, duration, volume) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.setValueAtTime(volume, startTime + duration - 0.02);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    // NES noise channel (drums)
    function createNoise(startTime, duration, volume, highpass) {
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = highpass || 1000;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(startTime);
        source.stop(startTime + duration);
    }

    // Kick drum (low noise burst)
    function kick(startTime) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, startTime);
        osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.12);
        gain.gain.setValueAtTime(0.6, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
    }

    // Note name to frequency
    const NOTE_FREQ = {};
    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let oct = 0; oct <= 7; oct++) {
        for (let i = 0; i < 12; i++) {
            const noteNum = (oct + 1) * 12 + i; // MIDI number
            NOTE_FREQ[NOTES[i] + oct] = 440 * Math.pow(2, (noteNum - 69) / 12);
        }
    }

    // Music state: 'calm' → 'transition' → 'combat'
    let musicMode = 'calm';
    let combatMode = false;
    let pendingCombat = false;

    // --- TRACK DATA ---
    // Each pattern is 16 steps (one bar at 4/4 in 16th notes)
    // null = rest, string = note name

    // Key: E minor throughout

    // --- CALM / EXPLORATION PATTERNS ---
    // Legato melody with clear ascending/descending contour.
    // Notes are placed on a steady pulse (every 2-4 steps) so they
    // connect into singable phrases rather than isolated blips.

    const calmMelodyPatterns = [
        // Pattern 0: Hook — leap up, step down, repeat the landing
        ['E3', null, null, null, 'B3', null, null, null,
         'A3', null, null, null, 'B3', null, null, null],
        // Pattern 1: Answer — same hook, resolves downward
        ['E3', null, null, null, 'B3', null, null, null,
         'G3', null, null, null, 'E3', null, null, null],
        // Pattern 2: Lift — climbs from the middle
        ['A3', null, null, null, 'B3', null, null, null,
         'D4', null, null, null, 'E4', null, null, null],
        // Pattern 3: Release — falls back from the peak
        ['D4', null, null, null, 'B3', null, null, null,
         'A3', null, null, null, 'E3', null, null, null],
    ];

    const calmHarmonyPatterns = [
        // Sustained pad — one tone per half-bar
        ['E3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['B3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // Sparse bass for calm mode — one root note per bar
    const calmBassPatterns = [
        ['E2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // Transition drum fill - builds from sparse to driving
    const transitionDrumPattern =
        ['K', null, null, null, 'K', null, 'S', null,
         'K', 'S', 'K', 'S', 'S', 'S', 'K', 'S'];

    // --- ACTIVE / COMBAT PATTERNS ---
    // MGS-inspired stealth theme: dark, tense, minor key with driving rhythm

    const melodyPatterns = [
        // Pattern 0: Intro riff - tense creeping melody
        ['E4', null, 'E4', 'G4', null, 'F#4', 'E4', null,
         'D4', null, 'E4', null, 'B3', null, null, null],
        // Pattern 1: Rising tension
        ['E4', null, 'G4', null, 'A4', null, 'B4', null,
         'A4', null, 'G4', 'F#4', 'E4', null, null, null],
        // Pattern 2: Action phrase
        ['B4', null, 'B4', 'A4', null, 'G4', null, 'F#4',
         'E4', null, 'F#4', 'G4', 'A4', null, 'G4', null],
        // Pattern 3: Alert! Urgency
        ['E5', null, 'D5', null, 'B4', null, 'A4', null,
         'G4', 'F#4', 'E4', null, 'D4', null, 'E4', null],
    ];

    const harmonyPatterns = [
        // Pattern 0: Counter melody - off-beat stabs
        [null, null, 'B3', null, null, null, 'B3', null,
         null, null, 'A3', null, null, 'G3', null, null],
        // Pattern 1
        [null, null, 'B3', null, null, null, 'D4', null,
         null, null, 'C4', null, null, 'B3', null, null],
        // Pattern 2: Power chords feel
        [null, 'E3', null, null, 'E3', null, null, 'D3',
         null, null, 'D3', null, null, 'C3', null, null],
        // Pattern 3
        [null, 'G3', null, 'G3', null, null, 'F#3', null,
         null, 'E3', null, null, 'D3', null, null, 'E3'],
    ];

    const bassPatterns = [
        // Pattern 0: Driving eighth-note bass
        ['E2', null, 'E2', null, 'E2', null, 'E2', null,
         'D2', null, 'D2', null, 'E2', null, 'E2', null],
        // Pattern 1
        ['E2', null, 'E2', null, 'G2', null, 'G2', null,
         'A2', null, 'A2', null, 'B2', null, 'B2', null],
        // Pattern 2
        ['E2', null, 'E2', null, 'D2', null, 'D2', null,
         'C2', null, 'C2', null, 'D2', null, 'D2', null],
        // Pattern 3
        ['E2', null, 'E2', 'E2', 'G2', null, 'F#2', null,
         'E2', null, 'D2', null, 'C2', null, 'E2', null],
    ];

    // Drum patterns: K=kick, H=hihat, S=snare
    const drumPatterns = [
        // Pattern 0: Standard stealth groove
        ['K', 'H', null, 'H', 'S', 'H', null, 'H',
         'K', 'H', 'K', 'H', 'S', 'H', null, 'H'],
        // Pattern 1: Busier
        ['K', 'H', 'H', 'H', 'S', 'H', 'K', 'H',
         'K', 'H', 'H', 'H', 'S', 'H', 'H', 'H'],
        // Pattern 2: Action beat
        ['K', 'H', 'K', 'H', 'S', 'H', 'K', 'H',
         'K', 'K', 'H', 'H', 'S', 'H', 'K', 'S'],
        // Pattern 3: Intense
        ['K', 'K', 'H', 'K', 'S', 'H', 'K', 'H',
         'K', 'K', 'H', 'K', 'S', 'S', 'K', 'S'],
    ];

    // Song arrangement: which pattern index to play per bar
    const arrangement = [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3, 0, 0, 1, 1, 2, 3, 2, 3];

    let currentBar = 0;
    let currentStep = 0;
    let nextNoteTime = 0;
    let schedulerTimer = null;
    const SCHEDULE_AHEAD = 0.1; // schedule 100ms ahead
    const SCHEDULER_INTERVAL = 25; // check every 25ms

    function scheduleStep(patternIdx, stepIdx, time) {
        const sLen = STEP_TIME;
        const melPats = combatMode ? melodyPatterns : calmMelodyPatterns;
        const harmPats = combatMode ? harmonyPatterns : calmHarmonyPatterns;

        // Melody (pulse1) - soft sine during calm, punchy pulse during combat
        const melNote = melPats[patternIdx % melPats.length][stepIdx];
        if (melNote && NOTE_FREQ[melNote]) {
            if (combatMode) {
                createPulseOsc(NOTE_FREQ[melNote], 0.5, time, sLen * 0.9, 0.25);
            } else {
                // Triangle wave — warmer than sine, clearer presence
                createSoftOsc(NOTE_FREQ[melNote], time, sLen * 5, 0.22, 0.04, 0.15, 'triangle');
            }
        }

        // Harmony (pulse2) - sine pads during calm
        const harmNote = harmPats[patternIdx % harmPats.length][stepIdx];
        if (harmNote && NOTE_FREQ[harmNote]) {
            if (combatMode) {
                createPulseOsc(NOTE_FREQ[harmNote], 0.25, time, sLen * 0.9, 0.15);
            } else {
                // Very long sine pad, slowest envelope
                createSoftOsc(NOTE_FREQ[harmNote], time, sLen * 7, 0.1, 0.12, 0.3);
            }
        }

        // Bass (triangle) - sparse calm bass vs driving combat bass
        const bassPats = combatMode ? bassPatterns : calmBassPatterns;
        const bassNote = bassPats[patternIdx % bassPats.length][stepIdx];
        if (bassNote && NOTE_FREQ[bassNote]) {
            if (combatMode) {
                createTriangleOsc(NOTE_FREQ[bassNote], time, sLen * 0.9, 0.35);
            } else {
                createTriangleOsc(NOTE_FREQ[bassNote], time, sLen * 7, 0.2);
            }
        }

        // Drums - silent during calm, fill during transition, full during combat
        if (drumsEnabled) {
            const drum = musicMode === 'transition'
                ? transitionDrumPattern[stepIdx]
                : drumPatterns[patternIdx % drumPatterns.length][stepIdx];
            if (drum === 'K') {
                kick(time);
            } else if (drum === 'S') {
                createNoise(time, 0.1, 0.3, 2000);
            } else if (drum === 'H') {
                createNoise(time, 0.05, 0.1, 6000);
            }
        }
    }

    function scheduler() {
        while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
            const patternIdx = arrangement[currentBar % arrangement.length];
            scheduleStep(patternIdx, currentStep, nextNoteTime);
            nextNoteTime += STEP_TIME;
            currentStep++;
            if (currentStep >= 16) {
                currentStep = 0;
                currentBar++;
                // State machine: calm → transition (drum fill) → combat
                if (pendingCombat && musicMode === 'calm') {
                    musicMode = 'transition';
                    drumsEnabled = true;
                } else if (musicMode === 'transition') {
                    musicMode = 'combat';
                    combatMode = true;
                    pendingCombat = false;
                    currentBar = 0; // active melody starts from the beginning
                }
            }
        }
    }

    function play(track) {
        init();
        if (ctx.state === 'suspended') ctx.resume();
        if (playing) return;
        playing = true;
        currentBar = 0;
        currentStep = 0;
        nextNoteTime = ctx.currentTime + 0.05;
        if (muted) {
            masterGain.gain.value = 0;
        }
        schedulerTimer = setInterval(scheduler, SCHEDULER_INTERVAL);
    }

    function stop() {
        playing = false;
        if (schedulerTimer) {
            clearInterval(schedulerTimer);
            schedulerTimer = null;
        }
    }

    function setVolume(v) {
        if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, v));
    }

    function toggleMute() {
        init();
        muted = !muted;
        if (masterGain) {
            masterGain.gain.value = muted ? 0 : 0.3;
        }
        return muted;
    }

    function isMuted() {
        return muted;
    }

    function isPlaying() {
        return playing;
    }

    // Victory jingle - Sonic-style bouncy completion fanfare
    function playVictoryJingle() {
        init();
        if (ctx.state === 'suspended') ctx.resume();
        if (muted) return;

        const t = ctx.currentTime + 0.05;
        const s = 0.1; // step size

        // Bouncy call-and-response melody in G major
        // da-da-da-DUM, da-da-da-DUM-DUM!
        const melody = [
            { n: 'D5',  t: 0,       d: s * 0.7 },
            { n: 'D5',  t: s,       d: s * 0.7 },
            { n: 'D5',  t: s * 2,   d: s * 0.7 },
            { n: 'G5',  t: s * 3,   d: s * 2.5 },
            // pause, then answer phrase
            { n: 'F#5', t: s * 6,   d: s * 0.7 },
            { n: 'G5',  t: s * 7,   d: s * 0.7 },
            { n: 'A5',  t: s * 8,   d: s * 0.7 },
            { n: 'B5',  t: s * 9,   d: s * 2 },
            // final resolve
            { n: 'A5',  t: s * 11,  d: s * 0.7 },
            { n: 'B5',  t: s * 12,  d: s * 4 },
        ];

        // Harmony - parallel thirds/sixths
        const harmony = [
            { n: 'B4',  t: 0,       d: s * 0.7 },
            { n: 'B4',  t: s,       d: s * 0.7 },
            { n: 'B4',  t: s * 2,   d: s * 0.7 },
            { n: 'D5',  t: s * 3,   d: s * 2.5 },
            { n: 'D5',  t: s * 6,   d: s * 0.7 },
            { n: 'E5',  t: s * 7,   d: s * 0.7 },
            { n: 'F#5', t: s * 8,   d: s * 0.7 },
            { n: 'G5',  t: s * 9,   d: s * 2 },
            { n: 'F#5', t: s * 11,  d: s * 0.7 },
            { n: 'G5',  t: s * 12,  d: s * 4 },
        ];

        // Bass - root notes on the hits
        const bass = [
            { n: 'G2',  t: 0,       d: s * 3 },
            { n: 'G3',  t: s * 3,   d: s * 2.5 },
            { n: 'D3',  t: s * 6,   d: s * 3 },
            { n: 'G3',  t: s * 9,   d: s * 2 },
            { n: 'G3',  t: s * 12,  d: s * 4 },
        ];

        for (const note of melody) {
            if (NOTE_FREQ[note.n]) {
                createPulseOsc(NOTE_FREQ[note.n], 0.5, t + note.t, note.d, 0.18);
            }
        }

        for (const note of harmony) {
            if (NOTE_FREQ[note.n]) {
                createPulseOsc(NOTE_FREQ[note.n], 0.25, t + note.t, note.d, 0.1);
            }
        }

        for (const note of bass) {
            if (NOTE_FREQ[note.n]) {
                createTriangleOsc(NOTE_FREQ[note.n], t + note.t, note.d, 0.2);
            }
        }

        // Snappy drums on the big hits
        kick(t + s * 3);
        createNoise(t + s * 3, 0.08, 0.15, 3000);
        kick(t + s * 9);
        createNoise(t + s * 9, 0.08, 0.15, 3000);
        kick(t + s * 12);
        createNoise(t + s * 12, 0.1, 0.18, 2500);
    }

    function setDrums(enabled) {
        if (enabled) {
            pendingCombat = true; // triggers calm → transition → combat
        } else {
            drumsEnabled = false;
            combatMode = false;
            pendingCombat = false;
            musicMode = 'calm';
        }
    }

    // Ensure AudioContext is resumed on user interaction (mobile requirement)
    function ensureContext() {
        init();
        if (ctx.state === 'suspended') ctx.resume();
    }

    function getContext() {
        init();
        return { ctx, masterGain };
    }

    return { play, stop, setVolume, toggleMute, isMuted, isPlaying, ensureContext, playVictoryJingle, setDrums, getContext };
})();
