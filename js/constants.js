// Pure data constants — no logic, no side effects.

const CLASSES = {
    default: { name: 'Rookie', description: 'No bonuses', price: 0, weapon: 'pistol', health: 100, speed: 1.5, ammoBonus: 0 },
    soldier: { name: 'Soldier', description: 'Start with SMG', price: 100, weapon: 'smg', health: 100, speed: 1.5, ammoBonus: 0 },
    tank: { name: 'Tank', description: '+50 Health, slower', price: 150, weapon: 'pistol', health: 150, speed: 1.2, ammoBonus: 0 },
    scout: { name: 'Scout', description: 'Faster movement', price: 120, weapon: 'pistol', health: 80, speed: 2.0, ammoBonus: 0 },
    gunner: { name: 'Gunner', description: 'Start with Shotgun', price: 200, weapon: 'shotgun', health: 100, speed: 1.4, ammoBonus: 0 },
    sniper: { name: 'Marksman', description: 'Start with Sniper', price: 300, weapon: 'sniper', health: 90, speed: 1.5, ammoBonus: 0 },
    pyro: { name: 'Pyro', description: 'Start with Flamethrower', price: 350, weapon: 'flamethrower', health: 100, speed: 1.5, ammoBonus: 0 },
    demoman: { name: 'Demoman', description: 'Start with Bombs', price: 400, weapon: 'bomb', health: 110, speed: 1.3, ammoBonus: 0 },
    samurai: { name: 'Samurai', description: 'Start with Katana', price: 250, weapon: 'katana', health: 90, speed: 1.7, ammoBonus: 0 }
};

const WEAPONS = {
    pistol: { fireRate: 35, ammoUse: 1, maxAmmo: 12, color: '#f39c12', label: 'P' },
    smg: { fireRate: 12, ammoUse: 1, maxAmmo: 40, damage: 10, color: '#3498db', label: 'M' },
    shotgun: { fireRate: 45, ammoUse: 3, maxAmmo: 18, spread: 5, pellets: 5, color: '#e67e22', label: 'S' },
    rifle: { fireRate: 20, ammoUse: 1, maxAmmo: 20, damage: 35, color: '#1abc9c', label: 'F' },
    railgun: { fireRate: 70, ammoUse: 4, maxAmmo: 16, pierce: true, color: '#9b59b6', label: 'R' },
    minigun: { fireRate: 6, ammoUse: 1, maxAmmo: 100, damage: 5, color: '#e74c3c', label: 'G' },
    sword: { fireRate: 30, damage: 40, range: 45, arc: Math.PI/2, melee: true, color: '#c0c0c0', label: 'W' },
    katana: { fireRate: 18, damage: 25, range: 55, arc: Math.PI/3, melee: true, color: '#e8e8e8', label: 'K' },
    sniper: { fireRate: 90, ammoUse: 1, maxAmmo: 8, damage: 150, color: '#2c3e50', label: 'N' },
    flamethrower: { fireRate: 5, ammoUse: 1, maxAmmo: 80, damage: 3, flame: true, color: '#ff4500', label: 'T' },
    rocketlauncher: { fireRate: 80, ammoUse: 1, maxAmmo: 6, damage: 80, explosive: true, explosionRadius: 60, color: '#556b2f', label: 'L' },
    bomb: { fireRate: 60, ammoUse: 1, maxAmmo: 3, damage: 150, explosionRadius: 100, placeable: true, fuseTime: 180, color: '#1a1a1a', label: 'B' }
};

const WEAPON_LIST = ['pistol', 'smg', 'shotgun', 'rifle', 'railgun', 'minigun', 'sword', 'katana', 'sniper', 'flamethrower', 'rocketlauncher', 'bomb'];

const ARMOR_TIERS = [
    { tier: 1, name: 'Leather Vest',  dr: 0.15, price: 30,  color: '#8b5e3c' },
    { tier: 2, name: 'Chain Mail',     dr: 0.30, price: 70,  color: '#a0a0a0' },
    { tier: 3, name: 'Plate Armor',    dr: 0.45, price: 120, color: '#c0c8d0' }
];

