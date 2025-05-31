'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Position, Invader, Bullet, Bunker, UFO } from '@/types/game';
import { 
  GAME_CONFIG, 
  PLAYER_CONFIG, 
  INVADER_CONFIG, 
  BUNKER_CONFIG,
  UFO_CONFIG,
  COLORS 
} from '@/constants/game';
import { useGameLoop } from '@/hooks/useGameLoop';
import { checkCollision, isOutOfBounds } from '@/utils/collision';
import { 
  drawPlayer, drawSquid, drawCrab, drawOctopus, drawUFO, drawBunker, drawBullet,
  createExplosion, drawExplosion, updateExplosion 
} from '@/utils/drawing';

const SpaceInvaders: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const lastShotRef = useRef<number>(0);
  const invaderDirectionRef = useRef<number>(1);
  const frameRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());

  function initializeGame(level: number = 1): GameState {
    const invaders: Invader[] = [];
    const startX = 100;
    const startY = 100;
    
    for (let row = 0; row < INVADER_CONFIG.rows; row++) {
      for (let col = 0; col < INVADER_CONFIG.cols; col++) {
        const type = row === 0 ? 'squid' : row <= 2 ? 'crab' : 'octopus';
        const points = INVADER_CONFIG.types[type].points;
        
        invaders.push({
          position: {
            x: startX + col * (INVADER_CONFIG.width + 15),
            y: startY + row * (INVADER_CONFIG.height + 15),
          },
          width: INVADER_CONFIG.width,
          height: INVADER_CONFIG.height,
          isAlive: true,
          type,
          points,
        });
      }
    }

    const bunkers: Bunker[] = [];
    const bunkerSpacing = GAME_CONFIG.width / (BUNKER_CONFIG.count + 1);
    
    for (let i = 0; i < BUNKER_CONFIG.count; i++) {
      bunkers.push({
        position: {
          x: bunkerSpacing * (i + 1) - BUNKER_CONFIG.width / 2,
          y: GAME_CONFIG.height - 150,
        },
        width: BUNKER_CONFIG.width,
        height: BUNKER_CONFIG.height,
        isAlive: true,
        health: BUNKER_CONFIG.health,
        maxHealth: BUNKER_CONFIG.health,
      });
    }

    return {
      player: {
        position: { x: GAME_CONFIG.width / 2 - PLAYER_CONFIG.width / 2, y: GAME_CONFIG.height - 80 },
        width: PLAYER_CONFIG.width,
        height: PLAYER_CONFIG.height,
        isAlive: true,
        lives: PLAYER_CONFIG.initialLives,
      },
      invaders,
      bullets: [],
      bunkers,
      ufo: null,
      explosions: [],
      score: 0,
      level,
      gameStatus: 'menu',
      highScore: typeof window !== 'undefined' ? parseInt(localStorage.getItem('spaceInvadersHighScore') || '0') : 0,
    };
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key]: true }));
    
    if (e.key === 'Enter' && gameState.gameStatus === 'menu') {
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    }
    
    if (e.key === 'p' && gameState.gameStatus === 'playing') {
      setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
    } else if (e.key === 'p' && gameState.gameStatus === 'paused') {
      setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    }
    
    if (e.key === 'r' && (gameState.gameStatus === 'gameOver' || gameState.gameStatus === 'levelComplete')) {
      setGameState(initializeGame());
    }
  }, [gameState.gameStatus]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys(prev => ({ ...prev, [e.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const updateGame = useCallback((deltaTime: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prev => {
      const newState = { ...prev };
      const now = Date.now();

      // Update player position
      if (keys['ArrowLeft'] && newState.player.position.x > 0) {
        newState.player.position.x -= PLAYER_CONFIG.speed;
      }
      if (keys['ArrowRight'] && newState.player.position.x < GAME_CONFIG.width - PLAYER_CONFIG.width) {
        newState.player.position.x += PLAYER_CONFIG.speed;
      }

      // Player shooting
      if (keys[' '] && now - lastShotRef.current > PLAYER_CONFIG.cooldown) {
        newState.bullets.push({
          position: {
            x: newState.player.position.x + PLAYER_CONFIG.width / 2 - 2,
            y: newState.player.position.y,
          },
          width: 4,
          height: 10,
          isAlive: true,
          velocity: -PLAYER_CONFIG.bulletSpeed,
          isPlayerBullet: true,
        });
        lastShotRef.current = now;
      }

      // Update invaders
      let shouldDropDown = false;
      const aliveInvaders = newState.invaders.filter(inv => inv.isAlive);
      
      if (aliveInvaders.length > 0) {
        const leftMost = Math.min(...aliveInvaders.map(inv => inv.position.x));
        const rightMost = Math.max(...aliveInvaders.map(inv => inv.position.x + inv.width));
        
        if ((invaderDirectionRef.current > 0 && rightMost >= GAME_CONFIG.width - 20) ||
            (invaderDirectionRef.current < 0 && leftMost <= 20)) {
          shouldDropDown = true;
          invaderDirectionRef.current *= -1;
        }

        newState.invaders.forEach(invader => {
          if (!invader.isAlive) return;
          
          if (shouldDropDown) {
            invader.position.y += INVADER_CONFIG.verticalDrop;
          }
          invader.position.x += invaderDirectionRef.current * INVADER_CONFIG.horizontalSpeed * (1 + newState.level * 0.2);
          
          // Invader shooting
          if (Math.random() < INVADER_CONFIG.shootProbability) {
            newState.bullets.push({
              position: {
                x: invader.position.x + invader.width / 2 - 2,
                y: invader.position.y + invader.height,
              },
              width: 4,
              height: 10,
              isAlive: true,
              velocity: INVADER_CONFIG.bulletSpeed,
              isPlayerBullet: false,
            });
          }
        });
      }

      // UFO logic
      if (!newState.ufo && Math.random() < UFO_CONFIG.spawnChance) {
        const direction = Math.random() > 0.5 ? 1 : -1;
        newState.ufo = {
          position: {
            x: direction > 0 ? -UFO_CONFIG.width : GAME_CONFIG.width,
            y: 50,
          },
          width: UFO_CONFIG.width,
          height: UFO_CONFIG.height,
          isAlive: true,
          points: Math.floor(Math.random() * (UFO_CONFIG.maxPoints - UFO_CONFIG.minPoints) + UFO_CONFIG.minPoints),
          velocity: UFO_CONFIG.speed * direction,
        };
      }

      if (newState.ufo) {
        newState.ufo.position.x += newState.ufo.velocity;
        if (newState.ufo.position.x < -UFO_CONFIG.width || newState.ufo.position.x > GAME_CONFIG.width) {
          newState.ufo = null;
        }
      }

      // Update bullets
      newState.bullets = newState.bullets.filter(bullet => {
        bullet.position.y += bullet.velocity;
        return bullet.isAlive && !isOutOfBounds(bullet, GAME_CONFIG.width, GAME_CONFIG.height);
      });

      // Check collisions
      // Player bullets vs invaders
      newState.bullets.forEach(bullet => {
        if (!bullet.isPlayerBullet || !bullet.isAlive) return;
        
        newState.invaders.forEach(invader => {
          if (invader.isAlive && checkCollision(bullet, invader)) {
            bullet.isAlive = false;
            invader.isAlive = false;
            newState.score += invader.points;
            
            // Create explosion for invader
            const explosionColor = invader.type === 'squid' ? COLORS.invaderSquid :
                                  invader.type === 'crab' ? COLORS.invaderCrab :
                                  COLORS.invaderOctopus;
            newState.explosions.push(createExplosion(
              { x: invader.position.x + invader.width / 2, y: invader.position.y + invader.height / 2 },
              explosionColor,
              'medium'
            ));
          }
        });

        // Player bullet vs UFO
        if (newState.ufo && checkCollision(bullet, newState.ufo)) {
          bullet.isAlive = false;
          newState.score += newState.ufo.points;
          
          // Create explosion for UFO
          newState.explosions.push(createExplosion(
            { x: newState.ufo.position.x + newState.ufo.width / 2, y: newState.ufo.position.y + newState.ufo.height / 2 },
            COLORS.ufo,
            'large'
          ));
          
          newState.ufo = null;
        }

        // Bullets vs bunkers
        newState.bunkers.forEach(bunker => {
          if (bunker.isAlive && checkCollision(bullet, bunker)) {
            bullet.isAlive = false;
            bunker.health--;
            if (bunker.health <= 0) {
              bunker.isAlive = false;
            }
          }
        });
      });

      // Enemy bullets vs player and bunkers
      newState.bullets.forEach(bullet => {
        if (bullet.isPlayerBullet || !bullet.isAlive) return;
        
        if (newState.player.isAlive && checkCollision(bullet, newState.player)) {
          bullet.isAlive = false;
          newState.player.lives--;
          
          // Create explosion for player hit
          newState.explosions.push(createExplosion(
            { x: newState.player.position.x + newState.player.width / 2, y: newState.player.position.y + newState.player.height / 2 },
            COLORS.player,
            'large'
          ));
          
          if (newState.player.lives <= 0) {
            newState.gameStatus = 'gameOver';
            if (newState.score > newState.highScore) {
              newState.highScore = newState.score;
              if (typeof window !== 'undefined') {
                localStorage.setItem('spaceInvadersHighScore', newState.score.toString());
              }
            }
          }
        }

        newState.bunkers.forEach(bunker => {
          if (bunker.isAlive && checkCollision(bullet, bunker)) {
            bullet.isAlive = false;
            bunker.health--;
            if (bunker.health <= 0) {
              bunker.isAlive = false;
            }
          }
        });
      });

      // Check if all invaders are destroyed
      if (aliveInvaders.length === 0) {
        newState.gameStatus = 'levelComplete';
        setTimeout(() => {
          setGameState(initializeGame(newState.level + 1));
        }, 2000);
      }

      // Check if invaders reached the bottom
      aliveInvaders.forEach(invader => {
        if (invader.position.y + invader.height >= newState.player.position.y) {
          newState.gameStatus = 'gameOver';
        }
      });

      // Update explosions
      newState.explosions = newState.explosions.filter(explosion => updateExplosion(explosion));

      return newState;
    });
  }, [keys]);

  useGameLoop(updateGame, gameState.gameStatus === 'playing');

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Increment frame counter for animations
    frameRef.current++;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    // Draw game elements only if playing, paused, or level complete
    if (gameState.gameStatus !== 'menu') {
      // Draw player
      if (gameState.player.isAlive) {
        drawPlayer(ctx, gameState.player.position, gameState.player.width, gameState.player.height);
      }

      // Draw invaders
      gameState.invaders.forEach(invader => {
        if (!invader.isAlive) return;
        
        switch (invader.type) {
          case 'squid':
            drawSquid(ctx, invader.position, invader.width, invader.height, frameRef.current);
            break;
          case 'crab':
            drawCrab(ctx, invader.position, invader.width, invader.height, frameRef.current);
            break;
          case 'octopus':
            drawOctopus(ctx, invader.position, invader.width, invader.height, frameRef.current);
            break;
        }
      });

      // Draw UFO
      if (gameState.ufo) {
        drawUFO(ctx, gameState.ufo.position, gameState.ufo.width, gameState.ufo.height, frameRef.current);
      }

      // Draw bunkers
      gameState.bunkers.forEach(bunker => {
        if (!bunker.isAlive) return;
        drawBunker(ctx, bunker.position, bunker.width, bunker.height, bunker.health, bunker.maxHealth);
      });

      // Draw bullets
      gameState.bullets.forEach(bullet => {
        if (!bullet.isAlive) return;
        drawBullet(ctx, bullet.position, bullet.width, bullet.height, bullet.isPlayerBullet);
      });

      // Draw explosions
      gameState.explosions.forEach(explosion => {
        drawExplosion(ctx, explosion);
      });

      // Draw UI
      ctx.fillStyle = COLORS.text;
      ctx.font = '20px monospace';
      ctx.fillText(`Score: ${gameState.score}`, 20, 30);
      ctx.fillText(`Lives: ${gameState.player.lives}`, 20, 55);
      ctx.fillText(`Level: ${gameState.level}`, 20, 80);
      ctx.fillText(`High Score: ${gameState.highScore}`, GAME_CONFIG.width - 200, 30);
    }

    // Draw overlays
    if (gameState.gameStatus === 'menu') {
      ctx.fillStyle = COLORS.text;
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = COLORS.textGlow;
      ctx.shadowBlur = 30;
      ctx.fillText('SPACE INVADERS', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 - 100);
      
      ctx.font = '24px monospace';
      ctx.fillText('Press ENTER to Start', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
      ctx.fillText('Use ← → to Move', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 40);
      ctx.fillText('SPACE to Shoot', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 80);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';
    }

    if (gameState.gameStatus === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      
      ctx.fillStyle = COLORS.text;
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
      ctx.font = '24px monospace';
      ctx.fillText('Press P to Resume', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 50);
      ctx.textAlign = 'left';
    }

    if (gameState.gameStatus === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      
      ctx.fillStyle = COLORS.text;
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
      ctx.font = '24px monospace';
      ctx.fillText(`Final Score: ${gameState.score}`, GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 50);
      ctx.fillText('Press R to Restart', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 90);
      ctx.textAlign = 'left';
    }

    if (gameState.gameStatus === 'levelComplete') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
      
      ctx.fillStyle = COLORS.text;
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = COLORS.textGlow;
      ctx.shadowBlur = 30;
      ctx.fillText('LEVEL COMPLETE!', GAME_CONFIG.width / 2, GAME_CONFIG.height / 2);
      ctx.font = '24px monospace';
      ctx.fillText(`Score: ${gameState.score}`, GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 + 50);
      ctx.shadowBlur = 0;
      ctx.textAlign = 'left';
    }
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.width}
          height={GAME_CONFIG.height}
          className="border-2 border-cyan-500 shadow-lg shadow-cyan-500/50"
          style={{
            imageRendering: 'pixelated',
            boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)',
          }}
        />
      </div>
      <div className="mt-4 text-cyan-400 font-mono text-sm">
        <p>Controls: ← → Move | SPACE Shoot | P Pause | R Restart</p>
      </div>
    </div>
  );
};

export default SpaceInvaders;