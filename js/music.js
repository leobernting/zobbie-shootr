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

    // ===== VOLCANO TRACK =====
    // D harmonic minor (D E F G A A# C#) — Mega Man melodic hooks x Iron Maiden gallop
    //
    // MELODY SEEDS — each expanded into a full flowing track:
    //   Seed A → Volcano (D harmonic minor) — ascending Wily hook
    //   Seed B → Jungle  (E Dorian)         — Trooper-style bright runs
    //   Seed C → Desert  (E Phrygian Dom.)  — exotic augmented-2nd leaps
    //   Seed D → Ice     (C harmonic minor) — cold relentless descent

    // --- Calm: Mega Man stage-select wistfulness ---
    // Flows as one continuous melody: P0→P1→P2→P3 then loops
    // P0 ends F3 → P1 starts E3 (step down)
    // P1 ends C#3 → P2 starts A3 (leap up, new energy)
    // P2 ends A3 → P3 starts F3 (step down)
    // P3 ends A3 → P0 starts D3 (4th down, perfect loop)
    const volcanoCalmMelodyPatterns = [
        // Bar 1: Opening — leap to 5th, gentle descent
        ['D3', null, null, null, 'A3', null, null, null,
         'G3', null, null, null, 'F3', null, null, null],
        // Bar 2: continues down — chromatic C# pull (→ sets up P2 leap)
        ['E3', null, null, null, 'F3', null, null, null,
         'E3', null, null, null, 'C#3', null, null, null],
        // Bar 3: soars up — octave leap, peak of the calm melody
        ['A3', null, null, null, 'D4', null, null, null,
         'C#4', null, null, null, 'A3', null, null, null],
        // Bar 4: resolve — descends warmly, lifts at end for loop
        ['F3', null, null, null, 'E3', null, null, null,
         'D3', null, null, null, 'A3', null, null, null],
    ];

    const volcanoCalmHarmonyPatterns = [
        // Pads flow: D → A# → F → D (iv-I-III-I)
        ['D3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A#2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['F3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['D3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    const volcanoCalmBassPatterns = [
        ['D2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A#1', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['F2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // --- Combat: one continuous flowing melody (Seed A expanded) ---
    // Plays like a guitar solo that keeps building across all 4 bars.
    // Trace the full line:
    //   P0: D4 D4 F4 G4 A4 A#4 A4 G4 F4 E4 →
    //   P1: F4 G4 A4 C#5 D5 C#5 A4 A#4 A4 G4 →
    //   P2: A4 A#4 A4 G4 A4 D5 C#5 A#4 A4 G4 →
    //   P3: A4 G4 F4 E4 F4 G4 F4 E4 C#4 D4 → (loops to D4)
    const volcanoMelodyPatterns = [
        // Bar 1: THE HOOK — ascending run, ends on E4
        ['D4', null, 'D4', 'F4', null, 'G4', 'A4', null,
         'A#4', null, 'A4', null, 'G4', 'F4', 'E4', null],
        // Bar 2: DEVELOPMENT — picks up from E4, climbs to D5 peak, cascades
        ['F4', null, 'G4', null, 'A4', null, 'C#5', null,
         'D5', null, 'C#5', 'A4', null, 'A#4', 'A4', 'G4'],
        // Bar 3: THE SOLO — ornamental turn, rockets to D5 again, descends
        ['A4', null, 'A#4', 'A4', 'G4', null, 'A4', null,
         'D5', null, 'C#5', null, 'A#4', null, 'A4', 'G4'],
        // Bar 4: RESOLUTION — stepwise descent, chromatic C#4→D4 loops back
        ['A4', null, 'G4', 'F4', 'E4', null, 'F4', null,
         'G4', null, 'F4', null, 'E4', null, 'C#4', 'D4'],
    ];

    // Harmony flows as twin-lead support — fills gaps in the melody
    const volcanoHarmonyPatterns = [
        // Bar 1: Thirds under the hook, breathing room
        [null, null, 'F3', null, null, null, 'F3', null,
         null, null, 'F3', null, null, 'A3', null, null],
        // Bar 2: Follows the climb, echoes the peak
        [null, null, null, null, 'F3', null, null, null,
         'A#3', null, 'A3', null, null, null, 'F3', null],
        // Bar 3: Rhythmic drive under the solo
        [null, 'F3', null, null, null, null, 'F3', null,
         null, null, 'A3', null, null, null, 'F3', null],
        // Bar 4: Descends with melody, resolves together
        [null, null, 'E3', null, null, null, 'A3', null,
         null, null, 'A3', null, null, null, 'F3', 'F3'],
    ];

    // Iron Maiden gallop bass (X . X X per beat) — harmonic journey under the solo
    const volcanoBassPatterns = [
        // Bar 1: Home base — D gallop with chromatic C# dip
        ['D2', null, 'D2', 'D2', 'D2', null, 'D2', 'D2',
         'C#2', null, 'C#2', 'C#2', 'D2', null, 'D2', 'D2'],
        // Bar 2: Ascending — D → F → G → A (tension builds with melody)
        ['D2', null, 'D2', 'D2', 'F2', null, 'F2', 'F2',
         'G2', null, 'G2', 'G2', 'A2', null, 'A2', 'A2'],
        // Bar 3: Descending — A → G → F → E (mirrors the solo's energy)
        ['A2', null, 'A2', 'A2', 'G2', null, 'G2', 'G2',
         'F2', null, 'F2', 'F2', 'E2', null, 'E2', 'E2'],
        // Bar 4: Resolution — cadence back to D (V→I feel)
        ['A2', null, 'A2', 'A2', 'A2', null, 'A2', 'A2',
         'A2', null, 'A2', 'A2', 'D2', null, 'D2', 'D2'],
    ];

    // Drums build intensity across bars, matching the melody's arc
    const volcanoDrumPatterns = [
        // Bar 1: Gallop groove — steady foundation
        ['K', 'H', 'H', 'K', 'S', 'H', 'H', 'K',
         'K', 'H', 'H', 'K', 'S', 'H', 'H', 'K'],
        // Bar 2: Gets busier — melody is climbing
        ['K', 'H', 'K', 'K', 'S', 'H', 'K', 'H',
         'K', 'H', 'K', 'K', 'S', 'H', 'K', 'H'],
        // Bar 3: Double-kick assault — peak energy under the solo
        ['K', 'K', 'H', 'K', 'S', 'K', 'K', 'H',
         'K', 'K', 'H', 'K', 'S', 'K', 'K', 'S'],
        // Bar 4: Resolving — pulls back slightly for the loop reset
        ['K', 'H', 'K', 'H', 'S', 'H', 'K', 'K',
         'K', 'H', 'H', 'K', 'S', 'S', 'K', 'S'],
    ];

    const volcanoTransitionDrumPattern =
        ['K', null, null, null, 'K', null, 'K', 'K',
         'K', 'K', 'S', 'K', 'S', 'S', 'K', 'S'];

    const volcanoArrangement = [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3, 0, 0, 1, 1, 2, 3, 2, 3];

    // ===== JUNGLE TRACK =====
    // E Dorian (E F# G A B C# D) — bouncy "da-DA, hold" motif, The Trooper energy
    // RHYTHMIC IDENTITY: short-short-LONG call-and-response. NOT scale runs.
    //
    // Calm echoes the motif: B-A-G-E → B-C#-B-A → G-A-B-C# → D-B-A-B
    const jungleCalmMelodyPatterns = [
        // Bar 1: The motif in slow motion — step down, hold
        ['B3', null, null, null, 'A3', null, null, null,
         'G3', null, null, null, 'E3', null, null, null],
        // Bar 2: Dorian C# color appears
        ['B3', null, null, null, 'C#4', null, null, null,
         'B3', null, null, null, 'A3', null, null, null],
        // Bar 3: Ascending — building brightness
        ['G3', null, null, null, 'A3', null, null, null,
         'B3', null, null, null, 'C#4', null, null, null],
        // Bar 4: Peak then resolve — D4 is the high point, ends on B for loop
        ['D4', null, null, null, 'B3', null, null, null,
         'A3', null, null, null, 'B3', null, null, null],
    ];

    const jungleCalmHarmonyPatterns = [
        ['G3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    const jungleCalmBassPatterns = [
        ['E2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['B2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // Combat: Mega Man / Tetris inspired — catchy hook that REPEATS, wide range
    // E Dorian (E F# G A B C# D) — range: E4 to E5 (full octave)
    // The hook (E5~B4~C#5-D5-B4~) repeats in bars 1-2 like Tetris/Wily Stage,
    // bar 3 develops it, bar 4 resolves and picks up back to the hook.
    //
    // Bar 1: E5~B4~ C#5-D5-B4~ | A4~~~E4~~~      (THE HOOK → octave drop)
    // Bar 2: E5~B4~ C#5-D5-B4~ | A4~B4~~~~       (HOOK REPEATS → stays up)
    // Bar 3: E5~D5-C#5-B4~ A4~ | G4~A4-B4-C#5~D5 (DEVELOPMENT — Dorian run)
    // Bar 4: B4~~~A4~~~G4~ A4~ | B4~~~~~D5-E5     (RESOLUTION → pickup to loop)
    const jungleMelodyPatterns = [
        // Bar 1: THE HOOK — catchy descending 4th, C#-D climb, octave drop to E4
        ['E5', null, 'B4', null, 'C#5', 'D5', 'B4', null,
         'A4', null, null, null, 'E4', null, null, null],
        // Bar 2: HOOK REPEATS — same phrase, different ending (stays high)
        ['E5', null, 'B4', null, 'C#5', 'D5', 'B4', null,
         'A4', null, 'B4', null, null, null, null, null],
        // Bar 3: DEVELOPMENT — descends through full Dorian, then climbs back
        ['E5', null, 'D5', 'C#5', 'B4', null, 'A4', null,
         'G4', null, 'A4', 'B4', 'C#5', null, 'D5', null],
        // Bar 4: RESOLUTION — held notes stepping down, pickup run to loop
        ['B4', null, null, null, 'A4', null, null, null,
         'G4', null, 'A4', null, 'B4', null, 'D5', 'E5'],
    ];

    // Harmony: sparse echoes — supports the hook, never competes
    const jungleHarmonyPatterns = [
        // Bar 1: G3 answer after the hook lands
        [null, null, null, null, null, null, null, null,
         'G3', null, null, null, null, null, null, null],
        // Bar 2: E3 root, G3 warmth under the held B
        [null, null, null, null, null, null, null, null,
         'E3', null, 'G3', null, null, null, null, null],
        // Bar 3: Dorian support under the run — A3 and G3
        [null, null, 'A3', null, null, null, 'G3', null,
         null, null, null, null, 'A3', null, null, null],
        // Bar 4: Gentle resolution, G3 ghost before pickup
        [null, null, null, null, 'G3', null, null, null,
         null, null, null, null, null, null, 'G3', 'G3'],
    ];

    // Gallop bass — simple roots, E pedal anchors most bars
    const jungleBassPatterns = [
        // Bar 1: E pedal — solid foundation under the hook
        ['E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2',
         'E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2'],
        // Bar 2: A lifts under the repeated hook, B at the end
        ['A2', null, 'A2', 'A2', 'A2', null, 'A2', 'A2',
         'A2', null, 'A2', 'A2', 'B2', null, 'B2', 'B2'],
        // Bar 3: E pedal — clean under the Dorian run
        ['E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2',
         'E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2'],
        // Bar 4: B dominant → E home (V→I)
        ['B2', null, 'B2', 'B2', 'B2', null, 'B2', 'B2',
         'E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2'],
    ];

    // Drums: tribal jungle groove — syncopated kicks like hand drums, NOT metal gallop
    // Snare on off-beats (step 8 instead of 4+12), kicks simulate congas
    const jungleDrumPatterns = [
        // Bar 1: Tribal groove — syncopated kicks, snare on beat 3
        ['K', null, null, 'K', null, 'K', null, null,
         'S', null, null, 'K', null, 'K', null, null],
        // Bar 2: Hi-hat creeps in, same tribal base
        ['K', null, null, 'K', null, 'K', 'H', null,
         'S', null, null, 'K', null, 'K', 'H', null],
        // Bar 3: Full tribal eruption — busy kicks under the development
        ['K', 'K', null, 'K', 'S', null, 'K', 'K',
         null, 'K', null, 'K', 'S', null, 'K', 'S'],
        // Bar 4: Sparse tribal wind-down, kick pickup at the end
        ['K', null, null, 'K', 'S', null, null, null,
         'K', null, null, null, 'K', null, 'K', 'K'],
    ];

    const jungleTransitionDrumPattern =
        ['K', null, null, null, 'K', null, 'S', null,
         'K', 'S', 'K', 'S', 'S', 'S', 'K', 'S'];

    const jungleArrangement = [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3, 0, 0, 1, 1, 2, 3, 2, 3];

    // ===== DESERT TRACK =====
    // E Phrygian Dominant (E F G# A B C D) — Seed C — Powerslave-era exotic
    // The augmented 2nd (F→G#) is unmistakably Middle Eastern — totally unique sound
    //
    // Calm flows: E-G#-A-B → C-B-A-G# → A-B-C-D → C-A-G#-B → (loop)
    const desertCalmMelodyPatterns = [
        // Bar 1: Opening — the exotic G# appears immediately
        ['E3', null, null, null, 'G#3', null, null, null,
         'A3', null, null, null, 'B3', null, null, null],
        // Bar 2: Descending — through the exotic tones
        ['C4', null, null, null, 'B3', null, null, null,
         'A3', null, null, null, 'G#3', null, null, null],
        // Bar 3: Lifts again
        ['A3', null, null, null, 'B3', null, null, null,
         'C4', null, null, null, 'D4', null, null, null],
        // Bar 4: Resolves with exotic pull, lifts for loop
        ['C4', null, null, null, 'A3', null, null, null,
         'G#3', null, null, null, 'B3', null, null, null],
    ];

    const desertCalmHarmonyPatterns = [
        ['B2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G#3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['E3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    const desertCalmBassPatterns = [
        ['E2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['A2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G#2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['B2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // Combat: one continuous flowing melody (Seed C in E Phrygian Dominant)
    // The F→G# augmented 2nd is the signature sound — exotic leaps throughout.
    // Full line: E-F-G#-A-G#-F-E-D-E-F → G#-A-B-C-B-A-G#-F-G#-A →
    //            B-C-B-A-G#-A-B-A-G#-F → G#-F-E-D-E-F-E-D-F-E → (loop)
    const desertMelodyPatterns = [
        // Bar 1: THE HOOK — the F→G# augmented 2nd leap is front and center
        ['E4', null, 'F4', 'G#4', null, 'A4', 'G#4', null,
         'F4', null, 'E4', null, 'D4', 'E4', 'F4', null],
        // Bar 2: DEVELOPMENT — peaks at C5, cascades with exotic G#
        ['G#4', null, 'A4', null, 'B4', null, 'C5', null,
         'B4', null, 'A4', 'G#4', null, 'F4', 'G#4', 'A4'],
        // Bar 3: THE SOLO — serpentine, ornamental, exotic runs
        ['B4', null, 'C5', 'B4', 'A4', null, 'G#4', null,
         'A4', null, 'B4', null, 'A4', null, 'G#4', 'F4'],
        // Bar 4: RESOLUTION — descends through G#-F, F-E resolves for loop
        ['G#4', null, 'F4', 'E4', 'D4', null, 'E4', null,
         'F4', null, 'E4', null, 'D4', null, 'F4', 'E4'],
    ];

    // Harmony featuring the exotic G# tone
    const desertHarmonyPatterns = [
        // Bar 1: G# stabs — exotic color
        [null, null, 'B3', null, null, null, 'G#3', null,
         null, null, 'B3', null, null, 'G#3', null, null],
        // Bar 2: Follows the peak
        [null, null, null, null, 'G#3', null, null, null,
         'B3', null, 'G#3', null, null, null, 'E3', null],
        // Bar 3: Supports the serpentine solo
        [null, 'G#3', null, null, null, null, 'B3', null,
         null, null, 'G#3', null, null, null, 'B3', null],
        // Bar 4: Resolves
        [null, null, 'B3', null, null, null, 'G#3', null,
         null, null, 'G#3', null, null, null, 'B3', 'B3'],
    ];

    // Gallop bass with exotic E-F and G# color
    const desertBassPatterns = [
        // Bar 1: E home gallop with Phrygian F dip
        ['E2', null, 'E2', 'E2', 'E2', null, 'E2', 'E2',
         'F2', null, 'F2', 'F2', 'E2', null, 'E2', 'E2'],
        // Bar 2: Ascending through exotic G#
        ['E2', null, 'E2', 'E2', 'G#2', null, 'G#2', 'G#2',
         'A2', null, 'A2', 'A2', 'B2', null, 'B2', 'B2'],
        // Bar 3: Descending through G# and Phrygian F
        ['A2', null, 'A2', 'A2', 'G#2', null, 'G#2', 'G#2',
         'F2', null, 'F2', 'F2', 'E2', null, 'E2', 'E2'],
        // Bar 4: Cadence — F→E→D→E
        ['F2', null, 'F2', 'F2', 'E2', null, 'E2', 'E2',
         'D2', null, 'D2', 'D2', 'E2', null, 'E2', 'E2'],
    ];

    // Gallop drums with desert spacing
    const desertDrumPatterns = [
        // Bar 1: Gallop groove — open desert feel
        ['K', 'H', 'H', 'K', 'S', 'H', 'H', 'K',
         'K', 'H', 'H', 'K', 'S', 'H', 'H', 'K'],
        // Bar 2: Fills in
        ['K', 'H', 'K', 'K', 'S', 'H', 'H', 'K',
         'K', 'H', 'K', 'K', 'S', 'H', 'K', 'H'],
        // Bar 3: Heat building
        ['K', 'K', 'H', 'K', 'S', 'H', 'K', 'H',
         'K', 'K', 'H', 'K', 'S', 'K', 'K', 'S'],
        // Bar 4: Resolving
        ['K', 'H', 'H', 'K', 'S', 'H', 'K', 'K',
         'K', 'H', 'H', 'K', 'S', 'S', 'K', 'H'],
    ];

    const desertTransitionDrumPattern =
        ['K', null, null, null, 'K', null, 'K', null,
         'S', null, 'K', 'S', 'S', 'S', 'K', 'S'];

    const desertArrangement = [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3, 0, 0, 1, 1, 2, 3, 2, 3];

    // ===== ICE TRACK =====
    // C harmonic minor (C D D# F G G# B) — cold, desolate, Hallowed Be Thy Name
    // RHYTHMIC IDENTITY: Stark frozen emptiness punctuated by sudden blizzard bursts.
    // Long held notes ring across the void, then rapid icy runs erupt.
    // NO gallop bass — slow ominous half-notes like a frozen heartbeat.
    // Completely different texture from every other track.
    //
    // Calm: ultra-sparse — one note per half-bar, frozen stillness
    const iceCalmMelodyPatterns = [
        // Bar 1: C rings across the void... then G answers far away
        ['C3', null, null, null, null, null, null, null,
         'G3', null, null, null, null, null, null, null],
        // Bar 2: F... then the icy D#
        ['F3', null, null, null, null, null, null, null,
         'D#3', null, null, null, null, null, null, null],
        // Bar 3: G# appears — the frozen augmented tone
        ['G#3', null, null, null, null, null, null, null,
         'G3', null, null, null, null, null, null, null],
        // Bar 4: D descends... C home — the cold returns
        ['D3', null, null, null, null, null, null, null,
         'C3', null, null, null, null, null, null, null],
    ];

    const iceCalmHarmonyPatterns = [
        // Ultra-sparse pads — one ghostly tone per bar
        ['D#3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['D#3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G3', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    const iceCalmBassPatterns = [
        ['C2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G#2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
        ['G2', null, null, null, null, null, null, null,
         null, null, null, null, null, null, null, null],
    ];

    // Combat: STARK + EXPLOSIVE — long frozen holds then sudden blizzard runs
    // This melody is the OPPOSITE of scale runs. Silence IS the instrument.
    //
    // Bar 1: G4 rings 6 steps...sudden F-D# fall...D holds...C holds (THE VOID)
    // Bar 2: G4 rings 6 steps...icy G#-G shimmer...F holds...D# holds (ICY SHIMMER)
    // Bar 3: B strikes, rapid G-G#-B gust, settles to F-D# (THE BLIZZARD)
    // Bar 4: F holds...D#-D ornament...long silence...B3→C4 resolve (DESOLATION)
    const iceMelodyPatterns = [
        // Bar 1: THE VOID — G4 rings across frozen emptiness, sudden descent
        ['G4', null, null, null, null, null, 'F4', 'D#4',
         'D4', null, null, null, 'C4', null, null, null],
        // Bar 2: ICY SHIMMER — same stark hold, G# color appears like frost
        ['G4', null, null, null, null, null, 'G#4', 'G4',
         'F4', null, null, null, 'D#4', null, null, null],
        // Bar 3: THE BLIZZARD — fast icy eruption shatters the stillness
        ['B4', null, 'G4', 'G#4', 'B4', null, 'G4', null,
         'F4', null, null, null, 'D#4', null, null, null],
        // Bar 4: DESOLATION — long holds, leading tone B3→C4 resolves for loop
        ['F4', null, null, null, 'D#4', null, 'D4', null,
         'D#4', null, null, null, null, null, 'B3', 'C4'],
    ];

    // Harmony: sparse echoes in the void — answers the melody's loneliness
    const iceHarmonyPatterns = [
        // Bar 1: Single D# echo after the melody's fall — lonely answer
        [null, null, null, null, null, null, null, null,
         'D#3', null, null, null, null, null, null, null],
        // Bar 2: G3 mirror under the shimmer
        [null, null, null, null, null, null, null, null,
         'G3', null, null, null, null, null, null, null],
        // Bar 3: More active under the blizzard — supports the eruption
        [null, null, 'D#3', null, null, null, 'G3', null,
         null, null, null, null, 'G3', null, null, null],
        // Bar 4: Ghost tone, then D# resolve
        [null, null, null, null, 'G3', null, null, null,
         null, null, null, null, null, null, 'D#3', 'D#3'],
    ];

    // Bass: NO gallop — slow ominous half-notes like a frozen heartbeat
    // This is what makes ice sound completely different from every other track
    const iceBassPatterns = [
        // Bar 1: C pedal — slow, deep, cold
        ['C2', null, null, null, null, null, null, null,
         'C2', null, null, null, null, null, null, null],
        // Bar 2: D# — minor darkness
        ['D#2', null, null, null, null, null, null, null,
         'D#2', null, null, null, null, null, null, null],
        // Bar 3: G supports the blizzard, F underneath
        ['G2', null, null, null, null, null, null, null,
         'F2', null, null, null, null, null, null, null],
        // Bar 4: G# tension → G → C resolution
        ['G#2', null, null, null, null, null, null, null,
         'G2', null, null, null, 'C2', null, null, null],
    ];

    // Drums: sparse and ominous — big hits with space, NOT gallop
    // Bars 1-2 match the melody's frozen stillness, bar 3 erupts with the blizzard
    const iceDrumPatterns = [
        // Bar 1: Sparse — kick and snare on downbeats only
        ['K', null, null, null, 'S', null, null, null,
         'K', null, null, null, 'S', null, null, null],
        // Bar 2: Hi-hat creeps in — tension building
        ['K', null, null, 'H', 'S', null, null, null,
         'K', null, null, 'H', 'S', null, null, null],
        // Bar 3: BLIZZARD ERUPTS — full assault matching the melody
        ['K', 'K', 'H', 'K', 'S', 'H', 'K', 'H',
         'K', 'K', 'H', 'K', 'S', 'K', 'K', 'S'],
        // Bar 4: Returns to sparse — desolate ending
        ['K', null, null, null, 'S', null, null, null,
         'K', null, null, null, 'S', null, 'K', 'K'],
    ];

    const iceTransitionDrumPattern =
        ['K', null, null, null, 'K', null, 'K', 'K',
         'K', 'S', 'K', 'S', 'S', 'S', 'K', 'S'];

    const iceArrangement = [0, 0, 1, 1, 2, 2, 3, 3, 0, 1, 2, 3, 0, 0, 1, 1, 2, 3, 2, 3];

    // ===== TRACK SYSTEM =====
    const tracks = {
        default: {
            calmMelody: calmMelodyPatterns,
            calmHarmony: calmHarmonyPatterns,
            calmBass: calmBassPatterns,
            melody: melodyPatterns,
            harmony: harmonyPatterns,
            bass: bassPatterns,
            drums: drumPatterns,
            transitionDrums: transitionDrumPattern,
            arrangement: arrangement
        },
        dungeon: {
            calmMelody: jungleCalmMelodyPatterns,
            calmHarmony: jungleCalmHarmonyPatterns,
            calmBass: jungleCalmBassPatterns,
            melody: jungleMelodyPatterns,
            harmony: jungleHarmonyPatterns,
            bass: jungleBassPatterns,
            drums: jungleDrumPatterns,
            transitionDrums: jungleTransitionDrumPattern,
            arrangement: jungleArrangement
        },
        jungle: {
            calmMelody: calmMelodyPatterns,
            calmHarmony: calmHarmonyPatterns,
            calmBass: calmBassPatterns,
            melody: melodyPatterns,
            harmony: harmonyPatterns,
            bass: bassPatterns,
            drums: drumPatterns,
            transitionDrums: transitionDrumPattern,
            arrangement: arrangement
        },
        desert: {
            calmMelody: desertCalmMelodyPatterns,
            calmHarmony: desertCalmHarmonyPatterns,
            calmBass: desertCalmBassPatterns,
            melody: desertMelodyPatterns,
            harmony: desertHarmonyPatterns,
            bass: desertBassPatterns,
            drums: desertDrumPatterns,
            transitionDrums: desertTransitionDrumPattern,
            arrangement: desertArrangement
        },
        ice: {
            calmMelody: iceCalmMelodyPatterns,
            calmHarmony: iceCalmHarmonyPatterns,
            calmBass: iceCalmBassPatterns,
            melody: iceMelodyPatterns,
            harmony: iceHarmonyPatterns,
            bass: iceBassPatterns,
            drums: iceDrumPatterns,
            transitionDrums: iceTransitionDrumPattern,
            arrangement: iceArrangement
        },
        volcano: {
            calmMelody: volcanoCalmMelodyPatterns,
            calmHarmony: volcanoCalmHarmonyPatterns,
            calmBass: volcanoCalmBassPatterns,
            melody: volcanoMelodyPatterns,
            harmony: volcanoHarmonyPatterns,
            bass: volcanoBassPatterns,
            drums: volcanoDrumPatterns,
            transitionDrums: volcanoTransitionDrumPattern,
            arrangement: volcanoArrangement
        }
    };

    let activeTrack = tracks.default;

    let currentBar = 0;
    let currentStep = 0;
    let nextNoteTime = 0;
    let schedulerTimer = null;
    const SCHEDULE_AHEAD = 0.1; // schedule 100ms ahead
    const SCHEDULER_INTERVAL = 25; // check every 25ms

    function scheduleStep(patternIdx, stepIdx, time) {
        const sLen = STEP_TIME;
        const t = activeTrack;
        const melPats = combatMode ? t.melody : t.calmMelody;
        const harmPats = combatMode ? t.harmony : t.calmHarmony;

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
        const bassPats = combatMode ? t.bass : t.calmBass;
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
                ? t.transitionDrums[stepIdx]
                : t.drums[patternIdx % t.drums.length][stepIdx];
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
            const arr = activeTrack.arrangement;
            const patternIdx = arr[currentBar % arr.length];
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

    function setTrack(name) {
        activeTrack = tracks[name] || tracks.default;
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

    // Dark fuzzy NES noise burst — enemy defeated
    function playEnemyDefeatSFX() {
        init();
        if (ctx.state === 'suspended') ctx.resume();
        if (muted) return;
        const t = ctx.currentTime;
        // Punchy low square wave — River City Ransom style "bwap"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.16);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(t);
        osc.stop(t + 0.18);
        // Sine sub-thump for gut punch weight
        const sub = ctx.createOscillator();
        const subGain = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(80, t);
        sub.frequency.exponentialRampToValueAtTime(20, t + 0.12);
        subGain.gain.setValueAtTime(0.45, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        sub.connect(subGain);
        subGain.connect(masterGain);
        sub.start(t);
        sub.stop(t + 0.15);
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

    return { play, stop, setVolume, toggleMute, isMuted, isPlaying, ensureContext, playVictoryJingle, playEnemyDefeatSFX, setDrums, setTrack, getContext };
})();