const CHARMS = {
    swift_boots:   { name: 'Swift Boots',   desc: '+20% speed',        price: 40, type: 'passive', icon: 'SB', color: '#3498db' },
    regen_aura:    { name: 'Regen Aura',    desc: '1 HP / 3s',         price: 50, type: 'passive', icon: 'RA', color: '#2ecc71' },
    big_magazines: { name: 'Big Magazines',  desc: '+50% ammo cap',    price: 35, type: 'passive', icon: 'BM', color: '#f1c40f' },
    thick_skin:    { name: 'Thick Skin',    desc: '+25 max HP',        price: 45, type: 'passive', icon: 'TS', color: '#e67e22' },
    vampiric_fang: { name: 'Vampiric Fang', desc: 'Heal 5 HP on kill', price: 60, type: 'onkill',  icon: 'VF', color: '#e74c3c' },
    scrap_magnet:  { name: 'Scrap Magnet',  desc: '+1 scrap / kill',   price: 45, type: 'onkill',  icon: 'SM', color: '#95a5a6' },
    boom_skull:    { name: 'Boom Skull',     desc: 'Explode on kill',  price: 75, type: 'onkill',  icon: 'BS', color: '#ff4500' }
};

const RUN_SHOP_WEAPONS = [
    { weapon: 'smg',             price: 25, minLevel: 1 },
    { weapon: 'shotgun',         price: 30, minLevel: 1 },
    { weapon: 'rifle',           price: 35, minLevel: 2 },
    { weapon: 'sword',           price: 30, minLevel: 2 },
    { weapon: 'katana',          price: 40, minLevel: 3 },
    { weapon: 'railgun',         price: 50, minLevel: 3 },
    { weapon: 'minigun',         price: 55, minLevel: 4 },
    { weapon: 'sniper',          price: 60, minLevel: 3 },
    { weapon: 'flamethrower',    price: 55, minLevel: 4 },
    { weapon: 'rocketlauncher',  price: 80, minLevel: 5 },
    { weapon: 'bomb',            price: 45, minLevel: 4 }
];

const DUNGEON_ENEMIES = {
    jungle: {
        grunt: { name: 'Tribesman', color: '#5d8a3e', colorDark: '#4a7030', speed: 1, health: 40, size: 18, shootDist: 120, canShoot: true },
        charger: { name: 'Jaguar', color: '#c9a227', colorDark: '#a68520', speed: 1.2, health: 25, size: 16, shootDist: 0, canShoot: false },
        boss: { name: 'Shaman', color: '#2d5a27', colorDark: '#1e3d1a', speed: 0.5, health: 500, size: 48, shootDist: 200, canShoot: true },
        tank: { name: 'Gorilla', color: '#4a4a4a', colorDark: '#333333', speed: 0.6, health: 130, size: 28, shootDist: 80, canShoot: true },
        sniper: { name: 'Hunter', color: '#8b4513', colorDark: '#6b3510', speed: 0.8, health: 30, size: 16, shootDist: 250, canShoot: true }
    },
    desert: {
        grunt: { name: 'Mummy', color: '#c4a35a', colorDark: '#a68b4b', speed: 0.9, health: 50, size: 18, shootDist: 110, canShoot: true },
        charger: { name: 'Scarab', color: '#1a1a2e', colorDark: '#0d0d17', speed: 1.3, health: 20, size: 14, shootDist: 0, canShoot: false },
        boss: { name: 'Pharaoh', color: '#ffd700', colorDark: '#b8860b', speed: 0.4, health: 550, size: 50, shootDist: 220, canShoot: true },
        tank: { name: 'Sand Golem', color: '#d4a574', colorDark: '#b8956a', speed: 0.5, health: 140, size: 30, shootDist: 90, canShoot: true },
        sniper: { name: 'Desert Archer', color: '#8b7355', colorDark: '#6b5a45', speed: 0.9, health: 28, size: 16, shootDist: 270, canShoot: true }
    },
    ice: {
        grunt: { name: 'Frost Knight', color: '#5a8fa8', colorDark: '#4a7a8f', speed: 0.9, health: 45, size: 20, shootDist: 120, canShoot: true },
        charger: { name: 'Ice Wolf', color: '#a8c8d8', colorDark: '#8ab0c0', speed: 1.1, health: 28, size: 18, shootDist: 0, canShoot: false },
        boss: { name: 'Frost Giant', color: '#4a90a8', colorDark: '#3a7088', speed: 0.4, health: 600, size: 54, shootDist: 180, canShoot: true },
        tank: { name: 'Yeti', color: '#e8f0f0', colorDark: '#c8d8d8', speed: 0.55, health: 150, size: 30, shootDist: 100, canShoot: true },
        sniper: { name: 'Ice Mage', color: '#87ceeb', colorDark: '#5f9ea0', speed: 0.7, health: 25, size: 16, shootDist: 280, canShoot: true }
    },
    volcano: {
        grunt: { name: 'Fire Imp', color: '#ff6b35', colorDark: '#cc5528', speed: 1.2, health: 35, size: 16, shootDist: 130, canShoot: true },
        charger: { name: 'Hellhound', color: '#8b0000', colorDark: '#5c0000', speed: 1.2, health: 30, size: 18, shootDist: 0, canShoot: false },
        boss: { name: 'Fire Dragon', color: '#ff4500', colorDark: '#cc3700', speed: 0.6, health: 650, size: 56, shootDist: 250, canShoot: true },
        tank: { name: 'Lava Golem', color: '#ff8c00', colorDark: '#cc7000', speed: 0.45, health: 160, size: 32, shootDist: 90, canShoot: true },
        sniper: { name: 'Fire Mage', color: '#ff1493', colorDark: '#cc1076', speed: 0.85, health: 28, size: 16, shootDist: 260, canShoot: true }
    },
    dungeon: {
        grunt: { name: 'Guard', color: '#e74c3c', colorDark: '#c0392b', speed: 1, health: 40, size: 18, shootDist: 120, canShoot: true },
        charger: { name: 'Goblin', color: '#2ecc71', colorDark: '#27ae60', speed: 1.0, health: 25, size: 16, shootDist: 0, canShoot: false },
        boss: { name: 'Dark Knight', color: '#4a4a6a', colorDark: '#3a3a5a', speed: 0.5, health: 500, size: 48, shootDist: 200, canShoot: true },
        tank: { name: 'Ogre', color: '#e67e22', colorDark: '#d35400', speed: 0.6, health: 120, size: 26, shootDist: 100, canShoot: true },
        sniper: { name: 'Dark Mage', color: '#9b59b6', colorDark: '#8e44ad', speed: 0.8, health: 30, size: 16, shootDist: 250, canShoot: true }
    }
};

