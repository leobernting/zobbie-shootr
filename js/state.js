// Global game state namespace.
// Loaded first; extracted modules read/write through G.
// The inline script in index.html still uses bare variable names
// until those functions are extracted to their own files.
const G = {};
