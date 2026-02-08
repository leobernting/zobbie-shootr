// Floor decoration rendering per dungeon theme.
function drawFloorDecorations() {
    var ctx = G.ctx;
    for (const d of G.floorDecorations) {
        if (G.selectedDungeon === 'jungle') {
            if (d.variant === 0) {
                // Small bush / fern
                ctx.fillStyle = '#1e4d18';
                ctx.fillRect(d.x - 3, d.y, 6, 3);
                ctx.fillStyle = '#2a6322';
                ctx.fillRect(d.x - 2, d.y - 2, 4, 3);
                ctx.fillStyle = '#3a7c33';
                ctx.fillRect(d.x - 1, d.y - 3, 2, 2);
            } else if (d.variant === 1) {
                // Fallen leaves
                ctx.fillStyle = '#3a5a1e';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(d.x, d.y, 3, 2);
                ctx.fillRect(d.x + 4, d.y + 2, 2, 2);
                ctx.fillStyle = '#5a7a2e';
                ctx.fillRect(d.x - 2, d.y + 1, 2, 2);
                ctx.globalAlpha = 1;
            } else if (d.variant === 2) {
                // Mushroom
                ctx.fillStyle = '#5d3a1e';
                ctx.fillRect(d.x, d.y + 1, 2, 3);
                ctx.fillStyle = '#c84040';
                ctx.beginPath();
                ctx.arc(d.x + 1, d.y, 3, Math.PI, 0);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.fillRect(d.x - 1, d.y - 1, 1, 1);
                ctx.fillRect(d.x + 2, d.y - 2, 1, 1);
            } else if (d.variant === 3) {
                // Moss patch on ground
                ctx.fillStyle = '#1e4d18';
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2d6b26';
                ctx.beginPath();
                ctx.arc(d.x + 1, d.y - 1, d.size * 0.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 4) {
                // Small flowers
                ctx.fillStyle = '#2a5a20';
                ctx.fillRect(d.x, d.y, 1, 4);
                ctx.fillRect(d.x + 5, d.y + 1, 1, 3);
                const flowerColors = ['#e8e850', '#e06090', '#8060d0'];
                ctx.fillStyle = flowerColors[d.size % 3];
                ctx.fillRect(d.x - 1, d.y - 1, 3, 2);
                ctx.fillRect(d.x + 4, d.y, 3, 2);
            } else if (d.variant === 5) {
                // Tree roots / ground crack
                ctx.strokeStyle = '#1a3a12';
                ctx.globalAlpha = 0.5;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(d.x - d.size, d.y);
                ctx.quadraticCurveTo(d.x, d.y - 2, d.x + d.size, d.y + 1);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + 2, d.y + d.size);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else if (d.variant === 10) {
                // Grass tufts
                const blades = 3 + d.size;
                for (let b = 0; b < blades; b++) {
                    const bx = d.x - d.size + b * (d.size * 2 / blades);
                    const bladeH = 4 + (b * 3 + d.x) % 5;
                    const sway = Math.sin(Date.now() / 1500 + bx * 0.3) * 1.5;
                    ctx.strokeStyle = b % 3 === 0 ? '#3a8a30' : (b % 3 === 1 ? '#2d6b26' : '#4a9e40');
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(bx, d.y);
                    ctx.quadraticCurveTo(bx + sway, d.y - bladeH * 0.6, bx + sway * 1.5, d.y - bladeH);
                    ctx.stroke();
                }
            }

        } else if (G.selectedDungeon === 'desert') {
            if (d.variant === 0) {
                // Sand ripples
                ctx.strokeStyle = '#4a3c28';
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 1;
                for (let r = 0; r < 3; r++) {
                    ctx.beginPath();
                    ctx.moveTo(d.x - 6, d.y + r * 4);
                    ctx.quadraticCurveTo(d.x, d.y + r * 4 - 2, d.x + 6, d.y + r * 4);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            } else if (d.variant === 1) {
                // Small rocks / rubble
                ctx.fillStyle = '#5a4a36';
                ctx.fillRect(d.x, d.y, 3, 2);
                ctx.fillStyle = '#6a5a46';
                ctx.fillRect(d.x + 4, d.y + 1, 2, 2);
                ctx.fillRect(d.x - 1, d.y + 2, 2, 1);
            } else if (d.variant === 2) {
                // Scattered bones
                ctx.fillStyle = '#d4c8a0';
                ctx.globalAlpha = 0.6;
                ctx.fillRect(d.x - 3, d.y, 6, 1);
                ctx.fillRect(d.x, d.y - 2, 1, 5);
                ctx.fillRect(d.x + 3, d.y - 1, 1, 3);
                ctx.globalAlpha = 1;
            } else if (d.variant === 3) {
                // Sand pile
                ctx.fillStyle = '#4a3c28';
                ctx.globalAlpha = 0.25;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size + 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 4) {
                // Cracked tile
                ctx.strokeStyle = '#5a4a36';
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 1;
                ctx.strokeRect(d.x - 4, d.y - 4, 8, 8);
                ctx.beginPath();
                ctx.moveTo(d.x - 4, d.y);
                ctx.lineTo(d.x + 2, d.y + 3);
                ctx.lineTo(d.x + 4, d.y - 1);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else {
                // Scarab beetle shape
                ctx.fillStyle = '#2a4a2a';
                ctx.globalAlpha = 0.35;
                ctx.beginPath();
                ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(d.x - 3, d.y - 1, 1, 2);
                ctx.fillRect(d.x + 2, d.y - 1, 1, 2);
                ctx.globalAlpha = 1;
            }

        } else if (G.selectedDungeon === 'ice') {
            if (d.variant === 0) {
                // Ice crack on floor
                ctx.strokeStyle = '#4a7a8f';
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(d.x - d.size, d.y);
                ctx.lineTo(d.x, d.y + 1);
                ctx.lineTo(d.x + d.size, d.y - 1);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x, d.y + 1);
                ctx.lineTo(d.x - 2, d.y + d.size);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x, d.y + 1);
                ctx.lineTo(d.x + 3, d.y + d.size - 1);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else if (d.variant === 1) {
                // Frozen puddle
                ctx.fillStyle = '#3a6a7f';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.size + 2, d.size, 0, 0, Math.PI * 2);
                ctx.fill();
                // Shine
                ctx.fillStyle = '#8ecae6';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(d.x - 2, d.y - 1, 3, 1);
                ctx.globalAlpha = 1;
            } else if (d.variant === 2) {
                // Snow pile
                ctx.fillStyle = '#8aaab8';
                ctx.globalAlpha = 0.25;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#a0c0d0';
                ctx.beginPath();
                ctx.arc(d.x - 1, d.y - 1, d.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 3) {
                // Ice crystal on floor
                ctx.strokeStyle = '#8ecae6';
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 1;
                for (let a = 0; a < 3; a++) {
                    const ang = a * Math.PI / 3;
                    ctx.beginPath();
                    ctx.moveTo(d.x - Math.cos(ang) * 4, d.y - Math.sin(ang) * 4);
                    ctx.lineTo(d.x + Math.cos(ang) * 4, d.y + Math.sin(ang) * 4);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            } else if (d.variant === 4) {
                // Frost pattern
                ctx.fillStyle = '#6a9aaf';
                ctx.globalAlpha = 0.15;
                ctx.fillRect(d.x - 3, d.y - 3, 6, 6);
                ctx.fillStyle = '#8ecae6';
                ctx.fillRect(d.x - 1, d.y - 4, 2, 8);
                ctx.fillRect(d.x - 4, d.y - 1, 8, 2);
                ctx.globalAlpha = 1;
            } else {
                // Frozen bones
                ctx.fillStyle = '#90b0c0';
                ctx.globalAlpha = 0.4;
                ctx.fillRect(d.x - 3, d.y, 6, 1);
                ctx.fillRect(d.x, d.y - 2, 1, 5);
                ctx.globalAlpha = 1;
            }

        } else if (G.selectedDungeon === 'volcano') {
            if (d.variant === 0) {
                // Lava crack in floor
                ctx.strokeStyle = '#ff4500';
                ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 1000 + d.x) * 0.15;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(d.x - d.size, d.y + 1);
                ctx.lineTo(d.x - 1, d.y - 1);
                ctx.lineTo(d.x + d.size, d.y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x - 1, d.y - 1);
                ctx.lineTo(d.x + 1, d.y + d.size);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else if (d.variant === 1) {
                // Scorch mark
                ctx.fillStyle = '#1a0e08';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.size + 1, d.size, d.x % 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 2) {
                // Small lava pool
                ctx.fillStyle = '#cc3300';
                ctx.globalAlpha = 0.35 + Math.sin(Date.now() / 800 + d.y) * 0.1;
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.size, d.size - 1, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.size * 0.5, d.size * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 3) {
                // Cooled lava rock
                ctx.fillStyle = '#2a1a14';
                ctx.fillRect(d.x - 2, d.y - 1, 4, 3);
                ctx.fillStyle = '#3a2a20';
                ctx.fillRect(d.x - 1, d.y - 2, 3, 2);
            } else if (d.variant === 4) {
                // Ash patch
                ctx.fillStyle = '#1a1210';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size + 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else {
                // Glowing ember in floor
                const pulse = Math.sin(Date.now() / 500 + d.x * d.y) * 0.3 + 0.5;
                ctx.fillStyle = '#ff4500';
                ctx.globalAlpha = pulse * 0.4;
                ctx.beginPath();
                ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

        } else {
            // Dark Dungeon
            if (d.variant === 0) {
                // Cracked stone tiles
                ctx.strokeStyle = '#3d3d5a';
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 1;
                ctx.strokeRect(d.x - 5, d.y - 5, 10, 10);
                ctx.beginPath();
                ctx.moveTo(d.x - 5, d.y + 2);
                ctx.lineTo(d.x, d.y - 1);
                ctx.lineTo(d.x + 5, d.y + 1);
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else if (d.variant === 1) {
                // Rubble pile
                ctx.fillStyle = '#4a4a68';
                ctx.fillRect(d.x - 2, d.y, 3, 2);
                ctx.fillRect(d.x + 1, d.y - 1, 2, 2);
                ctx.fillStyle = '#3a3a58';
                ctx.fillRect(d.x - 1, d.y + 1, 4, 2);
            } else if (d.variant === 2) {
                // Old bones
                ctx.fillStyle = '#8888a0';
                ctx.globalAlpha = 0.4;
                ctx.fillRect(d.x - 4, d.y, 8, 1);
                ctx.fillRect(d.x - 1, d.y - 3, 1, 7);
                // Skull
                ctx.beginPath();
                ctx.arc(d.x + 4, d.y - 1, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (d.variant === 3) {
                // Puddle / water stain
                ctx.fillStyle = '#2a2a44';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.ellipse(d.x, d.y, d.size + 1, d.size - 1, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#3a3a5a';
                ctx.globalAlpha = 0.15;
                ctx.fillRect(d.x - 1, d.y - 1, 2, 1);
                ctx.globalAlpha = 1;
            } else if (d.variant === 4) {
                // Chains on floor
                ctx.strokeStyle = '#6a6a82';
                ctx.globalAlpha = 0.3;
                ctx.lineWidth = 1;
                for (let c = 0; c < 3; c++) {
                    ctx.beginPath();
                    ctx.arc(d.x + c * 4 - 4, d.y, 2, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
            } else {
                // Cobweb corner
                ctx.strokeStyle = '#5a5a72';
                ctx.globalAlpha = 0.2;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(d.x - 5, d.y - 5);
                ctx.quadraticCurveTo(d.x, d.y - 2, d.x + 5, d.y - 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x - 5, d.y - 5);
                ctx.quadraticCurveTo(d.x - 2, d.y, d.x - 5, d.y + 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(d.x - 4, d.y - 3);
                ctx.lineTo(d.x - 2, d.y - 1);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // Boss arena special decorations (all dungeons)
        if (d.variant === 20) {
            // Boss arena skull pattern in center
            const s = d.size / 60; // Scale factor
            ctx.fillStyle = '#4a0000';
            ctx.globalAlpha = 0.3;
            // Skull outline
            ctx.beginPath();
            ctx.arc(d.x, d.y - 10*s, 25*s, Math.PI, 0); // Top of skull
            ctx.lineTo(d.x + 20*s, d.y + 15*s);
            ctx.quadraticCurveTo(d.x, d.y + 25*s, d.x - 20*s, d.y + 15*s);
            ctx.closePath();
            ctx.fill();
            // Eye sockets
            ctx.fillStyle = '#1a0000';
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.ellipse(d.x - 10*s, d.y - 5*s, 6*s, 8*s, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(d.x + 10*s, d.y - 5*s, 6*s, 8*s, 0, 0, Math.PI * 2);
            ctx.fill();
            // Nose
            ctx.beginPath();
            ctx.moveTo(d.x, d.y + 2*s);
            ctx.lineTo(d.x - 4*s, d.y + 12*s);
            ctx.lineTo(d.x + 4*s, d.y + 12*s);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        } else if (d.variant === 21) {
            // Boss arena torch (animated flame)
            const flicker = Math.sin(Date.now() / 150 + d.x * 10) * 2;
            const flicker2 = Math.cos(Date.now() / 200 + d.y * 10) * 1.5;
            // Torch base
            ctx.fillStyle = '#4a3020';
            ctx.fillRect(d.x - 2, d.y, 4, 8);
            // Flame glow
            ctx.fillStyle = '#ff4500';
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(d.x, d.y - 4, d.size + 4, 0, Math.PI * 2);
            ctx.fill();
            // Inner flame
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(d.x - 4 + flicker2, d.y);
            ctx.quadraticCurveTo(d.x - 5 + flicker, d.y - 8 - Math.abs(flicker), d.x + flicker2, d.y - 14 - Math.abs(flicker));
            ctx.quadraticCurveTo(d.x + 5 + flicker, d.y - 8 - Math.abs(flicker2), d.x + 4 + flicker2, d.y);
            ctx.closePath();
            ctx.fill();
            // Core flame
            ctx.fillStyle = '#ffff00';
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.moveTo(d.x - 2, d.y);
            ctx.quadraticCurveTo(d.x - 2 + flicker * 0.5, d.y - 5, d.x, d.y - 10 - Math.abs(flicker * 0.5));
            ctx.quadraticCurveTo(d.x + 2 + flicker * 0.5, d.y - 5, d.x + 2, d.y);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}
