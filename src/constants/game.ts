export const GAME_CONFIG = {
  width: 800,
  height: 600,
  fps: 60,
};

export const PLAYER_CONFIG = {
  width: 40,
  height: 30,
  speed: 5,
  initialLives: 3,
  bulletSpeed: 10,
  cooldown: 500, // ms between shots
};

export const INVADER_CONFIG = {
  rows: 5,
  cols: 11,
  width: 30,
  height: 24,
  horizontalSpeed: 1,
  verticalDrop: 20,
  shootProbability: 0.001,
  bulletSpeed: 3,
  types: {
    squid: { rows: [0], points: 30 },
    crab: { rows: [1, 2], points: 20 },
    octopus: { rows: [3, 4], points: 10 },
  },
};

export const UFO_CONFIG = {
  width: 50,
  height: 20,
  speed: 2,
  minPoints: 50,
  maxPoints: 300,
  spawnChance: 0.0005,
};

export const BUNKER_CONFIG = {
  count: 4,
  width: 80,
  height: 60,
  health: 5,
};

export const COLORS = {
  background: '#0a0a0a',
  player: '#00ff88',
  playerGlow: '#00ff8850',
  invaderSquid: '#ff00ff',
  invaderCrab: '#00ffff',
  invaderOctopus: '#ffff00',
  bullet: '#ffffff',
  enemyBullet: '#ff6666',
  ufo: '#ff00ff',
  bunker: '#00ff00',
  text: '#ffffff',
  textGlow: '#00ffff',
};