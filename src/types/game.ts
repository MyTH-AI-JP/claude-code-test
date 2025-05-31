export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  position: Position;
  width: number;
  height: number;
  isAlive: boolean;
}

export interface Player extends GameObject {
  lives: number;
}

export interface Invader extends GameObject {
  type: 'squid' | 'crab' | 'octopus';
  points: number;
}

export interface Bullet extends GameObject {
  velocity: number;
  isPlayerBullet: boolean;
}

export interface UFO extends GameObject {
  points: number;
  velocity: number;
}

export interface Bunker extends GameObject {
  health: number;
  maxHealth: number;
}

export interface GameState {
  player: Player;
  invaders: Invader[];
  bullets: Bullet[];
  bunkers: Bunker[];
  ufo: UFO | null;
  score: number;
  level: number;
  gameStatus: 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  highScore: number;
}