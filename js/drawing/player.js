// Player sprite and weapon rendering.

function drawPlayer() {
    var ctx = G.ctx;
    var player = G.player;
    var COLORS = G.COLORS;

    // Counter-scale to maintain proportions under isometric Y-compression
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.scale(1, 1 / G.ISO_SCALE);
    ctx.translate(-player.x, -player.y);

    const px = Math.floor(player.x - player.width / 2);
    const py = Math.floor(player.y - player.height / 2);

    // Body
    drawPixelRect(px, py, player.width, player.height, COLORS.player, COLORS.playerDark);

    // Armor outline
    if (G.playerArmorTier > 0) {
        const armorColor = ARMOR_TIERS[G.playerArmorTier - 1].color;
        ctx.strokeStyle = armorColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 1, py - 1, player.width + 2, player.height + 2);
    }

    // Draw gun based on weapon type
    const weapon = WEAPONS[player.weapon];
    const weaponColor = weapon ? weapon.color : '#666';

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);

    // Gun shapes for each weapon type
    if (player.weapon === 'pistol') {
        // Pistol - compact handgun (matches pickup)
        ctx.fillStyle = '#555'; // Slide
        ctx.fillRect(4, -4, 18, 5);
        ctx.fillStyle = '#333'; // Barrel
        ctx.fillRect(18, -3, 6, 3);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(8, 1, 7, 8);
        ctx.fillStyle = '#4a2e18';
        ctx.fillRect(9, 2, 5, 6);
        ctx.fillStyle = weaponColor; // Trigger guard
        ctx.fillRect(14, 1, 4, 3);
        ctx.fillStyle = '#777'; // Highlight
        ctx.fillRect(6, -3, 12, 1);
    } else if (player.weapon === 'smg') {
        // SMG - compact automatic with stock (matches pickup)
        ctx.fillStyle = '#444'; // Body
        ctx.fillRect(4, -4, 22, 6);
        ctx.fillStyle = '#333'; // Barrel
        ctx.fillRect(22, -3, 8, 4);
        ctx.fillStyle = '#222'; // Barrel tip
        ctx.fillRect(28, -4, 3, 6);
        ctx.fillStyle = '#555'; // Stock
        ctx.fillRect(-2, -3, 6, 4);
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(-4, -2, 3, 5);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(10, 2, 5, 7);
        ctx.fillStyle = weaponColor; // Magazine
        ctx.fillRect(16, 2, 4, 8);
        ctx.fillStyle = '#666'; // Highlight
        ctx.fillRect(6, -3, 16, 1);
    } else if (player.weapon === 'shotgun') {
        // Shotgun - long with pump grip (matches pickup)
        ctx.fillStyle = '#555'; // Receiver
        ctx.fillRect(6, -4, 14, 6);
        ctx.fillStyle = '#444'; // Barrel
        ctx.fillRect(16, -3, 14, 4);
        ctx.fillStyle = '#333';
        ctx.fillRect(26, -4, 4, 6);
        ctx.fillStyle = weaponColor; // Pump grip
        ctx.fillRect(18, 2, 8, 4);
        ctx.fillStyle = '#6b4226'; // Stock
        ctx.fillRect(-2, -3, 10, 5);
        ctx.fillStyle = '#4a2e18';
        ctx.fillRect(-4, -2, 4, 6);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(10, 2, 5, 7);
        ctx.fillStyle = '#666'; // Highlight
        ctx.fillRect(17, -2, 10, 1);
    } else if (player.weapon === 'rifle') {
        // Rifle - assault rifle (matches pickup)
        ctx.fillStyle = '#4a4a4a'; // Body
        ctx.fillRect(4, -4, 20, 6);
        ctx.fillStyle = '#333'; // Barrel
        ctx.fillRect(20, -3, 10, 3);
        ctx.fillStyle = '#222';
        ctx.fillRect(28, -4, 3, 5);
        ctx.fillStyle = '#555'; // Stock
        ctx.fillRect(-2, -3, 8, 5);
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(-4, -2, 3, 5);
        ctx.fillStyle = weaponColor; // Magazine
        ctx.fillRect(12, 2, 4, 8);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(8, 2, 5, 7);
        ctx.fillStyle = '#666'; // Top rail
        ctx.fillRect(8, -5, 14, 2);
        ctx.fillStyle = '#777';
        ctx.fillRect(10, -3, 12, 1);
    } else if (player.weapon === 'railgun') {
        // Railgun - sci-fi energy weapon (matches pickup)
        ctx.fillStyle = '#3a3a4a'; // Body
        ctx.fillRect(4, -5, 24, 7);
        ctx.fillStyle = weaponColor; // Energy rails
        ctx.fillRect(22, -6, 10, 2);
        ctx.fillRect(22, 2, 10, 2);
        ctx.fillStyle = '#6a4aaa'; // Energy core
        ctx.fillRect(12, -3, 6, 4);
        ctx.fillStyle = '#fff'; // Core glow
        ctx.fillRect(14, -2, 2, 2);
        ctx.fillStyle = '#555'; // Stock
        ctx.fillRect(-2, -3, 8, 5);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(10, 2, 5, 7);
        ctx.fillStyle = weaponColor; // Barrel glow
        ctx.fillRect(30, -3, 3, 4);
    } else if (player.weapon === 'minigun') {
        // Minigun - multi-barrel rotary (matches pickup)
        ctx.fillStyle = '#555'; // Body
        ctx.fillRect(4, -5, 14, 8);
        ctx.fillStyle = '#444'; // Barrels
        ctx.fillRect(16, -6, 14, 2);
        ctx.fillRect(16, -2, 14, 2);
        ctx.fillRect(16, 2, 14, 2);
        ctx.fillStyle = '#333'; // Barrel housing
        ctx.fillRect(14, -7, 4, 12);
        ctx.fillStyle = weaponColor; // Ammo belt
        ctx.fillRect(8, 4, 8, 5);
        ctx.fillStyle = '#c9a01a';
        ctx.fillRect(9, 5, 2, 3);
        ctx.fillRect(13, 5, 2, 3);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(0, -2, 5, 8);
        ctx.fillStyle = '#666';
        ctx.fillRect(6, -4, 10, 1);
    } else if (player.weapon === 'sword') {
        // Sword with swing animation (matches pickup)
        const swingOffset = player.swinging ? (player.swingProgress - 0.5) * weapon.arc : 0;
        ctx.rotate(swingOffset);
        ctx.fillStyle = '#5d4e37'; // Handle
        ctx.fillRect(4, -2, 8, 5);
        ctx.fillStyle = '#8b7355'; // Crossguard
        ctx.fillRect(11, -5, 4, 10);
        ctx.fillStyle = weaponColor; // Blade
        ctx.fillRect(15, -3, 20, 5);
        // Blade tip
        ctx.beginPath();
        ctx.moveTo(35, -3);
        ctx.lineTo(40, 0);
        ctx.lineTo(35, 2);
        ctx.fill();
        ctx.fillStyle = '#fff'; // Highlight
        ctx.fillRect(17, -2, 16, 1);
    } else if (player.weapon === 'katana') {
        // Katana with swing animation (matches pickup)
        const swingOffset = player.swinging ? (player.swingProgress - 0.5) * weapon.arc : 0;
        ctx.rotate(swingOffset);
        ctx.fillStyle = '#2c2c2c'; // Handle
        ctx.fillRect(4, -2, 10, 4);
        ctx.fillStyle = '#8b0000'; // Red wrap
        ctx.fillRect(5, -1, 2, 3);
        ctx.fillRect(9, -1, 2, 3);
        ctx.fillStyle = '#d4af37'; // Guard (tsuba)
        ctx.beginPath();
        ctx.arc(14, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        // Curved blade
        ctx.fillStyle = weaponColor;
        ctx.beginPath();
        ctx.moveTo(18, -3);
        ctx.quadraticCurveTo(30, -4, 40, -1);
        ctx.lineTo(40, 1);
        ctx.quadraticCurveTo(30, 3, 18, 3);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff'; // Edge highlight
        ctx.fillRect(20, -2, 14, 1);
    } else if (player.weapon === 'sniper') {
        // Sniper - long rifle with scope (matches pickup)
        ctx.fillStyle = weaponColor; // Body
        ctx.fillRect(4, -3, 28, 5);
        ctx.fillStyle = '#333'; // Barrel
        ctx.fillRect(28, -2, 8, 3);
        ctx.fillStyle = '#4a3728'; // Stock
        ctx.fillRect(-2, -2, 8, 5);
        ctx.fillStyle = '#3a2818';
        ctx.fillRect(-4, -1, 4, 5);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(10, 2, 5, 7);
        ctx.fillStyle = '#444'; // Scope
        ctx.fillRect(16, -7, 10, 4);
        ctx.fillStyle = '#5af'; // Scope lens
        ctx.fillRect(24, -6, 2, 2);
        ctx.fillStyle = '#666';
        ctx.fillRect(6, -2, 20, 1);
    } else if (player.weapon === 'flamethrower') {
        // Flamethrower - tank + nozzle (matches pickup)
        ctx.fillStyle = '#666'; // Tank
        ctx.fillRect(0, -4, 8, 8);
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(1, -3, 6, 6);
        ctx.fillStyle = '#444'; // Body/pipe
        ctx.fillRect(8, -3, 14, 5);
        ctx.fillStyle = weaponColor; // Nozzle
        ctx.fillRect(22, -4, 8, 7);
        ctx.fillStyle = '#333';
        ctx.fillRect(28, -5, 3, 9);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(12, 2, 5, 6);
        // Flame effect when shooting
        if (G.mouseDown && player.ammo > 0 && player.shootCooldown === 0) {
            ctx.fillStyle = '#ff0';
            ctx.fillRect(29, -3, 4, 2);
            ctx.fillStyle = '#f80';
            ctx.fillRect(31, -1, 4, 2);
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.moveTo(31, 0);
            ctx.lineTo(40 + Math.random() * 8, -4 + Math.random() * 8);
            ctx.lineTo(40 + Math.random() * 8, -4 + Math.random() * 8);
            ctx.fill();
        }
    } else if (player.weapon === 'rocketlauncher') {
        // Rocket launcher - big tube (matches pickup)
        ctx.fillStyle = weaponColor; // Tube
        ctx.fillRect(4, -5, 28, 10);
        ctx.fillStyle = '#222'; // Back rim
        ctx.fillRect(4, -7, 4, 14);
        ctx.fillStyle = '#333'; // Front rim
        ctx.fillRect(28, -7, 4, 14);
        ctx.fillStyle = '#8b0000'; // Rocket visible
        ctx.fillRect(14, -3, 6, 6);
        ctx.fillStyle = '#6b4226'; // Grip
        ctx.fillRect(14, 5, 5, 6);
        ctx.fillStyle = '#444'; // Sight
        ctx.fillRect(22, -8, 3, 4);
    } else if (player.weapon === 'bomb') {
        // Bomb (matches pickup)
        ctx.fillStyle = weaponColor;
        ctx.beginPath();
        ctx.arc(12, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(12, 0, 10, 0, Math.PI * 2);
        ctx.stroke();
        // Fuse
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, -7);
        ctx.quadraticCurveTo(22, -12, 20, -14);
        ctx.stroke();
        // Spark
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(20, -14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(20, -14, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Default fallback
        ctx.fillStyle = '#666';
        ctx.fillRect(4, -2, 12, 4);
    }

    ctx.restore();

    // Eyes (facing mouse direction)
    ctx.fillStyle = '#fff';
    const eyeOffsetX = Math.cos(player.angle) * 3;
    const eyeOffsetY = Math.sin(player.angle) * 3;
    ctx.fillRect(px + 4 + eyeOffsetX, py + 4 + eyeOffsetY, 3, 3);
    ctx.fillRect(px + 9 + eyeOffsetX, py + 4 + eyeOffsetY, 3, 3);
    ctx.restore(); // end isometric counter-scale
}

// Draw remote player (P2) with different color
function drawRemotePlayer() {
    var ctx = G.ctx;
    var rp = G.remotePlayer;
    if (!rp || !rp.connected) return;

    // Counter-scale to maintain proportions under isometric Y-compression
    ctx.save();
    ctx.translate(rp.x, rp.y);
    ctx.scale(1, 1 / G.ISO_SCALE);
    ctx.translate(-rp.x, -rp.y);

    // Use P2 colors
    const p2Color = PLAYER_COLORS.p2.main;
    const p2ColorDark = PLAYER_COLORS.p2.dark;

    const width = 16;
    const height = 16;
    const px = Math.floor(rp.x - width / 2);
    const py = Math.floor(rp.y - height / 2);

    // Body (using P2 color)
    drawPixelRect(px, py, width, height, p2Color, p2ColorDark);

    // "P2" label above player
    ctx.fillStyle = '#fff';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('P2', rp.x, py - 8);
    ctx.textAlign = 'left';

    // Draw weapon
    const weapon = WEAPONS[rp.weapon];
    const weaponColor = weapon ? weapon.color : '#666';

    ctx.save();
    ctx.translate(rp.x, rp.y);
    ctx.rotate(rp.angle);

    // Simplified weapon rendering for remote player
    if (weapon && weapon.melee) {
        const swingOffset = rp.swinging ? (rp.swingProgress - 0.5) * (weapon.arc || Math.PI/2) : 0;
        ctx.rotate(swingOffset);
        ctx.fillStyle = weaponColor;
        ctx.fillRect(8, -3, 25, 6);
    } else {
        ctx.fillStyle = '#444';
        ctx.fillRect(4, -3, 14, 6);
        ctx.fillStyle = weaponColor;
        ctx.fillRect(6, -2, 12, 4);
    }

    ctx.restore();

    // Eyes
    ctx.fillStyle = '#fff';
    const eyeOffsetX = Math.cos(rp.angle) * 3;
    const eyeOffsetY = Math.sin(rp.angle) * 3;
    ctx.fillRect(px + 4 + eyeOffsetX, py + 4 + eyeOffsetY, 3, 3);
    ctx.fillRect(px + 9 + eyeOffsetX, py + 4 + eyeOffsetY, 3, 3);

    // Health bar below remote player
    if (rp.health < rp.maxHealth) {
        const barWidth = 20;
        const barHeight = 3;
        const barX = rp.x - barWidth / 2;
        const barY = py + height + 4;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * (rp.health / rp.maxHealth), barHeight);
    }
    ctx.restore(); // end isometric counter-scale
}
