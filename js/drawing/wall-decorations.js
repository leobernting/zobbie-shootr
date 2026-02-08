// Wall decoration rendering per dungeon theme.

function drawWallDecorations(wall) {
    var ctx = G.ctx;
    var COLORS = G.COLORS;
    var W = G.W;
    const wx = Math.floor(wall.x);
    const wy = Math.floor(wall.y);
    const ww = wall.w;
    const wh = wall.h;
    const isHoriz = wh <= 20;
    const isVert = ww <= 20;

    if (G.selectedDungeon === 'jungle') {
        // Vines hanging from horizontal walls
        if (isHoriz) {
            ctx.fillStyle = '#3a7c33';
            for (let vx = wx + 6; vx < wx + ww - 6; vx += 14 + ((vx * 7 + wy) % 10)) {
                const vineLen = 10 + ((vx * 3 + wy * 5) % 18);
                const sway = Math.sin(Date.now() / 2000 + vx * 0.1) * 2;
                ctx.fillRect(vx + sway * 0.3, wy + wh, 2, vineLen);
                // Leaves at intervals
                ctx.fillStyle = '#4a9e40';
                ctx.fillRect(vx - 3 + sway * 0.5, wy + wh + 3, 4, 3);
                ctx.fillRect(vx + 1 + sway * 0.7, wy + wh + 8, 5, 3);
                if (vineLen > 12) {
                    ctx.fillRect(vx - 2 + sway, wy + wh + 14, 3, 2);
                    ctx.fillStyle = '#5ab84e';
                    ctx.fillRect(vx + 2, wy + wh + 12, 4, 2);
                }
                if (vineLen > 18) {
                    ctx.fillStyle = '#3a7c33';
                    ctx.fillRect(vx - 1, wy + wh + 18, 3, 3);
                }
                ctx.fillStyle = '#3a7c33';
            }
            // Hanging vines on TOP of wall
            for (let vx = wx + 12; vx < wx + ww - 12; vx += 22 + ((vx * 11 + wy) % 14)) {
                ctx.fillStyle = '#2d6b26';
                const topLen = 5 + ((vx * 5 + wy) % 8);
                ctx.fillRect(vx, wy - topLen, 1, topLen);
                ctx.fillStyle = '#4a9e40';
                ctx.fillRect(vx - 2, wy - topLen + 2, 3, 2);
            }
        }
        if (isVert) {
            // Vines on both sides of vertical walls
            for (let vy = wy + 8; vy < wy + wh - 8; vy += 16 + ((wx * 3 + vy) % 8)) {
                const vineLen = 8 + ((wx * 5 + vy * 3) % 12);
                ctx.fillStyle = '#3a7c33';
                // Right side
                ctx.fillRect(wx + ww, vy, vineLen, 2);
                ctx.fillStyle = '#4a9e40';
                ctx.fillRect(wx + ww + 3, vy - 2, 3, 3);
                ctx.fillRect(wx + ww + 7, vy + 1, 3, 2);
                // Left side
                ctx.fillStyle = '#3a7c33';
                const vineLen2 = 5 + ((wx * 7 + vy) % 8);
                ctx.fillRect(wx - vineLen2, vy + 5, vineLen2, 2);
                ctx.fillStyle = '#4a9e40';
                ctx.fillRect(wx - vineLen2 + 1, vy + 3, 3, 3);
            }
        }
        // Moss/lichen patches on all walls
        ctx.fillStyle = '#2d6b26';
        ctx.globalAlpha = 0.5;
        for (let mx = wx + 3; mx < wx + ww - 4; mx += 10 + ((mx + wy) % 6)) {
            ctx.fillRect(mx, wy + 1, 4 + ((mx * 3) % 4), 3);
            ctx.fillRect(mx + 1, wy + wh - 4, 3 + ((mx * 7) % 3), 2);
        }
        ctx.globalAlpha = 1;
        // Flower buds on wall top
        if (isHoriz) {
            for (let fx = wx + 15; fx < wx + ww - 15; fx += 30 + ((fx * 13 + wy) % 20)) {
                ctx.fillStyle = '#2a5a20';
                ctx.fillRect(fx, wy - 5, 1, 5);
                ctx.fillStyle = ((fx * 7) % 3 === 0) ? '#e8e850' : ((fx * 7) % 3 === 1) ? '#e06090' : '#8060d0';
                ctx.fillRect(fx - 2, wy - 7, 5, 3);
            }
        }

    } else if (G.selectedDungeon === 'desert') {
        // Hieroglyphs on horizontal walls
        if (isHoriz) {
            ctx.fillStyle = '#b8956a';
            ctx.globalAlpha = 0.4;
            for (let hx = wx + 8; hx < wx + ww - 8; hx += 18 + ((hx + wy) % 8)) {
                const sym = (hx * 3 + wy * 7) % 6;
                if (sym === 0) {
                    // Eye of Horus
                    ctx.fillRect(hx, wy + 5, 6, 2);
                    ctx.fillRect(hx + 2, wy + 3, 2, 6);
                    ctx.fillRect(hx + 5, wy + 7, 3, 4);
                } else if (sym === 1) {
                    // Ankh
                    ctx.beginPath();
                    ctx.arc(hx + 3, wy + 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillRect(hx + 2, wy + 8, 2, 6);
                    ctx.fillRect(hx, wy + 10, 6, 2);
                } else if (sym === 2) {
                    // Water waves
                    ctx.fillRect(hx, wy + 7, 2, 2);
                    ctx.fillRect(hx + 3, wy + 5, 2, 2);
                    ctx.fillRect(hx + 6, wy + 7, 2, 2);
                    ctx.fillRect(hx + 9, wy + 5, 2, 2);
                } else if (sym === 3) {
                    // Pyramid
                    ctx.beginPath();
                    ctx.moveTo(hx + 5, wy + 3);
                    ctx.lineTo(hx, wy + 13);
                    ctx.lineTo(hx + 10, wy + 13);
                    ctx.closePath();
                    ctx.fill();
                } else if (sym === 4) {
                    // Bird shape (Ibis)
                    ctx.fillRect(hx + 2, wy + 4, 5, 3);
                    ctx.fillRect(hx, wy + 5, 2, 2);
                    ctx.fillRect(hx + 7, wy + 3, 3, 1);
                    ctx.fillRect(hx + 3, wy + 7, 1, 4);
                    ctx.fillRect(hx + 5, wy + 7, 1, 4);
                } else {
                    // Sun disc
                    ctx.beginPath();
                    ctx.arc(hx + 4, wy + 8, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillRect(hx, wy + 3, 1, 3);
                    ctx.fillRect(hx + 8, wy + 3, 1, 3);
                }
            }
            ctx.globalAlpha = 1;
            // Sand piling at base
            ctx.fillStyle = '#4a3c28';
            ctx.globalAlpha = 0.15;
            for (let sx = wx; sx < wx + ww; sx += 12 + ((sx + wy) % 8)) {
                const pile = 2 + ((sx * 3 + wy) % 4);
                ctx.beginPath();
                ctx.moveTo(sx, wy + wh);
                ctx.lineTo(sx + 8, wy + wh);
                ctx.lineTo(sx + 4, wy + wh + pile);
                ctx.closePath();
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        if (isVert) {
            // Vertical cracks and sand erosion
            ctx.fillStyle = '#b8956a';
            ctx.globalAlpha = 0.3;
            for (let cy = wy + 6; cy < wy + wh - 6; cy += 14 + ((wx + cy) % 10)) {
                ctx.fillRect(wx + 3, cy, ww - 6, 1);
                ctx.fillRect(wx + 5, cy - 2, 1, 5);
                ctx.fillRect(wx + ww - 6, cy + 3, 1, 4);
            }
            ctx.globalAlpha = 1;
            // Sand spilling from cracks
            ctx.fillStyle = '#4a3c28';
            ctx.globalAlpha = 0.15;
            for (let sy = wy + 15; sy < wy + wh - 15; sy += 25 + ((wx + sy) % 12)) {
                ctx.fillRect(wx + ww, sy, 3, 2);
                ctx.fillRect(wx + ww + 1, sy + 2, 2, 3);
            }
            ctx.globalAlpha = 1;
        }
        // Worn/chipped edges
        ctx.fillStyle = COLORS.floor;
        ctx.globalAlpha = 0.3;
        for (let cx = wx + 5; cx < wx + ww - 5; cx += 20 + ((cx + wy) % 10)) {
            ctx.fillRect(cx, wy, 3, 2);
            ctx.fillRect(cx + 7, wy + wh - 2, 2, 2);
        }
        ctx.globalAlpha = 1;

    } else if (G.selectedDungeon === 'ice') {
        // Icicles on horizontal walls (top and bottom)
        if (isHoriz) {
            // Bottom icicles
            for (let ix = wx + 5; ix < wx + ww - 5; ix += 8 + ((ix + wy) % 6)) {
                const iceLen = 6 + ((ix * 3 + wy) % 12);
                ctx.fillStyle = '#aadcee';
                ctx.beginPath();
                ctx.moveTo(ix - 2, wy + wh);
                ctx.lineTo(ix + 2, wy + wh);
                ctx.lineTo(ix, wy + wh + iceLen);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#d4eef8';
                ctx.fillRect(ix, wy + wh + 1, 1, Math.max(1, iceLen - 3));
            }
            // Top icicles (shorter, going up)
            for (let ix = wx + 10; ix < wx + ww - 10; ix += 12 + ((ix * 7 + wy) % 10)) {
                const iceLen = 3 + ((ix * 5 + wy) % 6);
                ctx.fillStyle = '#9acade';
                ctx.beginPath();
                ctx.moveTo(ix - 1, wy);
                ctx.lineTo(ix + 1, wy);
                ctx.lineTo(ix, wy - iceLen);
                ctx.closePath();
                ctx.fill();
            }
            // Frost shimmer on wall surface
            ctx.fillStyle = '#c0e0f0';
            ctx.globalAlpha = 0.15;
            ctx.fillRect(wx, wy, ww, wh);
            ctx.globalAlpha = 1;
        }
        if (isVert) {
            // Side icicles
            for (let iy = wy + 6; iy < wy + wh - 6; iy += 10 + ((wx + iy) % 8)) {
                const iceLen = 4 + ((wx * 3 + iy) % 8);
                // Right side
                ctx.fillStyle = '#aadcee';
                ctx.beginPath();
                ctx.moveTo(wx + ww, iy - 1);
                ctx.lineTo(wx + ww, iy + 1);
                ctx.lineTo(wx + ww + iceLen, iy);
                ctx.closePath();
                ctx.fill();
                // Left side
                const iceLen2 = 3 + ((wx * 7 + iy) % 6);
                ctx.beginPath();
                ctx.moveTo(wx, iy + 4);
                ctx.lineTo(wx, iy + 6);
                ctx.lineTo(wx - iceLen2, iy + 5);
                ctx.closePath();
                ctx.fill();
            }
            // Frost crystals
            ctx.fillStyle = '#8ecae6';
            ctx.globalAlpha = 0.3;
            for (let fy = wy + 5; fy < wy + wh - 5; fy += 12 + ((wx + fy) % 6)) {
                ctx.fillRect(wx + 2, fy, 3, 3);
                ctx.fillRect(wx + ww - 5, fy + 4, 3, 3);
            }
            ctx.globalAlpha = 1;
        }
        // Frost overlay on wall
        ctx.fillStyle = '#c0e0f0';
        ctx.globalAlpha = 0.08;
        ctx.fillRect(wx, wy, ww, wh);
        ctx.globalAlpha = 1;

    } else if (G.selectedDungeon === 'volcano') {
        // Glowing cracks
        if (isHoriz) {
            const glow = 0.4 + Math.sin(Date.now() / 1500) * 0.15;
            ctx.fillStyle = '#ff6600';
            ctx.globalAlpha = glow;
            for (let cx = wx + 6; cx < wx + ww - 8; cx += 12 + ((cx + wy) % 8)) {
                // Main crack
                ctx.fillRect(cx, wy + 5, 8, 1);
                // Branches
                ctx.fillRect(cx + 2, wy + 3, 1, 5);
                ctx.fillRect(cx + 6, wy + 2, 1, 4);
                // Wider glow under crack
                ctx.globalAlpha = glow * 0.3;
                ctx.fillRect(cx - 1, wy + 4, 10, 3);
                ctx.globalAlpha = glow;
            }
            // Glow on edges
            ctx.fillStyle = '#ff4500';
            ctx.globalAlpha = 0.15;
            ctx.fillRect(wx, wy + wh - 2, ww, 3);
            ctx.fillRect(wx, wy, ww, 2);
            ctx.globalAlpha = 1;
            // Charred spots
            ctx.fillStyle = '#1a0c06';
            ctx.globalAlpha = 0.3;
            for (let sx = wx + 10; sx < wx + ww - 10; sx += 25 + ((sx + wy) % 15)) {
                ctx.beginPath();
                ctx.arc(sx, wy + wh + 4, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        if (isVert) {
            const glow = 0.35 + Math.sin(Date.now() / 1500 + 1) * 0.1;
            ctx.fillStyle = '#ff6600';
            ctx.globalAlpha = glow;
            for (let cy = wy + 8; cy < wy + wh - 8; cy += 14 + ((wx + cy) % 10)) {
                ctx.fillRect(wx + 3, cy, 1, 10);
                ctx.fillRect(wx + ww - 4, cy + 5, 1, 10);
                ctx.fillRect(wx + 2, cy + 4, 5, 1);
            }
            // Edge glow
            ctx.fillStyle = '#ff4500';
            ctx.globalAlpha = 0.12;
            ctx.fillRect(wx + ww - 1, wy, 2, wh);
            ctx.fillRect(wx - 1, wy, 2, wh);
            ctx.globalAlpha = 1;
        }
        // Soot / dark patches
        ctx.fillStyle = '#0a0604';
        ctx.globalAlpha = 0.2;
        for (let dx = wx + 4; dx < wx + ww - 4; dx += 16 + ((dx + wy) % 8)) {
            ctx.fillRect(dx, wy + 2, 5, 3);
        }
        ctx.globalAlpha = 1;

    } else {
        // Dark Dungeon - full brickwork
        ctx.fillStyle = '#7d7daa';
        ctx.globalAlpha = 0.2;
        if (isHoriz) {
            // Brick rows
            ctx.fillRect(wx, wy + 8, ww, 1);
            for (let bx = wx + 10; bx < wx + ww; bx += 20 + ((bx + wy) % 5)) {
                ctx.fillRect(bx, wy + 1, 1, 7);
                ctx.fillRect(bx + 10, wy + 9, 1, 7);
            }
            // Weathered edges
            ctx.fillStyle = COLORS.floor;
            ctx.globalAlpha = 0.15;
            for (let ex = wx + 8; ex < wx + ww - 8; ex += 22 + ((ex + wy) % 10)) {
                ctx.fillRect(ex, wy + wh - 1, 3, 2);
                ctx.fillRect(ex + 6, wy, 2, 2);
            }
        } else {
            // Vertical brickwork
            for (let by = wy + 8; by < wy + wh; by += 10) {
                ctx.fillStyle = '#7d7daa';
                ctx.globalAlpha = 0.2;
                ctx.fillRect(wx + 2, by, ww - 4, 1);
            }
        }
        ctx.globalAlpha = 1;

        // Torches on long walls
        const torchPositions = [];
        if (isHoriz && ww > 50) {
            for (let tx = wx + 25; tx < wx + ww - 20; tx += 50 + ((tx + wy) % 18)) {
                torchPositions.push({ x: tx, y: wy - 6, side: 'top' });
            }
        } else if (isVert && wh > 40) {
            for (let ty = wy + 18; ty < wy + wh - 18; ty += 45 + ((wx + ty) % 16)) {
                torchPositions.push({ x: wx + ww + 3, y: ty, side: 'right' });
            }
        }
        for (const tp of torchPositions) {
            // Bracket
            ctx.fillStyle = '#5d4e37';
            ctx.fillRect(tp.x - 1, tp.y + 2, 3, 6);
            // Flame (flickering)
            const flicker = Math.sin(Date.now() / 200 + tp.x + tp.y) * 1;
            ctx.fillStyle = '#ff8c00';
            ctx.fillRect(tp.x - 2 + flicker * 0.3, tp.y - 2, 5, 4);
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(tp.x - 1, tp.y - 4, 3, 3);
            ctx.fillStyle = '#fff';
            ctx.fillRect(tp.x, tp.y - 3, 1, 2);
            // Light glow
            ctx.fillStyle = '#ffcc00';
            ctx.globalAlpha = 0.06;
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Cobwebs in corners where walls meet outer edges
        if (isHoriz && (wx <= 20 || wx + ww >= W - 20)) {
            const cobX = wx <= 20 ? wx : wx + ww;
            ctx.strokeStyle = '#6a6a82';
            ctx.globalAlpha = 0.2;
            ctx.lineWidth = 1;
            for (let s = 0; s < 4; s++) {
                const ang = (s / 4) * Math.PI * 0.5;
                ctx.beginPath();
                ctx.moveTo(cobX, wy + wh);
                ctx.quadraticCurveTo(cobX + Math.cos(ang) * 8, wy + wh + Math.sin(ang) * 8, cobX + Math.cos(ang) * 14, wy + wh + Math.sin(ang) * 14);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // Banner/tapestry on long walls
        if (isHoriz && ww > 80) {
            for (let bx = wx + 40; bx < wx + ww - 30; bx += 80 + ((bx + wy) % 30)) {
                const bannerColors = ['#6b2020', '#20406b', '#3b6b20'];
                ctx.fillStyle = bannerColors[(bx * 3 + wy) % bannerColors.length];
                ctx.fillRect(bx - 4, wy - 12, 8, 14);
                // Banner trim
                ctx.fillStyle = '#c8b060';
                ctx.fillRect(bx - 4, wy - 12, 8, 1);
                ctx.fillRect(bx - 4, wy + 1, 3, 2);
                ctx.fillRect(bx + 1, wy + 1, 3, 2);
                // Rod
                ctx.fillStyle = '#5d4e37';
                ctx.fillRect(bx - 6, wy - 13, 12, 2);
            }
        }
    }
}
