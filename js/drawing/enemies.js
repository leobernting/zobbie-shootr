// Enemy sprite rendering per dungeon theme and type.

function drawEnemy(enemy) {
    var ctx = G.ctx;
    var COLORS = G.COLORS;

    const cx = enemy.x;
    const cy = enemy.y;
    const type = G.ENEMY_TYPES[enemy.type] || G.ENEMY_TYPES.grunt;
    const s = enemy.width / 14; // Scale factor based on base size 14

    // Counter-scale to maintain proportions under isometric Y-compression
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 1 / G.ISO_SCALE);
    ctx.translate(-cx, -cy);

    ctx.save();
    ctx.translate(cx, cy);

    // Draw based on dungeon and enemy type
    if (G.selectedDungeon === 'jungle') {
        if (enemy.type === 'grunt') {
            // Tribesman - humanoid with spear
            ctx.fillStyle = '#8B4513'; // Skin
            ctx.fillRect(-4*s, -5*s, 8*s, 10*s); // Body
            ctx.fillStyle = '#5d4e37';
            ctx.fillRect(-3*s, 4*s, 6*s, 3*s); // Skirt
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-3*s, -7*s, 6*s, 4*s); // Head
            ctx.fillStyle = '#2d5a27'; // Green headband
            ctx.fillRect(-4*s, -6*s, 8*s, 2*s);
            ctx.fillStyle = '#4a3728'; // Spear
            ctx.fillRect(5*s, -8*s, 2*s, 14*s);
            ctx.fillStyle = '#888';
            ctx.fillRect(5*s, -10*s, 2*s, 3*s); // Spear tip
        } else if (enemy.type === 'charger') {
            // Jaguar - cat shape with spots
            ctx.fillStyle = '#c9a227'; // Body
            ctx.fillRect(-6*s, -3*s, 12*s, 6*s);
            ctx.fillStyle = '#a68520';
            ctx.fillRect(-7*s, -2*s, 4*s, 4*s); // Head
            ctx.fillRect(4*s, -1*s, 4*s, 2*s); // Tail
            ctx.fillStyle = '#1a1a1a'; // Spots
            ctx.fillRect(-3*s, -2*s, 2*s, 2*s);
            ctx.fillRect(1*s, 0*s, 2*s, 2*s);
            ctx.fillRect(-1*s, -2*s, 1*s, 1*s);
            ctx.fillStyle = '#fff'; // Eyes
            ctx.fillRect(-6*s, -2*s, 2*s, 2*s);
            ctx.fillStyle = '#4a3728'; // Legs
            ctx.fillRect(-5*s, 2*s, 2*s, 3*s);
            ctx.fillRect(2*s, 2*s, 2*s, 3*s);
        } else if (enemy.type === 'tank') {
            // Gorilla - large ape
            ctx.fillStyle = '#4a4a4a';
            ctx.fillRect(-8*s, -6*s, 16*s, 14*s); // Body
            ctx.fillStyle = '#333';
            ctx.fillRect(-6*s, -9*s, 12*s, 5*s); // Head
            ctx.fillStyle = '#6a6a6a';
            ctx.fillRect(-4*s, -7*s, 8*s, 3*s); // Face
            ctx.fillStyle = '#222';
            ctx.fillRect(-2*s, -5*s, 4*s, 2*s); // Nose/mouth
            ctx.fillStyle = '#4a4a4a'; // Arms
            ctx.fillRect(-11*s, -4*s, 4*s, 10*s);
            ctx.fillRect(7*s, -4*s, 4*s, 10*s);
            ctx.fillStyle = '#fff';
            ctx.fillRect(-4*s, -8*s, 2*s, 2*s);
            ctx.fillRect(2*s, -8*s, 2*s, 2*s);
        } else if (enemy.type === 'sniper') {
            // Hunter with bow
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-3*s, -5*s, 6*s, 10*s); // Body
            ctx.fillRect(-2*s, -7*s, 4*s, 3*s); // Head
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(-4*s, -4*s, 8*s, 6*s); // Cloak
            ctx.fillStyle = '#5d4e37'; // Bow
            ctx.beginPath();
            ctx.arc(5*s, 0, 5*s, -Math.PI/2, Math.PI/2);
            ctx.lineWidth = 2*s;
            ctx.strokeStyle = '#5d4e37';
            ctx.stroke();
        } else if (enemy.type === 'boss') {
            // Shaman with headdress
            ctx.fillStyle = '#2d5a27';
            ctx.fillRect(-12*s, -12*s, 24*s, 26*s); // Robe
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-6*s, -16*s, 12*s, 8*s); // Head
            ctx.fillStyle = '#c9a227'; // Headdress feathers
            ctx.fillRect(-10*s, -22*s, 4*s, 8*s);
            ctx.fillRect(-4*s, -24*s, 4*s, 10*s);
            ctx.fillRect(2*s, -24*s, 4*s, 10*s);
            ctx.fillRect(8*s, -22*s, 4*s, 8*s);
            ctx.fillStyle = '#4a3728'; // Staff
            ctx.fillRect(14*s, -18*s, 3*s, 30*s);
            ctx.fillStyle = '#2ecc71'; // Magic orb
            ctx.beginPath();
            ctx.arc(15*s, -20*s, 4*s, 0, Math.PI*2);
            ctx.fill();
        }
    } else if (G.selectedDungeon === 'desert') {
        if (enemy.type === 'grunt') {
            // Mummy - wrapped figure
            ctx.fillStyle = '#c4a35a';
            ctx.fillRect(-4*s, -6*s, 8*s, 12*s); // Body
            ctx.fillRect(-3*s, -8*s, 6*s, 4*s); // Head
            ctx.fillStyle = '#a68b4b'; // Wrap lines
            ctx.fillRect(-4*s, -4*s, 8*s, 1*s);
            ctx.fillRect(-4*s, 0*s, 8*s, 1*s);
            ctx.fillRect(-4*s, 3*s, 8*s, 1*s);
            ctx.fillStyle = '#1a1a1a'; // Eyes
            ctx.fillRect(-2*s, -7*s, 2*s, 2*s);
            ctx.fillRect(1*s, -7*s, 2*s, 2*s);
            ctx.fillStyle = '#4a3728'; // Arms out
            ctx.fillRect(-7*s, -3*s, 4*s, 2*s);
            ctx.fillRect(4*s, -3*s, 4*s, 2*s);
        } else if (enemy.type === 'charger') {
            // Scarab beetle
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.ellipse(0, 0, 5*s, 4*s, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#2a2a4e'; // Shell shine
            ctx.beginPath();
            ctx.ellipse(-1*s, -1*s, 2*s, 1.5*s, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#0d0d17'; // Head
            ctx.fillRect(-2*s, -5*s, 4*s, 2*s);
            ctx.fillStyle = '#c4a35a'; // Legs
            ctx.fillRect(-6*s, -2*s, 2*s, 1*s);
            ctx.fillRect(-6*s, 1*s, 2*s, 1*s);
            ctx.fillRect(4*s, -2*s, 2*s, 1*s);
            ctx.fillRect(4*s, 1*s, 2*s, 1*s);
        } else if (enemy.type === 'tank') {
            // Sand Golem
            ctx.fillStyle = '#d4a574';
            ctx.fillRect(-8*s, -8*s, 16*s, 18*s); // Body
            ctx.fillStyle = '#b8956a';
            ctx.fillRect(-6*s, -10*s, 12*s, 6*s); // Head
            ctx.fillRect(-11*s, -5*s, 5*s, 10*s); // Arms
            ctx.fillRect(6*s, -5*s, 5*s, 10*s);
            ctx.fillStyle = '#8b7355'; // Cracks
            ctx.fillRect(-4*s, -2*s, 2*s, 6*s);
            ctx.fillRect(2*s, 0*s, 2*s, 5*s);
            ctx.fillStyle = '#ffd700'; // Glowing eyes
            ctx.fillRect(-4*s, -9*s, 3*s, 2*s);
            ctx.fillRect(1*s, -9*s, 3*s, 2*s);
        } else if (enemy.type === 'sniper') {
            // Desert Archer
            ctx.fillStyle = '#8b7355';
            ctx.fillRect(-3*s, -5*s, 6*s, 10*s); // Robe
            ctx.fillStyle = '#c4a35a';
            ctx.fillRect(-2*s, -7*s, 4*s, 3*s); // Head wrap
            ctx.fillStyle = '#6b5a45';
            ctx.fillRect(-4*s, -6*s, 8*s, 2*s); // Headband
            ctx.fillStyle = '#4a3728'; // Bow
            ctx.fillRect(4*s, -6*s, 2*s, 12*s);
            ctx.fillRect(3*s, -6*s, 4*s, 2*s);
            ctx.fillRect(3*s, 4*s, 4*s, 2*s);
        } else if (enemy.type === 'boss') {
            // Pharaoh
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-14*s, -14*s, 28*s, 30*s); // Robe
            ctx.fillStyle = '#c4a35a';
            ctx.fillRect(-8*s, -18*s, 16*s, 8*s); // Head
            ctx.fillStyle = '#ffd700'; // Crown
            ctx.fillRect(-10*s, -24*s, 20*s, 8*s);
            ctx.fillRect(-4*s, -28*s, 8*s, 6*s);
            ctx.fillStyle = '#e74c3c'; // Crown gem
            ctx.fillRect(-2*s, -26*s, 4*s, 3*s);
            ctx.fillStyle = '#1a1a2e'; // Eyes
            ctx.fillRect(-5*s, -16*s, 3*s, 2*s);
            ctx.fillRect(2*s, -16*s, 3*s, 2*s);
            ctx.fillStyle = '#b8860b'; // Staff
            ctx.fillRect(16*s, -20*s, 3*s, 35*s);
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(14*s, -24*s, 7*s, 6*s);
        }
    } else if (G.selectedDungeon === 'ice') {
        if (enemy.type === 'grunt') {
            // Frost Knight
            ctx.fillStyle = '#5a8fa8';
            ctx.fillRect(-5*s, -5*s, 10*s, 12*s); // Armor
            ctx.fillStyle = '#4a7a8f';
            ctx.fillRect(-4*s, -8*s, 8*s, 5*s); // Helmet
            ctx.fillRect(-3*s, -6*s, 6*s, 2*s); // Visor
            ctx.fillStyle = '#8ecae6'; // Ice glow
            ctx.fillRect(-2*s, -5*s, 1*s, 1*s);
            ctx.fillRect(1*s, -5*s, 1*s, 1*s);
            ctx.fillStyle = '#4a7a8f'; // Sword
            ctx.fillRect(5*s, -8*s, 2*s, 14*s);
            ctx.fillStyle = '#8ecae6';
            ctx.fillRect(5*s, -10*s, 2*s, 3*s);
        } else if (enemy.type === 'charger') {
            // Ice Wolf
            ctx.fillStyle = '#a8c8d8';
            ctx.fillRect(-6*s, -3*s, 12*s, 6*s); // Body
            ctx.fillStyle = '#8ab0c0';
            ctx.fillRect(-8*s, -4*s, 5*s, 5*s); // Head
            ctx.fillRect(4*s, -2*s, 5*s, 2*s); // Tail
            ctx.fillStyle = '#fff'; // Fur detail
            ctx.fillRect(-5*s, -2*s, 8*s, 2*s);
            ctx.fillStyle = '#5a8fa8'; // Eyes
            ctx.fillRect(-7*s, -3*s, 2*s, 2*s);
            ctx.fillStyle = '#4a7a8f'; // Nose
            ctx.fillRect(-9*s, -2*s, 2*s, 2*s);
            ctx.fillStyle = '#8ab0c0'; // Legs
            ctx.fillRect(-5*s, 2*s, 2*s, 3*s);
            ctx.fillRect(2*s, 2*s, 2*s, 3*s);
            // Ears
            ctx.fillRect(-7*s, -6*s, 2*s, 3*s);
            ctx.fillRect(-4*s, -6*s, 2*s, 3*s);
        } else if (enemy.type === 'tank') {
            // Yeti
            ctx.fillStyle = '#e8f0f0';
            ctx.fillRect(-9*s, -8*s, 18*s, 18*s); // Body
            ctx.fillStyle = '#c8d8d8';
            ctx.fillRect(-7*s, -12*s, 14*s, 6*s); // Head
            ctx.fillRect(-12*s, -5*s, 5*s, 12*s); // Arms
            ctx.fillRect(7*s, -5*s, 5*s, 12*s);
            ctx.fillStyle = '#5a8fa8'; // Eyes
            ctx.fillRect(-4*s, -10*s, 3*s, 2*s);
            ctx.fillRect(1*s, -10*s, 3*s, 2*s);
            ctx.fillStyle = '#4a7a8f'; // Mouth
            ctx.fillRect(-3*s, -7*s, 6*s, 2*s);
        } else if (enemy.type === 'sniper') {
            // Ice Mage
            ctx.fillStyle = '#87ceeb';
            ctx.fillRect(-4*s, -5*s, 8*s, 12*s); // Robe
            ctx.fillStyle = '#5f9ea0';
            ctx.fillRect(-3*s, -8*s, 6*s, 4*s); // Hood
            ctx.fillStyle = '#fff'; // Eyes glow
            ctx.fillRect(-2*s, -6*s, 2*s, 2*s);
            ctx.fillRect(1*s, -6*s, 2*s, 2*s);
            ctx.fillStyle = '#4a7a8f'; // Staff
            ctx.fillRect(5*s, -10*s, 2*s, 16*s);
            ctx.fillStyle = '#8ecae6'; // Ice crystal
            ctx.fillRect(4*s, -14*s, 4*s, 5*s);
        } else if (enemy.type === 'boss') {
            // Frost Giant
            ctx.fillStyle = '#4a90a8';
            ctx.fillRect(-16*s, -14*s, 32*s, 34*s); // Body
            ctx.fillStyle = '#3a7088';
            ctx.fillRect(-12*s, -20*s, 24*s, 10*s); // Head
            ctx.fillRect(-20*s, -10*s, 8*s, 20*s); // Arms
            ctx.fillRect(12*s, -10*s, 8*s, 20*s);
            ctx.fillStyle = '#8ecae6'; // Eyes
            ctx.fillRect(-8*s, -18*s, 5*s, 4*s);
            ctx.fillRect(3*s, -18*s, 5*s, 4*s);
            ctx.fillStyle = '#fff'; // Ice armor
            ctx.fillRect(-14*s, -8*s, 28*s, 4*s);
            ctx.fillRect(-14*s, 4*s, 28*s, 4*s);
        }
    } else if (G.selectedDungeon === 'volcano') {
        if (enemy.type === 'grunt') {
            // Fire Imp
            ctx.fillStyle = '#ff6b35';
            ctx.fillRect(-4*s, -4*s, 8*s, 10*s); // Body
            ctx.fillStyle = '#cc5528';
            ctx.fillRect(-3*s, -6*s, 6*s, 4*s); // Head
            ctx.fillStyle = '#8b0000'; // Horns
            ctx.fillRect(-4*s, -8*s, 2*s, 3*s);
            ctx.fillRect(2*s, -8*s, 2*s, 3*s);
            ctx.fillStyle = '#ffff00'; // Eyes
            ctx.fillRect(-2*s, -5*s, 2*s, 2*s);
            ctx.fillRect(1*s, -5*s, 2*s, 2*s);
            ctx.fillStyle = '#ff4500'; // Tail
            ctx.fillRect(3*s, 2*s, 4*s, 2*s);
            ctx.fillRect(6*s, 0*s, 2*s, 3*s);
        } else if (enemy.type === 'charger') {
            // Hellhound
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(-6*s, -3*s, 12*s, 6*s); // Body
            ctx.fillStyle = '#5c0000';
            ctx.fillRect(-8*s, -4*s, 5*s, 5*s); // Head
            ctx.fillRect(4*s, -2*s, 4*s, 2*s); // Tail
            ctx.fillStyle = '#ff4500'; // Flames on back
            ctx.fillRect(-4*s, -5*s, 3*s, 3*s);
            ctx.fillRect(0*s, -6*s, 3*s, 4*s);
            ctx.fillRect(-2*s, -4*s, 2*s, 2*s);
            ctx.fillStyle = '#ffff00'; // Eyes
            ctx.fillRect(-7*s, -3*s, 2*s, 2*s);
            ctx.fillStyle = '#5c0000'; // Legs
            ctx.fillRect(-5*s, 2*s, 2*s, 3*s);
            ctx.fillRect(2*s, 2*s, 2*s, 3*s);
        } else if (enemy.type === 'tank') {
            // Lava Golem
            ctx.fillStyle = '#4a2c2a';
            ctx.fillRect(-9*s, -8*s, 18*s, 18*s); // Body
            ctx.fillStyle = '#3a1c1a';
            ctx.fillRect(-7*s, -12*s, 14*s, 6*s); // Head
            ctx.fillRect(-12*s, -5*s, 5*s, 12*s); // Arms
            ctx.fillRect(7*s, -5*s, 5*s, 12*s);
            ctx.fillStyle = '#ff8c00'; // Lava cracks
            ctx.fillRect(-6*s, -4*s, 2*s, 8*s);
            ctx.fillRect(2*s, -2*s, 2*s, 6*s);
            ctx.fillRect(-3*s, 2*s, 6*s, 2*s);
            ctx.fillStyle = '#ffff00'; // Eyes
            ctx.fillRect(-4*s, -10*s, 3*s, 2*s);
            ctx.fillRect(1*s, -10*s, 3*s, 2*s);
        } else if (enemy.type === 'sniper') {
            // Fire Mage
            ctx.fillStyle = '#4a2c2a';
            ctx.fillRect(-4*s, -5*s, 8*s, 12*s); // Robe
            ctx.fillStyle = '#3a1c1a';
            ctx.fillRect(-3*s, -8*s, 6*s, 4*s); // Hood
            ctx.fillStyle = '#ff4500'; // Eyes
            ctx.fillRect(-2*s, -6*s, 2*s, 2*s);
            ctx.fillRect(1*s, -6*s, 2*s, 2*s);
            ctx.fillStyle = '#4a2c2a'; // Staff
            ctx.fillRect(5*s, -10*s, 2*s, 16*s);
            ctx.fillStyle = '#ff4500'; // Fire
            ctx.fillRect(4*s, -14*s, 4*s, 5*s);
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(5*s, -13*s, 2*s, 3*s);
        } else if (enemy.type === 'boss') {
            // Fire Dragon
            ctx.fillStyle = '#ff4500';
            ctx.fillRect(-16*s, -10*s, 32*s, 24*s); // Body
            ctx.fillStyle = '#cc3700';
            ctx.fillRect(-20*s, -14*s, 12*s, 10*s); // Head
            ctx.fillRect(12*s, -6*s, 12*s, 6*s); // Tail
            ctx.fillStyle = '#8b0000'; // Horns
            ctx.fillRect(-18*s, -20*s, 3*s, 8*s);
            ctx.fillRect(-12*s, -20*s, 3*s, 8*s);
            ctx.fillStyle = '#ff8c00'; // Wings
            ctx.fillRect(-14*s, -18*s, 8*s, 10*s);
            ctx.fillRect(6*s, -18*s, 8*s, 10*s);
            ctx.fillStyle = '#ffff00'; // Eyes
            ctx.fillRect(-18*s, -12*s, 4*s, 3*s);
            ctx.fillStyle = '#ff4500'; // Fire breath particles
            ctx.fillRect(-24*s, -10*s, 5*s, 3*s);
            ctx.fillRect(-26*s, -8*s, 4*s, 2*s);
        }
    } else {
        // Dungeon (default)
        if (enemy.type === 'grunt') {
            // Guard - armored humanoid
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(-4*s, -5*s, 8*s, 10*s); // Armor
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(-3*s, -7*s, 6*s, 4*s); // Helmet
            ctx.fillStyle = '#888';
            ctx.fillRect(-4*s, -6*s, 8*s, 2*s); // Visor
            ctx.fillStyle = '#fff';
            ctx.fillRect(-2*s, -5*s, 1*s, 1*s);
            ctx.fillRect(1*s, -5*s, 1*s, 1*s);
            ctx.fillStyle = '#666'; // Sword
            ctx.fillRect(5*s, -6*s, 2*s, 10*s);
        } else if (enemy.type === 'charger') {
            // Goblin - small green creature
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(-4*s, -3*s, 8*s, 8*s); // Body
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(-3*s, -6*s, 6*s, 5*s); // Head
            ctx.fillStyle = '#1e8449'; // Ears
            ctx.fillRect(-5*s, -5*s, 3*s, 3*s);
            ctx.fillRect(2*s, -5*s, 3*s, 3*s);
            ctx.fillStyle = '#ff0';
            ctx.fillRect(-2*s, -4*s, 2*s, 2*s);
            ctx.fillRect(1*s, -4*s, 2*s, 2*s);
            ctx.fillStyle = '#c0392b'; // Nose
            ctx.fillRect(-1*s, -2*s, 2*s, 2*s);
        } else if (enemy.type === 'tank') {
            // Ogre - large brute
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(-8*s, -6*s, 16*s, 16*s); // Body
            ctx.fillStyle = '#d35400';
            ctx.fillRect(-6*s, -10*s, 12*s, 6*s); // Head
            ctx.fillRect(-10*s, -3*s, 4*s, 10*s); // Arms
            ctx.fillRect(6*s, -3*s, 4*s, 10*s);
            ctx.fillStyle = '#fff';
            ctx.fillRect(-3*s, -8*s, 2*s, 2*s);
            ctx.fillRect(1*s, -8*s, 2*s, 2*s);
            ctx.fillStyle = '#333'; // Mouth
            ctx.fillRect(-3*s, -5*s, 6*s, 2*s);
        } else if (enemy.type === 'sniper') {
            // Dark Mage
            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(-4*s, -5*s, 8*s, 12*s); // Robe
            ctx.fillStyle = '#8e44ad';
            ctx.fillRect(-3*s, -8*s, 6*s, 4*s); // Hood
            ctx.fillStyle = '#fff';
            ctx.fillRect(-2*s, -6*s, 2*s, 2*s);
            ctx.fillRect(1*s, -6*s, 2*s, 2*s);
            ctx.fillStyle = '#5d4e37'; // Staff
            ctx.fillRect(5*s, -10*s, 2*s, 16*s);
            ctx.fillStyle = '#9b59b6'; // Magic orb
            ctx.beginPath();
            ctx.arc(6*s, -12*s, 3*s, 0, Math.PI*2);
            ctx.fill();
        } else if (enemy.type === 'boss') {
            // Dark Knight
            ctx.fillStyle = '#4a4a6a';
            ctx.fillRect(-14*s, -12*s, 28*s, 28*s); // Armor
            ctx.fillStyle = '#3a3a5a';
            ctx.fillRect(-10*s, -18*s, 20*s, 10*s); // Helmet
            ctx.fillRect(-18*s, -8*s, 6*s, 16*s); // Arms
            ctx.fillRect(12*s, -8*s, 6*s, 16*s);
            ctx.fillStyle = '#e74c3c'; // Eyes
            ctx.fillRect(-6*s, -15*s, 4*s, 3*s);
            ctx.fillRect(2*s, -15*s, 4*s, 3*s);
            ctx.fillStyle = '#666'; // Sword
            ctx.fillRect(18*s, -20*s, 4*s, 30*s);
            ctx.fillStyle = '#888';
            ctx.fillRect(17*s, -24*s, 6*s, 6*s);
        }
    }

    ctx.restore();

    // Health bar
    const ex = Math.floor(enemy.x - enemy.width / 2);
    const ey = Math.floor(enemy.y - enemy.height / 2);
    const healthPercent = enemy.health / enemy.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(ex, ey - 10, enemy.width, 4);
    ctx.fillStyle = COLORS.health;
    ctx.fillRect(ex, ey - 10, enemy.width * healthPercent, 4);
    ctx.restore(); // end isometric counter-scale
}
