// Large decorative props rendering per dungeon theme.
function drawLevelProps() {
    var ctx = G.ctx;
    for (const p of G.levelProps) {
        if (G.selectedDungeon === 'jungle') {
            if (p.variant === 0 || p.variant === 1) {
                // Tree
                const trunkH = p.size + 8;
                const canopyR = p.size * 0.8 + 4;
                // Shadow
                ctx.fillStyle = '#0a1a08';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.ellipse(p.x + 3, p.y + 2, canopyR + 2, canopyR * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                // Trunk
                ctx.fillStyle = '#4a3520';
                ctx.fillRect(p.x - 3, p.y - trunkH + canopyR * 0.5, 6, trunkH);
                // Bark detail
                ctx.fillStyle = '#3a2a18';
                ctx.fillRect(p.x - 2, p.y - trunkH + canopyR * 0.5 + 4, 2, 3);
                ctx.fillRect(p.x + 1, p.y - trunkH + canopyR * 0.5 + 10, 2, 2);
                // Roots
                ctx.fillStyle = '#4a3520';
                ctx.fillRect(p.x - 6, p.y - 2, 4, 3);
                ctx.fillRect(p.x + 3, p.y - 1, 5, 2);
                // Canopy layers (overlapping circles)
                const canopyY = p.y - trunkH + canopyR * 0.3;
                ctx.fillStyle = '#1e5a18';
                ctx.beginPath();
                ctx.arc(p.x - canopyR * 0.3, canopyY + 2, canopyR * 0.7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2a7322';
                ctx.beginPath();
                ctx.arc(p.x + canopyR * 0.2, canopyY - 1, canopyR * 0.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#358a2e';
                ctx.beginPath();
                ctx.arc(p.x, canopyY - 3, canopyR * 0.6, 0, Math.PI * 2);
                ctx.fill();
                // Highlight dapples
                ctx.fillStyle = '#4aaa40';
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(p.x - 3, canopyY - 5, canopyR * 0.25, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(p.x + 4, canopyY - 2, canopyR * 0.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                if (p.variant === 1) {
                    // Variant 1: hanging fruit or flowers
                    ctx.fillStyle = '#e06050';
                    ctx.beginPath();
                    ctx.arc(p.x - canopyR * 0.4, canopyY + canopyR * 0.5, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#e0c040';
                    ctx.beginPath();
                    ctx.arc(p.x + canopyR * 0.3, canopyY + canopyR * 0.6, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (p.variant === 2) {
                // Palm tree
                const trunkH = p.size + 10;
                // Shadow
                ctx.fillStyle = '#0a1a08';
                ctx.globalAlpha = 0.15;
                ctx.beginPath();
                ctx.ellipse(p.x + 4, p.y + 2, 12, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                // Curved trunk
                ctx.strokeStyle = '#5a4a30';
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.quadraticCurveTo(p.x + 4, p.y - trunkH * 0.5, p.x + 2, p.y - trunkH);
                ctx.stroke();
                // Trunk rings
                ctx.strokeStyle = '#4a3a22';
                ctx.lineWidth = 1;
                for (let r = 5; r < trunkH - 3; r += 5) {
                    ctx.beginPath();
                    const rx = p.x + 4 * Math.sin(r / trunkH * Math.PI);
                    ctx.moveTo(rx - 3, p.y - r);
                    ctx.lineTo(rx + 3, p.y - r);
                    ctx.stroke();
                }
                // Palm fronds
                const topX = p.x + 2;
                const topY = p.y - trunkH;
                const frondAngles = [-2.4, -1.8, -1.0, -0.3, 0.3, 1.0];
                for (const fa of frondAngles) {
                    const sway = Math.sin(Date.now() / 2000 + fa * 2) * 0.1;
                    ctx.strokeStyle = '#2d7826';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(topX, topY);
                    const endX = topX + Math.cos(fa + sway) * 16;
                    const endY = topY + Math.sin(fa + sway) * 14;
                    ctx.quadraticCurveTo(topX + Math.cos(fa) * 8, topY + Math.sin(fa) * 6 - 2, endX, endY);
                    ctx.stroke();
                    // Leaf segments
                    ctx.strokeStyle = '#3a9030';
                    ctx.lineWidth = 1;
                    for (let seg = 0.3; seg < 0.9; seg += 0.2) {
                        const sx = topX + (endX - topX) * seg;
                        const sy = topY + (endY - topY) * seg - (1 - seg) * 2;
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(sx + Math.cos(fa + 1.2) * 4, sy + Math.sin(fa + 1.2) * 4);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(sx, sy);
                        ctx.lineTo(sx + Math.cos(fa - 1.2) * 4, sy + Math.sin(fa - 1.2) * 4);
                        ctx.stroke();
                    }
                }
                // Coconuts
                ctx.fillStyle = '#5a4020';
                ctx.beginPath();
                ctx.arc(topX - 2, topY + 3, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(topX + 2, topY + 2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Large rock / temple ruin
                ctx.fillStyle = '#5a6a50';
                ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.3, p.size, p.size * 0.6);
                ctx.fillStyle = '#4a5a40';
                ctx.fillRect(p.x - p.size * 0.4, p.y - p.size * 0.5, p.size * 0.8, p.size * 0.3);
                // Moss on top
                ctx.fillStyle = '#2d6b26';
                ctx.fillRect(p.x - p.size * 0.4, p.y - p.size * 0.5, p.size * 0.6, 2);
                // Vine on side
                ctx.fillStyle = '#3a7c33';
                ctx.fillRect(p.x + p.size * 0.4, p.y - p.size * 0.3, 2, p.size * 0.5);
                ctx.fillStyle = '#4a9e40';
                ctx.fillRect(p.x + p.size * 0.4 - 2, p.y - p.size * 0.1, 3, 2);
            }

        } else if (G.selectedDungeon === 'desert') {
            if (p.variant === 0) {
                // Broken pillar
                ctx.fillStyle = '#a08a60';
                ctx.fillRect(p.x - 5, p.y - p.size, 10, p.size);
                ctx.fillStyle = '#b8a070';
                ctx.fillRect(p.x - 7, p.y - p.size, 14, 4);
                ctx.fillRect(p.x - 7, p.y - 3, 14, 3);
                // Cracks
                ctx.strokeStyle = '#806a40';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x - 3, p.y - p.size);
                ctx.lineTo(p.x + 1, p.y - p.size + 6);
                ctx.lineTo(p.x - 1, p.y - p.size + 12);
                ctx.stroke();
                // Sand at base
                ctx.fillStyle = '#4a3c28';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y + 1, 10, 3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (p.variant === 1) {
                // Sarcophagus
                ctx.fillStyle = '#8a7a50';
                ctx.fillRect(p.x - 6, p.y - 10, 12, 20);
                ctx.fillStyle = '#a08a60';
                ctx.fillRect(p.x - 7, p.y - 11, 14, 4);
                ctx.fillRect(p.x - 7, p.y + 7, 14, 4);
                ctx.fillStyle = '#c4a35a';
                ctx.globalAlpha = 0.4;
                ctx.fillRect(p.x - 3, p.y - 7, 6, 14);
                ctx.globalAlpha = 1;
                // Eye detail
                ctx.fillStyle = '#4a3a20';
                ctx.fillRect(p.x - 2, p.y - 4, 2, 2);
                ctx.fillRect(p.x + 1, p.y - 4, 2, 2);
            } else if (p.variant === 2) {
                // Pile of urns
                ctx.fillStyle = '#8a6a40';
                ctx.beginPath();
                ctx.arc(p.x - 4, p.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#9a7a50';
                ctx.beginPath();
                ctx.arc(p.x + 5, p.y + 1, 4, 0, Math.PI * 2);
                ctx.fill();
                // Broken one
                ctx.fillStyle = '#7a5a30';
                ctx.beginPath();
                ctx.arc(p.x, p.y - 6, 3, Math.PI, 0);
                ctx.fill();
                // Sand spilling
                ctx.fillStyle = '#c4a35a';
                ctx.globalAlpha = 0.3;
                ctx.fillRect(p.x - 1, p.y - 3, 3, 5);
                ctx.globalAlpha = 1;
            } else {
                // Rock formation
                ctx.fillStyle = '#7a6a4a';
                ctx.beginPath();
                ctx.moveTo(p.x - 8, p.y + 3);
                ctx.lineTo(p.x - 3, p.y - p.size * 0.5);
                ctx.lineTo(p.x + 4, p.y - p.size * 0.3);
                ctx.lineTo(p.x + 8, p.y + 3);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#8a7a5a';
                ctx.fillRect(p.x - 2, p.y - p.size * 0.5 + 2, 4, 3);
            }

        } else if (G.selectedDungeon === 'ice') {
            if (p.variant === 0) {
                // Ice stalagmite
                ctx.fillStyle = '#7ab0cc';
                ctx.beginPath();
                ctx.moveTo(p.x - 5, p.y + 2);
                ctx.lineTo(p.x - 1, p.y - p.size);
                ctx.lineTo(p.x + 1, p.y - p.size);
                ctx.lineTo(p.x + 5, p.y + 2);
                ctx.closePath();
                ctx.fill();
                // Shine
                ctx.fillStyle = '#b0d8e8';
                ctx.fillRect(p.x - 1, p.y - p.size + 3, 2, p.size - 5);
                ctx.fillStyle = '#d4eef8';
                ctx.fillRect(p.x, p.y - p.size + 5, 1, p.size * 0.4);
            } else if (p.variant === 1) {
                // Frozen boulder
                ctx.fillStyle = '#5a7a8a';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#8aaab8';
                ctx.beginPath();
                ctx.arc(p.x - 2, p.y - 2, p.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Ice overlay
                ctx.fillStyle = '#aadcee';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.55, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (p.variant === 2) {
                // Ice crystal cluster
                ctx.fillStyle = '#8ecae6';
                for (let c = 0; c < 4; c++) {
                    const ang = c * Math.PI / 2 + 0.3;
                    const len = p.size * 0.4 + c * 2;
                    ctx.beginPath();
                    ctx.moveTo(p.x - Math.cos(ang) * 2, p.y - Math.sin(ang) * 2);
                    ctx.lineTo(p.x + Math.cos(ang + 0.15) * len, p.y + Math.sin(ang + 0.15) * len);
                    ctx.lineTo(p.x + Math.cos(ang - 0.15) * len, p.y + Math.sin(ang - 0.15) * len);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.fillStyle = '#d4eef8';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Snowdrift
                ctx.fillStyle = '#8aaab8';
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#a0c0d0';
                ctx.beginPath();
                ctx.ellipse(p.x - 2, p.y - 1, p.size * 0.6, p.size * 0.25, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

        } else if (G.selectedDungeon === 'volcano') {
            if (p.variant === 0) {
                // Obsidian spike
                ctx.fillStyle = '#1a1210';
                ctx.beginPath();
                ctx.moveTo(p.x - 4, p.y + 2);
                ctx.lineTo(p.x, p.y - p.size);
                ctx.lineTo(p.x + 4, p.y + 2);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#2a2220';
                ctx.fillRect(p.x - 1, p.y - p.size + 4, 2, p.size * 0.3);
                // Red glow at base
                ctx.fillStyle = '#ff4500';
                ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 1000 + p.x) * 0.1;
                ctx.beginPath();
                ctx.arc(p.x, p.y + 2, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (p.variant === 1) {
                // Lava pool (larger)
                const pulse = Math.sin(Date.now() / 900 + p.x * p.y) * 0.1;
                ctx.fillStyle = '#8b2500';
                ctx.globalAlpha = 0.5 + pulse;
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.size * 0.7, p.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#cc4400';
                ctx.beginPath();
                ctx.ellipse(p.x, p.y, p.size * 0.4, p.size * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ff6600';
                ctx.beginPath();
                ctx.ellipse(p.x + 1, p.y - 1, p.size * 0.2, p.size * 0.15, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else if (p.variant === 2) {
                // Charred tree stump
                ctx.fillStyle = '#1a1008';
                ctx.fillRect(p.x - 5, p.y - 6, 10, 8);
                ctx.fillStyle = '#2a1a10';
                ctx.fillRect(p.x - 6, p.y - 3, 12, 5);
                // Embers
                ctx.fillStyle = '#ff4500';
                ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 600 + p.y) * 0.2;
                ctx.fillRect(p.x - 2, p.y - 7, 1, 2);
                ctx.fillRect(p.x + 2, p.y - 6, 1, 1);
                ctx.globalAlpha = 1;
            } else {
                // Volcanic boulder
                ctx.fillStyle = '#3a2218';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#4a3228';
                ctx.beginPath();
                ctx.arc(p.x - 2, p.y - 2, p.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                // Lava crack
                ctx.strokeStyle = '#ff4500';
                ctx.globalAlpha = 0.4;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x - p.size * 0.3, p.y);
                ctx.lineTo(p.x + p.size * 0.3, p.y - 1);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

        } else {
            // Dark Dungeon
            if (p.variant === 0) {
                // Stone pillar
                ctx.fillStyle = '#5a5a78';
                ctx.fillRect(p.x - 5, p.y - p.size, 10, p.size);
                // Capital
                ctx.fillStyle = '#6a6a88';
                ctx.fillRect(p.x - 7, p.y - p.size, 14, 4);
                // Base
                ctx.fillRect(p.x - 7, p.y - 3, 14, 3);
                // Highlight
                ctx.fillStyle = '#7a7a98';
                ctx.fillRect(p.x - 4, p.y - p.size + 4, 2, p.size - 7);
            } else if (p.variant === 1) {
                // Barrel
                ctx.fillStyle = '#5a4030';
                ctx.fillRect(p.x - 5, p.y - 7, 10, 14);
                ctx.fillStyle = '#6a5040';
                ctx.fillRect(p.x - 6, p.y - 5, 12, 3);
                ctx.fillRect(p.x - 6, p.y + 2, 12, 3);
                // Metal bands
                ctx.fillStyle = '#4a4a5a';
                ctx.fillRect(p.x - 6, p.y - 7, 12, 1);
                ctx.fillRect(p.x - 6, p.y + 6, 12, 1);
            } else if (p.variant === 2) {
                // Crate
                ctx.fillStyle = '#5a4830';
                ctx.fillRect(p.x - 7, p.y - 7, 14, 14);
                ctx.fillStyle = '#4a3820';
                ctx.fillRect(p.x - 7, p.y, 14, 1);
                ctx.fillRect(p.x, p.y - 7, 1, 14);
                // Nail
                ctx.fillStyle = '#888';
                ctx.fillRect(p.x - 4, p.y - 4, 1, 1);
                ctx.fillRect(p.x + 3, p.y + 3, 1, 1);
            } else {
                // Broken statue
                ctx.fillStyle = '#5a5a6a';
                // Base
                ctx.fillRect(p.x - 6, p.y - 3, 12, 5);
                // Broken torso
                ctx.fillRect(p.x - 4, p.y - 10, 8, 8);
                // One arm stub
                ctx.fillRect(p.x + 4, p.y - 8, 4, 3);
                // Rubble
                ctx.fillStyle = '#4a4a5a';
                ctx.fillRect(p.x - 8, p.y + 1, 3, 2);
                ctx.fillRect(p.x + 6, p.y + 2, 4, 2);
            }
        }
    }
}
