// Procedural sound effects using Web Audio API
// Shares AudioContext with Music module

const SFX = (() => {
    let ctx = null;
    let sfxGain = null;
    let muted = false;

    function init() {
        if (ctx) return;
        const audio = Music.getContext();
        ctx = audio.ctx;
        sfxGain = ctx.createGain();
        sfxGain.gain.value = 0.5;
        sfxGain.connect(audio.masterGain);
    }

    // --- Helpers ---

    function noise(time, duration, vol, highpass) {
        const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        const f = ctx.createBiquadFilter();
        f.type = 'highpass';
        f.frequency.value = highpass || 1000;
        src.connect(f);
        f.connect(g);
        g.connect(sfxGain);
        src.start(time);
        src.stop(time + duration);
    }

    function filteredNoise(time, duration, vol, filterType, freq, q) {
        const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        const f = ctx.createBiquadFilter();
        f.type = filterType;
        f.frequency.value = freq;
        if (q) f.Q.value = q;
        src.connect(f);
        f.connect(g);
        g.connect(sfxGain);
        src.start(time);
        src.stop(time + duration);
    }

    function sweep(time, freqStart, freqEnd, duration, vol, type) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freqStart, time);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, time + duration);
        g.gain.setValueAtTime(vol, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + duration);
    }

    function tone(time, freq, duration, vol, type) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(vol, time);
        g.gain.setValueAtTime(vol, time + duration - 0.01);
        g.gain.linearRampToValueAtTime(0, time + duration);
        osc.connect(g);
        g.connect(sfxGain);
        osc.start(time);
        osc.stop(time + duration);
    }

    // --- Weapon sounds ---

    function weapon(name) {
        init();
        if (muted || !ctx) return;
        const t = ctx.currentTime;

        switch (name) {
            case 'pistol':
                sweep(t, 800, 200, 0.06, 0.4, 'square');
                noise(t, 0.03, 0.3, 3000);
                break;

            case 'smg':
                sweep(t, 1000, 400, 0.04, 0.25, 'square');
                noise(t, 0.02, 0.2, 4000);
                break;

            case 'shotgun':
                sweep(t, 200, 50, 0.1, 0.5, 'sine');
                noise(t, 0.08, 0.5, 800);
                noise(t, 0.04, 0.3, 3000);
                break;

            case 'rifle':
                sweep(t, 1200, 300, 0.05, 0.35, 'square');
                noise(t, 0.04, 0.3, 4000);
                break;

            case 'railgun':
                sweep(t, 200, 2000, 0.08, 0.3, 'triangle');
                tone(t + 0.08, 2000, 0.03, 0.4, 'square');
                break;

            case 'minigun':
                tone(t, 600, 0.02, 0.2, 'square');
                break;

            case 'sniper':
                noise(t, 0.02, 0.5, 5000);
                sweep(t, 400, 80, 0.15, 0.4, 'sine');
                noise(t + 0.05, 0.08, 0.1, 3000);
                break;

            case 'flamethrower':
                filteredNoise(t, 0.06, 0.25, 'lowpass', 2000 + Math.random() * 500);
                sweep(t, 80 + Math.random() * 40, 60, 0.06, 0.1, 'sawtooth');
                break;

            case 'rocketlauncher':
                sweep(t, 100, 300, 0.1, 0.4, 'sine');
                noise(t, 0.08, 0.3, 500);
                break;

            case 'bomb':
                tone(t, 1500, 0.03, 0.3, 'square');
                noise(t, 0.01, 0.2, 8000);
                break;

            case 'sword':
                filteredNoise(t, 0.1, 0.35, 'bandpass', 1500, 2);
                break;

            case 'katana':
                filteredNoise(t, 0.06, 0.35, 'bandpass', 3000, 3);
                break;
        }
    }

    // --- Pickup sounds ---

    function pickup(type) {
        init();
        if (muted || !ctx) return;
        const t = ctx.currentTime;

        switch (type) {
            case 'health':
                tone(t, 523, 0.06, 0.25, 'triangle');        // C5
                tone(t + 0.07, 659, 0.1, 0.25, 'triangle');  // E5
                break;

            case 'ammo':
                tone(t, 2000, 0.02, 0.2, 'square');
                tone(t + 0.04, 1500, 0.02, 0.2, 'square');
                break;

            case 'scrap':
                noise(t, 0.02, 0.15, 6000);
                tone(t, 3000, 0.03, 0.15, 'sine');
                break;

            case 'coin':
                tone(t, 1200, 0.05, 0.25, 'sine');
                tone(t + 0.06, 1600, 0.08, 0.25, 'sine');
                break;

            case 'weapon':
                tone(t, 500, 0.03, 0.3, 'square');
                noise(t, 0.04, 0.2, 2000);
                tone(t + 0.05, 700, 0.05, 0.2, 'square');
                break;
        }
    }

    // --- Enemy shoot (subtle) ---

    function enemyShoot() {
        init();
        if (muted || !ctx) return;
        const t = ctx.currentTime;
        sweep(t, 500, 200, 0.04, 0.3, 'square');
        noise(t, 0.02, 0.2, 4000);
    }

    // --- Explosion ---

    function explosion() {
        init();
        if (muted || !ctx) return;
        const t = ctx.currentTime;

        sweep(t, 150, 20, 0.2, 0.5, 'sine');
        noise(t, 0.15, 0.4, 500);
        noise(t, 0.1, 0.25, 2000);
    }

    // --- Game over ---

    function gameOver() {
        init();
        if (muted || !ctx) return;
        const t = ctx.currentTime;
        // Descending doom tones
        sweep(t, 400, 100, 0.3, 0.4, 'square');
        sweep(t + 0.15, 300, 80, 0.3, 0.35, 'square');
        sweep(t + 0.35, 200, 40, 0.5, 0.5, 'sine');
        noise(t + 0.35, 0.2, 0.3, 800);
    }

    function setVolume(v) {
        if (sfxGain) sfxGain.gain.value = Math.max(0, Math.min(1, v));
    }

    function toggleMute() {
        muted = !muted;
        return muted;
    }

    function isMuted() { return muted; }

    return { weapon, pickup, explosion, enemyShoot, gameOver, setVolume, toggleMute, isMuted };
})();
