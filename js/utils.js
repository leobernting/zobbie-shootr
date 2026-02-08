// Utility functions used across multiple modules.

function drawPixelRect(x, y, w, h, color, darkColor) {
    G.ctx.fillStyle = color;
    G.ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
    if (darkColor) {
        G.ctx.fillStyle = darkColor;
        G.ctx.fillRect(Math.floor(x), Math.floor(y) + h - 3, w, 3);
        G.ctx.fillRect(Math.floor(x) + w - 3, Math.floor(y), 3, h);
    }
}

function rectCollision(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}

function pointInWalls(x, y, width, height) {
    for (const wall of G.walls) {
        if (rectCollision(
            { x: x - width/2, y: y - height/2, w: width, h: height },
            wall
        )) {
            return true;
        }
    }
    return false;
}

function lineOfSightBlocked(x1, y1, x2, y2) {
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 5);
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const checkX = x1 + (x2 - x1) * t;
        const checkY = y1 + (y2 - y1) * t;
        if (pointInWalls(checkX, checkY, 2, 2)) {
            return true;
        }
    }
    return false;
}
