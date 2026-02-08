// Player sprite and weapon rendering.

function drawPlayer() {
    var ctx = G.ctx;
    var player = G.player;
    var COLORS = G.COLORS;

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
        // Compact pistol
        ctx.fillStyle = '#444';
        ctx.fillRect(4, -3, 10, 6); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(6, -2, 8, 4); // Slide
        ctx.fillStyle = '#333';
        ctx.fillRect(4, 1, 4, 4); // Grip
    } else if (player.weapon === 'smg') {
        // SMG with extended barrel
        ctx.fillStyle = '#333';
        ctx.fillRect(4, -3, 14, 6); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(6, -2, 12, 4); // Upper
        ctx.fillStyle = '#222';
        ctx.fillRect(4, 1, 5, 5); // Grip
        ctx.fillRect(10, 2, 3, 3); // Magazine
    } else if (player.weapon === 'shotgun') {
        // Wide shotgun
        ctx.fillStyle = '#5d4e37';
        ctx.fillRect(4, -4, 16, 8); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(14, -3, 6, 6); // Barrel
        ctx.fillStyle = '#3d3229';
        ctx.fillRect(4, 1, 6, 5); // Stock
    } else if (player.weapon === 'rifle') {
        // Long rifle
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(4, -3, 18, 6); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(8, -2, 14, 4); // Upper
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(4, 1, 5, 4); // Stock
        ctx.fillRect(16, -4, 2, 2); // Scope
    } else if (player.weapon === 'railgun') {
        // Futuristic railgun
        ctx.fillStyle = '#2c2c54';
        ctx.fillRect(4, -4, 20, 8); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(8, -3, 16, 6); // Core
        // Glowing effect
        ctx.fillStyle = '#fff';
        ctx.fillRect(18, -2, 6, 4); // Barrel glow
        ctx.fillStyle = weaponColor;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(20, -3, 4, 6); // Energy glow
        ctx.globalAlpha = 1;
    } else if (player.weapon === 'minigun') {
        // Multi-barrel minigun
        ctx.fillStyle = '#444';
        ctx.fillRect(4, -5, 18, 10); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(14, -6, 8, 3); // Top barrel
        ctx.fillRect(14, -2, 8, 3); // Mid barrel
        ctx.fillRect(14, 2, 8, 3); // Bot barrel
        ctx.fillStyle = '#333';
        ctx.fillRect(4, 1, 6, 6); // Grip
    } else if (player.weapon === 'sword') {
        // Sword with swing animation
        const swingOffset = player.swinging ? (player.swingProgress - 0.5) * weapon.arc : 0;
        ctx.rotate(swingOffset);
        // Handle
        ctx.fillStyle = '#5d4e37';
        ctx.fillRect(4, -2, 8, 4);
        // Crossguard
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(10, -5, 3, 10);
        // Blade
        ctx.fillStyle = weaponColor;
        ctx.fillRect(13, -3, 22, 6);
        // Blade highlight
        ctx.fillStyle = '#fff';
        ctx.fillRect(15, -2, 18, 2);
        // Blade tip
        ctx.fillStyle = '#a0a0a0';
        ctx.beginPath();
        ctx.moveTo(35, -3);
        ctx.lineTo(40, 0);
        ctx.lineTo(35, 3);
        ctx.fill();
    } else if (player.weapon === 'katana') {
        // Katana with swing animation
        const swingOffset = player.swinging ? (player.swingProgress - 0.5) * weapon.arc : 0;
        ctx.rotate(swingOffset);
        // Wrapped handle
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(4, -2, 10, 4);
        ctx.fillStyle = '#8b0000'; // Red wrapping
        ctx.fillRect(5, -2, 2, 4);
        ctx.fillRect(9, -2, 2, 4);
        // Circular guard (tsuba)
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.arc(14, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(14, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        // Curved blade
        ctx.fillStyle = weaponColor;
        ctx.beginPath();
        ctx.moveTo(18, -2);
        ctx.quadraticCurveTo(35, -4, 50, -1);
        ctx.lineTo(50, 1);
        ctx.quadraticCurveTo(35, 2, 18, 2);
        ctx.closePath();
        ctx.fill();
        // Blade edge highlight
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, -1);
        ctx.quadraticCurveTo(35, -3, 48, -1);
        ctx.stroke();
    } else if (player.weapon === 'sniper') {
        // Long sniper rifle
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(4, -3, 28, 6); // Long body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(6, -2, 24, 4); // Upper receiver
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(4, 1, 8, 5); // Stock
        ctx.fillStyle = '#333';
        ctx.fillRect(26, -4, 8, 2); // Scope
        ctx.fillRect(26, -2, 8, 1);
        ctx.fillStyle = '#5af';
        ctx.fillRect(27, -3, 2, 1); // Scope lens
        ctx.fillRect(32, -3, 2, 1);
    } else if (player.weapon === 'flamethrower') {
        // Flamethrower with tank
        ctx.fillStyle = '#444';
        ctx.fillRect(4, -4, 16, 8); // Body
        ctx.fillStyle = weaponColor;
        ctx.fillRect(16, -3, 12, 6); // Nozzle
        ctx.fillStyle = '#666';
        ctx.fillRect(0, -6, 8, 12); // Tank
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(1, -5, 6, 10); // Tank contents
        ctx.fillStyle = '#333';
        ctx.fillRect(4, 2, 6, 4); // Grip
        // Flame effect when shooting
        if (G.mouseDown && player.ammo > 0 && player.shootCooldown === 0) {
            ctx.fillStyle = '#ff0';
            ctx.beginPath();
            ctx.moveTo(28, 0);
            ctx.lineTo(38 + Math.random() * 8, -4 + Math.random() * 8);
            ctx.lineTo(38 + Math.random() * 8, -4 + Math.random() * 8);
            ctx.fill();
        }
    } else if (player.weapon === 'rocketlauncher') {
        // Rocket launcher tube
        ctx.fillStyle = '#3d3d3d';
        ctx.fillRect(4, -5, 24, 10); // Tube
        ctx.fillStyle = weaponColor;
        ctx.fillRect(6, -4, 20, 8); // Inner tube
        ctx.fillStyle = '#222';
        ctx.fillRect(24, -6, 4, 12); // Front rim
        ctx.fillRect(4, -6, 3, 12); // Back rim
        ctx.fillStyle = '#444';
        ctx.fillRect(10, 4, 8, 4); // Handle
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(12, -3, 4, 6); // Rocket visible
    } else if (player.weapon === 'bomb') {
        // Holding a bomb
        ctx.fillStyle = weaponColor;
        ctx.beginPath();
        ctx.arc(12, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        // Fuse
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, -4);
        ctx.quadraticCurveTo(22, -8, 20, -12);
        ctx.stroke();
        // Fuse spark
        ctx.fillStyle = '#ff4500';
        ctx.beginPath();
        ctx.arc(20, -12, 3, 0, Math.PI * 2);
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
}

// Draw remote player (P2) with different color
function drawRemotePlayer() {
    var ctx = G.ctx;
    var rp = G.remotePlayer;
    if (!rp || !rp.connected) return;

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
}