const DUNGEONS = {
    jungle: {
        name: 'Jungle Temple',
        description: 'Easy - Ancient ruins',
        wall: '#2d5a27',
        wallDark: '#1e3d1a',
        floor: '#1a3318',
        accent: '#4a7c43',
        icon: '\u{1F334}',
        difficulty: 1,
        enemyCountMult: 0.8,
        enemyHealthMult: 0.8,
        enemySpeedMult: 0.9,
        enemyDamageMult: 0.8,
        pickupChance: 0.5
    },
    desert: {
        name: 'Desert Tomb',
        description: 'Medium - Sandy crypts',
        wall: '#c4a35a',
        wallDark: '#a68b4b',
        floor: '#3d3426',
        accent: '#e6c86e',
        icon: '\u{1F3DC}\uFE0F',
        difficulty: 2,
        enemyCountMult: 1.0,
        enemyHealthMult: 1.0,
        enemySpeedMult: 1.0,
        enemyDamageMult: 1.0,
        pickupChance: 0.4
    },
    dungeon: {
        name: 'Dark Dungeon',
        description: 'Medium - Stone fortress',
        wall: '#5d5d8a',
        wallDark: '#4a4a6a',
        floor: '#2d2d44',
        accent: '#7d7daa',
        icon: '\u{1F3F0}',
        difficulty: 2,
        enemyCountMult: 1.0,
        enemyHealthMult: 1.0,
        enemySpeedMult: 1.0,
        enemyDamageMult: 1.0,
        pickupChance: 0.4
    },
    ice: {
        name: 'Frozen Cavern',
        description: 'Hard - Icy depths',
        wall: '#5a8fa8',
        wallDark: '#4a7a8f',
        floor: '#1a2a33',
        accent: '#8ecae6',
        icon: '\u2744\uFE0F',
        difficulty: 3,
        enemyCountMult: 1.2,
        enemyHealthMult: 1.2,
        enemySpeedMult: 1.1,
        enemyDamageMult: 1.2,
        pickupChance: 0.35
    },
    volcano: {
        name: 'Volcanic Lair',
        description: 'Extreme - Fiery mountain',
        wall: '#4a2c2a',
        wallDark: '#3a1c1a',
        floor: '#2a1a18',
        accent: '#e74c3c',
        icon: '\u{1F30B}',
        difficulty: 4,
        enemyCountMult: 1.4,
        enemyHealthMult: 1.4,
        enemySpeedMult: 1.2,
        enemyDamageMult: 1.5,
        pickupChance: 0.3
    }
};
