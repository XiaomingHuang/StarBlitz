import { useEffect, useState, useCallback } from 'react';
import Player from './Player';
import Enemy from './Enemy';
import GameOver from './GameOver';
import StartScreen from './StartScreen';
import GameHUD from './GameHUD';

export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  x: number;
  y: number;
  id: number;
}

export interface EnemyShip {
  x: number;
  y: number;
  id: number;
  health: number;
}

export interface GameState {
  level: number;
  timeRemaining: number;
  score: number;
  isActive: boolean;
  isOver: boolean;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const LEVEL_TIME = 60; // seconds per level
const ENEMY_CONFIGS = [
  { rows: 3, cols: 6, health: 1, speed: 1 },   // Level 1
  { rows: 3, cols: 8, health: 1, speed: 1.2 }, // Level 2
  { rows: 4, cols: 8, health: 2, speed: 1.3 }, // Level 3
  { rows: 4, cols: 9, health: 2, speed: 1.4 }, // Level 4
  { rows: 5, cols: 9, health: 2, speed: 1.5 }, // Level 5
];

const Game = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    timeRemaining: LEVEL_TIME,
    score: 0,
    isActive: false,
    isOver: false
  });
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 60 });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<EnemyShip[]>([]);
  const [bulletId, setBulletId] = useState(0);

  const initializeEnemies = useCallback((level: number) => {
    const config = ENEMY_CONFIGS[Math.min(level - 1, ENEMY_CONFIGS.length - 1)];
    const newEnemies: EnemyShip[] = [];
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        newEnemies.push({
          id: row * config.cols + col,
          x: col * (GAME_WIDTH / (config.cols + 1)) + (GAME_WIDTH / (config.cols + 1)),
          y: row * 60 + 60,
          health: config.health
        });
      }
    }
    setEnemies(newEnemies);
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      level: 1,
      timeRemaining: LEVEL_TIME,
      score: 0,
      isActive: true,
      isOver: false
    });
    setPlayerPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 60 });
    setBullets([]);
    initializeEnemies(1);
  }, [initializeEnemies]);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayerPosition(prev => ({
      ...prev,
      x: Math.max(30, Math.min(GAME_WIDTH - 30, prev.x + (direction === 'left' ? -20 : 20)))
    }));
  }, []);

  const shoot = useCallback(() => {
    setBullets(prev => [...prev, { x: playerPosition.x, y: playerPosition.y - 20, id: bulletId }]);
    setBulletId(prev => prev + 1);
  }, [playerPosition, bulletId]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameState.isActive || gameState.isOver) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        movePlayer('left');
        break;
      case 'ArrowRight':
        movePlayer('right');
        break;
      case ' ':
        shoot();
        break;
    }
  }, [movePlayer, shoot, gameState.isActive, gameState.isOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameState.isActive || gameState.isOver) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          return { ...prev, isOver: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isActive, gameState.isOver]);

  useEffect(() => {
    if (!gameState.isActive || gameState.isOver) return;

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev => {
        const newBullets = prev
          .map(bullet => ({ ...bullet, y: bullet.y - 8 }))
          .filter(bullet => bullet.y > 0);
        return newBullets;
      });

      // Move enemies
      setEnemies(prev => {
        const time = Date.now() / 1000;
        const config = ENEMY_CONFIGS[Math.min(gameState.level - 1, ENEMY_CONFIGS.length - 1)];
        return prev.map(enemy => ({
          ...enemy,
          x: enemy.x + Math.sin(time + enemy.id * 0.1) * 2 * config.speed,
          y: enemy.y + 0.2 * config.speed
        }));
      });

      // Check collisions
      setBullets(prev => {
        const newBullets = [...prev];
        setEnemies(prevEnemies => {
          const newEnemies = prevEnemies.map(enemy => {
            const hitByBullet = newBullets.some(bullet => 
              Math.abs(bullet.x - enemy.x) < 30 && 
              Math.abs(bullet.y - enemy.y) < 30
            );
            if (hitByBullet) {
              setGameState(prev => ({ ...prev, score: prev.score + 100 }));
              return { ...enemy, health: enemy.health - 1 };
            }
            return enemy;
          }).filter(enemy => enemy.health > 0);

          if (newEnemies.length === 0) {
            setGameState(prev => ({
              ...prev,
              level: prev.level + 1,
              timeRemaining: LEVEL_TIME
            }));
            setTimeout(() => initializeEnemies(gameState.level + 1), 1000);
          }

          if (newEnemies.some(enemy => enemy.y > GAME_HEIGHT - 100)) {
            setGameState(prev => ({ ...prev, isOver: true }));
          }

          return newEnemies;
        });

        return newBullets.filter(bullet => 
          !enemies.some(enemy => 
            Math.abs(bullet.x - enemy.x) < 30 && 
            Math.abs(bullet.y - enemy.y) < 30
          )
        );
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState.isActive, gameState.isOver, gameState.level, initializeEnemies]);

  if (!gameState.isActive) {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="relative w-[800px] h-[600px] bg-slate-900 overflow-hidden rounded-lg">
      <GameHUD 
        score={gameState.score}
        level={gameState.level}
        timeRemaining={gameState.timeRemaining}
      />
      
      {bullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute w-2 h-4 bg-yellow-400 rounded-full"
          style={{ left: bullet.x, top: bullet.y }}
        />
      ))}

      {enemies.map(enemy => (
        <Enemy key={enemy.id} position={enemy} />
      ))}

      <Player position={playerPosition} />

      {gameState.isOver && (
        <GameOver 
          score={gameState.score}
          level={gameState.level}
          onRestart={startGame}
        />
      )}
    </div>
  );
};

export default Game;