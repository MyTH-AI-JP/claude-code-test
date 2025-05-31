import { Position, Explosion } from '@/types/game';
import { COLORS } from '@/constants/game';

export const drawPlayer = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number) => {
  ctx.save();
  
  // Enable glow effect
  ctx.shadowColor = COLORS.playerGlow;
  ctx.shadowBlur = 20;
  
  // Draw futuristic ship shape
  ctx.fillStyle = COLORS.player;
  ctx.beginPath();
  
  // Main body - sleek triangle with wings
  ctx.moveTo(position.x + width / 2, position.y);
  ctx.lineTo(position.x + width * 0.8, position.y + height * 0.7);
  ctx.lineTo(position.x + width, position.y + height * 0.8);
  ctx.lineTo(position.x + width * 0.7, position.y + height);
  ctx.lineTo(position.x + width * 0.3, position.y + height);
  ctx.lineTo(position.x, position.y + height * 0.8);
  ctx.lineTo(position.x + width * 0.2, position.y + height * 0.7);
  ctx.closePath();
  ctx.fill();
  
  // Cockpit window
  ctx.fillStyle = COLORS.background;
  ctx.beginPath();
  ctx.arc(position.x + width / 2, position.y + height * 0.4, width * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Engine glow
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 10;
  ctx.fillStyle = COLORS.playerGlow;
  ctx.fillRect(position.x + width * 0.3, position.y + height, width * 0.1, 5);
  ctx.fillRect(position.x + width * 0.6, position.y + height, width * 0.1, 5);
  
  ctx.restore();
};

export const drawSquid = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, frame: number) => {
  ctx.fillStyle = COLORS.invaderSquid;
  ctx.save();
  
  const tentacleOffset = Math.sin(frame * 0.1) * 2;
  
  // Main body
  ctx.beginPath();
  ctx.ellipse(position.x + width / 2, position.y + height * 0.3, width * 0.4, height * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(position.x + width * 0.3, position.y + height * 0.2, width * 0.1, height * 0.15);
  ctx.fillRect(position.x + width * 0.6, position.y + height * 0.2, width * 0.1, height * 0.15);
  
  // Tentacles
  ctx.fillStyle = COLORS.invaderSquid;
  for (let i = 0; i < 4; i++) {
    const x = position.x + width * (0.2 + i * 0.2);
    ctx.beginPath();
    ctx.moveTo(x, position.y + height * 0.5);
    ctx.quadraticCurveTo(
      x + tentacleOffset, 
      position.y + height * 0.7, 
      x + (i % 2 === 0 ? -3 : 3), 
      position.y + height
    );
    ctx.lineTo(x + (i % 2 === 0 ? 3 : -3), position.y + height);
    ctx.quadraticCurveTo(
      x - tentacleOffset, 
      position.y + height * 0.7, 
      x, 
      position.y + height * 0.5
    );
    ctx.fill();
  }
  
  ctx.restore();
};

export const drawCrab = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, frame: number) => {
  ctx.fillStyle = COLORS.invaderCrab;
  ctx.save();
  
  const clawAngle = Math.sin(frame * 0.1) * 0.2;
  
  // Main body
  ctx.fillRect(position.x + width * 0.2, position.y + height * 0.3, width * 0.6, height * 0.4);
  
  // Top shell
  ctx.beginPath();
  ctx.arc(position.x + width / 2, position.y + height * 0.3, width * 0.35, Math.PI, 0, false);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(position.x + width * 0.3, position.y + height * 0.35, width * 0.08, height * 0.1);
  ctx.fillRect(position.x + width * 0.62, position.y + height * 0.35, width * 0.08, height * 0.1);
  
  // Claws
  ctx.fillStyle = COLORS.invaderCrab;
  ctx.save();
  ctx.translate(position.x + width * 0.15, position.y + height * 0.5);
  ctx.rotate(clawAngle);
  ctx.fillRect(-width * 0.15, -height * 0.05, width * 0.2, height * 0.1);
  ctx.beginPath();
  ctx.arc(-width * 0.15, 0, height * 0.15, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.fill();
  ctx.restore();
  
  ctx.save();
  ctx.translate(position.x + width * 0.85, position.y + height * 0.5);
  ctx.rotate(-clawAngle);
  ctx.fillRect(-width * 0.05, -height * 0.05, width * 0.2, height * 0.1);
  ctx.beginPath();
  ctx.arc(width * 0.15, 0, height * 0.15, Math.PI * 0.7, Math.PI * 1.3);
  ctx.fill();
  ctx.restore();
  
  // Legs
  for (let i = 0; i < 3; i++) {
    const legX = position.x + width * (0.3 + i * 0.2);
    ctx.fillRect(legX, position.y + height * 0.7, width * 0.05, height * 0.3);
  }
  
  ctx.restore();
};

export const drawOctopus = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, frame: number) => {
  ctx.fillStyle = COLORS.invaderOctopus;
  ctx.save();
  
  const wobble = Math.sin(frame * 0.1) * 2;
  
  // Head
  ctx.beginPath();
  ctx.arc(position.x + width / 2, position.y + height * 0.4, width * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = COLORS.background;
  ctx.beginPath();
  ctx.arc(position.x + width * 0.35, position.y + height * 0.35, width * 0.08, 0, Math.PI * 2);
  ctx.arc(position.x + width * 0.65, position.y + height * 0.35, width * 0.08, 0, Math.PI * 2);
  ctx.fill();
  
  // Tentacles
  ctx.fillStyle = COLORS.invaderOctopus;
  for (let i = 0; i < 4; i++) {
    const tentacleX = position.x + width * (0.15 + i * 0.2);
    ctx.beginPath();
    ctx.moveTo(tentacleX + width * 0.1, position.y + height * 0.6);
    ctx.quadraticCurveTo(
      tentacleX + width * 0.1 + wobble,
      position.y + height * 0.8,
      tentacleX + width * 0.1 + (i % 2 === 0 ? 3 : -3),
      position.y + height
    );
    ctx.lineTo(tentacleX + (i % 2 === 0 ? -3 : 3), position.y + height);
    ctx.quadraticCurveTo(
      tentacleX - wobble,
      position.y + height * 0.8,
      tentacleX,
      position.y + height * 0.6
    );
    ctx.fill();
  }
  
  ctx.restore();
};

export const drawUFO = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, frame: number) => {
  ctx.save();
  
  // Pulsing glow effect
  const glowIntensity = 15 + Math.sin(frame * 0.2) * 10;
  ctx.shadowColor = COLORS.ufo;
  ctx.shadowBlur = glowIntensity;
  
  // Bottom dome
  ctx.fillStyle = COLORS.ufo;
  ctx.beginPath();
  ctx.ellipse(position.x + width / 2, position.y + height * 0.7, width * 0.5, height * 0.3, 0, 0, Math.PI);
  ctx.fill();
  
  // Top dome
  ctx.beginPath();
  ctx.ellipse(position.x + width / 2, position.y + height * 0.5, width * 0.35, height * 0.4, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Lights
  ctx.fillStyle = COLORS.textGlow;
  const numLights = 5;
  for (let i = 0; i < numLights; i++) {
    const lightX = position.x + width * (0.2 + i * 0.6 / (numLights - 1));
    ctx.beginPath();
    ctx.arc(lightX, position.y + height * 0.7, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

export const drawBunker = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, health: number, maxHealth: number) => {
  ctx.save();
  
  const healthRatio = health / maxHealth;
  const opacity = 0.3 + healthRatio * 0.7;
  
  ctx.fillStyle = `${COLORS.bunker}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
  
  // Main structure - fortress style
  ctx.beginPath();
  
  // Base
  ctx.moveTo(position.x, position.y + height);
  ctx.lineTo(position.x, position.y + height * 0.3);
  
  // Left tower
  ctx.lineTo(position.x + width * 0.15, position.y + height * 0.3);
  ctx.lineTo(position.x + width * 0.15, position.y);
  ctx.lineTo(position.x + width * 0.25, position.y);
  ctx.lineTo(position.x + width * 0.25, position.y + height * 0.3);
  
  // Center arch
  ctx.lineTo(position.x + width * 0.35, position.y + height * 0.3);
  ctx.quadraticCurveTo(position.x + width * 0.5, position.y + height * 0.1, position.x + width * 0.65, position.y + height * 0.3);
  
  // Right tower
  ctx.lineTo(position.x + width * 0.75, position.y + height * 0.3);
  ctx.lineTo(position.x + width * 0.75, position.y);
  ctx.lineTo(position.x + width * 0.85, position.y);
  ctx.lineTo(position.x + width * 0.85, position.y + height * 0.3);
  ctx.lineTo(position.x + width, position.y + height * 0.3);
  ctx.lineTo(position.x + width, position.y + height);
  
  // Entry way
  ctx.lineTo(position.x + width * 0.7, position.y + height);
  ctx.lineTo(position.x + width * 0.7, position.y + height * 0.6);
  ctx.lineTo(position.x + width * 0.3, position.y + height * 0.6);
  ctx.lineTo(position.x + width * 0.3, position.y + height);
  
  ctx.closePath();
  ctx.fill();
  
  // Damage cracks
  if (healthRatio < 0.8) {
    ctx.strokeStyle = COLORS.background;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(position.x + width * 0.2, position.y + height * 0.4);
    ctx.lineTo(position.x + width * 0.3, position.y + height * 0.7);
    ctx.stroke();
  }
  
  if (healthRatio < 0.5) {
    ctx.beginPath();
    ctx.moveTo(position.x + width * 0.7, position.y + height * 0.2);
    ctx.lineTo(position.x + width * 0.8, position.y + height * 0.5);
    ctx.stroke();
  }
  
  ctx.restore();
};

export const drawBullet = (ctx: CanvasRenderingContext2D, position: Position, width: number, height: number, isPlayerBullet: boolean) => {
  ctx.save();
  
  if (isPlayerBullet) {
    // Player bullet - laser style
    ctx.shadowColor = COLORS.bullet;
    ctx.shadowBlur = 10;
    
    const gradient = ctx.createLinearGradient(position.x, position.y, position.x, position.y + height);
    gradient.addColorStop(0, COLORS.bullet);
    gradient.addColorStop(1, COLORS.playerGlow);
    ctx.fillStyle = gradient;
    
    ctx.fillRect(position.x, position.y, width, height);
  } else {
    // Enemy bullet - energy orb
    ctx.shadowColor = COLORS.enemyBullet;
    ctx.shadowBlur = 8;
    
    ctx.fillStyle = COLORS.enemyBullet;
    ctx.beginPath();
    ctx.arc(position.x + width / 2, position.y + height / 2, width * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(position.x + width / 2, position.y + height / 2, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

export const createExplosion = (position: Position, color: string, size: 'small' | 'medium' | 'large' = 'medium'): Explosion => {
  const sizeConfig = {
    small: { maxRadius: 20, particleCount: 8, maxLife: 20 },
    medium: { maxRadius: 30, particleCount: 12, maxLife: 30 },
    large: { maxRadius: 40, particleCount: 16, maxLife: 40 }
  };

  const config = sizeConfig[size];
  const particles = [];

  for (let i = 0; i < config.particleCount; i++) {
    const angle = (Math.PI * 2 * i) / config.particleCount;
    const speed = 2 + Math.random() * 3;
    particles.push({
      x: position.x,
      y: position.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      life: 1
    });
  }

  return {
    position,
    radius: 0,
    maxRadius: config.maxRadius,
    color,
    particles,
    life: config.maxLife,
    maxLife: config.maxLife
  };
};

export const drawExplosion = (ctx: CanvasRenderingContext2D, explosion: Explosion) => {
  ctx.save();
  
  const lifeRatio = explosion.life / explosion.maxLife;
  const expansionRatio = 1 - lifeRatio;
  
  // Central blast
  if (lifeRatio > 0.5) {
    ctx.globalAlpha = lifeRatio;
    ctx.fillStyle = explosion.color;
    ctx.shadowColor = explosion.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(
      explosion.position.x, 
      explosion.position.y, 
      explosion.maxRadius * expansionRatio * 0.5, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
  
  // Shockwave ring
  if (lifeRatio > 0.3) {
    ctx.globalAlpha = lifeRatio * 0.5;
    ctx.strokeStyle = explosion.color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(
      explosion.position.x, 
      explosion.position.y, 
      explosion.maxRadius * expansionRatio, 
      0, 
      Math.PI * 2
    );
    ctx.stroke();
  }
  
  // Particles
  ctx.shadowBlur = 0;
  explosion.particles.forEach(particle => {
    if (particle.life > 0) {
      ctx.globalAlpha = particle.life * lifeRatio;
      ctx.fillStyle = explosion.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      ctx.fill();
      
      // Particle trail
      ctx.globalAlpha = particle.life * lifeRatio * 0.3;
      ctx.strokeStyle = explosion.color;
      ctx.lineWidth = particle.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
      ctx.stroke();
    }
  });
  
  ctx.restore();
};

export const updateExplosion = (explosion: Explosion): boolean => {
  explosion.life--;
  
  // Update particles
  explosion.particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.98; // Friction
    particle.vy *= 0.98;
    particle.life -= 0.03;
  });
  
  // Update radius
  explosion.radius = explosion.maxRadius * (1 - explosion.life / explosion.maxLife);
  
  return explosion.life > 0;
};