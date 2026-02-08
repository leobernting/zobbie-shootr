// Ambient particle effects per dungeon theme.

function spawnAmbientParticles() {
    if (G.gameState !== 'playing') return;
    var particles = G.particles;
    var W = G.W;
    var H = G.H;

    if (G.selectedDungeon === 'jungle') {
        // Falling leaves / pollen
        if (Math.random() < 0.03) {
            particles.push({
                x: Math.random() * W,
                y: 25,
                vx: (Math.random() - 0.5) * 0.5,
                vy: 0.3 + Math.random() * 0.3,
                life: 120,
                color: Math.random() > 0.5 ? '#4a9e40' : '#e8e850'
            });
        }
        // Fireflies
        if (Math.random() < 0.01) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * (H - 60),
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                life: 80,
                color: '#ccff44'
            });
        }
    } else if (G.selectedDungeon === 'desert') {
        // Blowing sand
        if (Math.random() < 0.04) {
            particles.push({
                x: 20,
                y: 30 + Math.random() * (H - 60),
                vx: 0.8 + Math.random() * 0.6,
                vy: (Math.random() - 0.5) * 0.2,
                life: 80,
                color: '#c4a35a'
            });
        }
        // Dust motes
        if (Math.random() < 0.02) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * (H - 60),
                vx: (Math.random() - 0.5) * 0.2,
                vy: -0.1 - Math.random() * 0.2,
                life: 60,
                color: '#a68b4b'
            });
        }
    } else if (G.selectedDungeon === 'ice') {
        // Snowflakes
        if (Math.random() < 0.05) {
            particles.push({
                x: Math.random() * W,
                y: 25,
                vx: (Math.random() - 0.5) * 0.4,
                vy: 0.2 + Math.random() * 0.4,
                life: 150,
                color: '#d4eef8'
            });
        }
        // Frost sparkle
        if (Math.random() < 0.01) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * (H - 60),
                vx: 0,
                vy: 0,
                life: 20,
                color: '#fff'
            });
        }
    } else if (G.selectedDungeon === 'volcano') {
        // Floating embers
        if (Math.random() < 0.04) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: H - 30,
                vx: (Math.random() - 0.5) * 0.5,
                vy: -0.5 - Math.random() * 0.8,
                life: 100,
                color: Math.random() > 0.5 ? '#ff4500' : '#ff8c00'
            });
        }
        // Smoke wisps
        if (Math.random() < 0.02) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * (H - 60),
                vx: (Math.random() - 0.5) * 0.15,
                vy: -0.2 - Math.random() * 0.2,
                life: 60,
                color: '#333'
            });
        }
    } else {
        // Dungeon dust motes
        if (Math.random() < 0.015) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * (H - 60),
                vx: (Math.random() - 0.5) * 0.1,
                vy: -0.05 - Math.random() * 0.1,
                life: 80,
                color: '#5a5a72'
            });
        }
        // Dripping water
        if (Math.random() < 0.005) {
            particles.push({
                x: 30 + Math.random() * (W - 60),
                y: 25,
                vx: 0,
                vy: 1.5,
                life: 30,
                color: '#4a4a8a'
            });
        }
    }
}
