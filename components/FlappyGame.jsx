'use client';
import { useEffect, useRef, useState } from 'react';

const SubwayCringeRunner = () => {
  const [playerLane, setPlayerLane] = useState(1); // 0=left, 1=middle, 2=right
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [powerUp, setPowerUp] = useState(null);
  const [invincible, setInvincible] = useState(false);
  const [celebration, setCelebration] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(8);
  const [cringe, setCringe] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const gameLoopRef = useRef();
  const obstacleIntervalRef = useRef();
  const coinIntervalRef = useRef();
  const audioContextRef = useRef(null);

  const GAME_WIDTH = typeof window !== 'undefined' ? Math.min(400, window.innerWidth - 40) : 400;
  const GAME_HEIGHT = typeof window !== 'undefined' ? Math.min(600, window.innerHeight - 250) : 600;
  const LANE_WIDTH = GAME_WIDTH / 3;
  const PLAYER_SIZE = 50;
  const GROUND_Y = GAME_HEIGHT - 150;
  const GRAVITY = 1.2;
  const JUMP_POWER = -18;

  const cringeCharacters = ['😬', '🤡', '💩', '🤓', '🥴', '😵‍💫'];
  const cringeObstacles = ['📱', '🚫', '❌', '💔', '🗑️', '☠️', '🧱', '⚠️'];
  const cringeCoins = ['👍', '❤️', '🔥', '💯', '✨', '⭐'];
  const ultraCringePhrases = [
    'YOLO SWAG! 😎✌️', 'ON FLEEK! 💅✨', 'LIT FAM! 🔥👌', 'DOPE AF! 🤙💯',
    'SAVAGE BRO! 😤🙌', 'SLAY QUEEN! 💃👑', 'NO CAP FR FR! 🧢🚫', 'BUSSIN BUSSIN! 😋🍔',
    'PERIODT! 💅💋', 'ITS GIVING! ✨💖', 'SNATCHED! 🔥💪', 'VIBE CHECK! ✅😌',
    'LIVING MY BEST LIFE! 🌈🦋', 'MAIN CHARACTER ENERGY! 🎬⭐', 'UNDERSTOOD THE ASSIGNMENT! 📝✅'
  ];
  const cringeDeathMessages = [
    'NOT COOL BRO! 😭💔', 'MEGA CRINGE! 🤮👎', 'THATS SO 2010! 📟💀', 'EPIC FAIL! ⚠️😵',
    'AWKWARD... 😬🙈', 'YIKES DUDE! 😰🚨', 'CANCELLED! ❌🚫', 'MOOD: DESTROYED 💔😢'
  ];

  const [currentChar, setCurrentChar] = useState(cringeCharacters[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  const playCringeSound = (type) => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;

    if (type === 'jump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'move') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'coin') {
      [600, 800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.1);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.1);
      });
    } else if (type === 'death') {
      [500, 400, 300, 200].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.2);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.2);
      });
    } else if (type === 'powerup') {
      [400, 500, 600, 700, 800].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 0.1);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 0.1);
      });
    }
  };

  const playBackgroundCringe = () => {
    if (isMuted || !audioContextRef.current || !gameStarted || gameOver) return;
    const ctx = audioContextRef.current;
    const notes = [300, 350, 400, 350, 300, 350, 400, 450];
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.1);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.15);
    });
  };

  const moveLeft = () => {
    if (playerLane > 0) {
      setPlayerLane(l => l - 1);
      playCringeSound('move');
    }
  };

  const moveRight = () => {
    if (playerLane < 2) {
      setPlayerLane(l => l + 1);
      playCringeSound('move');
    }
  };

  const jump = () => {
    if (playerY >= GROUND_Y && !isJumping && !isSliding) {
      setVelocity(JUMP_POWER);
      setIsJumping(true);
      playCringeSound('jump');
    }
  };

  const slide = () => {
    if (!isJumping && !isSliding) {
      setIsSliding(true);
      setTimeout(() => setIsSliding(false), 500);
    }
  };

  const resetGame = () => {
    setPlayerLane(1);
    setPlayerY(0);
    setObstacles([]);
    setCoins([]);
    setScore(0);
    setDistance(0);
    setGameOver(false);
    setGameStarted(false);
    setVelocity(0);
    setIsJumping(false);
    setIsSliding(false);
    setPowerUp(null);
    setInvincible(false);
    setSpeed(8);
    setCurrentChar(cringeCharacters[Math.floor(Math.random() * cringeCharacters.length)]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
        return;
      }
      if (gameOver) {
        resetGame();
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'Space') {
        e.preventDefault();
        jump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        slide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, playerLane, playerY, isJumping, isSliding]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const musicInterval = setInterval(() => {
        playBackgroundCringe();
      }, 1200);
      return () => clearInterval(musicInterval);
    }
  }, [gameStarted, gameOver, isMuted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      if (isJumping) {
        setVelocity(v => v + GRAVITY);
        setPlayerY(y => {
          const newY = y + velocity;
          if (newY >= GROUND_Y) {
            setIsJumping(false);
            return GROUND_Y;
          }
          return newY;
        });
      } else {
        setPlayerY(GROUND_Y);
      }

      setDistance(d => d + 1);
      if (distance % 150 === 0 && distance > 0) {
        setSpeed(s => Math.min(s + 0.5, 15));
      }

      setObstacles(prev => {
        const moved = prev.map(o => ({ ...o, z: o.z - speed })).filter(o => o.z > -100);
        
        moved.forEach(obs => {
          const playerBottom = GROUND_Y + PLAYER_SIZE;
          const playerTop = GROUND_Y - playerY + (isSliding ? PLAYER_SIZE/2 : 0);
          
          if (!invincible && obs.z < 50 && obs.z > -50 && obs.lane === playerLane) {
            if (obs.type === 'ground') {
              if (playerBottom > obs.y && !isJumping) {
                setGameOver(true);
                playCringeSound('death');
                if (score > highScore) setHighScore(score);
                setCringe(cringeDeathMessages[Math.floor(Math.random() * cringeDeathMessages.length)]);
              }
            } else if (obs.type === 'air') {
              if (playerTop < obs.y + obs.height && playerTop > obs.y - PLAYER_SIZE) {
                setGameOver(true);
                playCringeSound('death');
                if (score > highScore) setHighScore(score);
                setCringe(cringeDeathMessages[Math.floor(Math.random() * cringeDeathMessages.length)]);
              }
            }
          }
        });

        return moved;
      });

      setCoins(prev => {
        const moved = prev.map(c => ({ ...c, z: c.z - speed })).filter(c => c.z > -100);
        
        moved.forEach((coin) => {
          if (!coin.collected && coin.z < 50 && coin.z > -50 && coin.lane === playerLane) {
            const playerTop = GROUND_Y - playerY;
            if (Math.abs(playerTop - coin.y) < PLAYER_SIZE) {
              setScore(s => s + (coin.isPowerUp ? 10 : 1));
              playCringeSound(coin.isPowerUp ? 'powerup' : 'coin');
              
              if (coin.isPowerUp) {
                setInvincible(true);
                setPowerUp('🌟');
                setCelebration(ultraCringePhrases[Math.floor(Math.random() * ultraCringePhrases.length)]);
                setTimeout(() => {
                  setInvincible(false);
                  setPowerUp(null);
                  setCelebration('');
                }, 3000);
              } else {
                setCelebration(ultraCringePhrases[Math.floor(Math.random() * ultraCringePhrases.length)]);
                setTimeout(() => setCelebration(''), 800);
              }
              
              coin.collected = true;
            }
          }
        });

        return moved.filter(c => !c.collected);
      });
    }, 20);

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, playerY, velocity, invincible, speed, distance, isJumping, playerLane, isSliding]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    obstacleIntervalRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      const type = Math.random() > 0.5 ? 'ground' : 'air';
      
      setObstacles(o => [...o, {
        z: GAME_HEIGHT,
        lane,
        type,
        y: type === 'ground' ? GROUND_Y : GROUND_Y - 100,
        height: type === 'ground' ? 50 : 60,
        emoji: cringeObstacles[Math.floor(Math.random() * cringeObstacles.length)]
      }]);
    }, 1200 / (speed / 8));

    return () => clearInterval(obstacleIntervalRef.current);
  }, [gameStarted, gameOver, speed]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    coinIntervalRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      const isPowerUp = Math.random() > 0.9;
      setCoins(c => [...c, {
        z: GAME_HEIGHT,
        lane,
        y: GROUND_Y - 50 - Math.random() * 80,
        emoji: isPowerUp ? '🌟' : cringeCoins[Math.floor(Math.random() * cringeCoins.length)],
        isPowerUp,
        collected: false
      }]);
    }, 800);

    return () => clearInterval(coinIntervalRef.current);
  }, [gameStarted, gameOver]);

  const getLaneX = (lane) => lane * LANE_WIDTH + LANE_WIDTH / 2;

  const getScale = (z) => {
    const minScale = 0.3;
    const maxScale = 1.5;
    return minScale + ((GAME_HEIGHT - z) / GAME_HEIGHT) * (maxScale - minScale);
  };

  const getY = (baseY, z) => {
    return baseY - (GAME_HEIGHT - z) * 0.3;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-pink-700 to-orange-600 p-2 sm:p-4">
      <div className="mb-2 sm:mb-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg animate-pulse" 
            style={{fontFamily: 'Comic Sans MS, cursive'}}>
          🏃 CRINGE SUBWAY RUNNER 🚇
        </h1>
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-white text-base sm:text-xl flex-wrap">
          <span className="animate-bounce">Score: <span className="font-bold text-yellow-300">{score}</span> 🏆</span>
          <span>Distance: <span className="font-bold text-pink-300">{Math.floor(distance/10)}m</span> 🏃</span>
          <span>Best: <span className="font-bold text-green-300">{highScore}</span> 👑</span>
          {powerUp && <span className="text-2xl animate-spin">{powerUp}</span>}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition text-sm"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
        {speed > 8 && <p className="text-white text-sm animate-pulse mt-1">⚡ SPEED: {speed.toFixed(1)}x ⚡</p>}
      </div>

      <div
        className="relative bg-gradient-to-b from-gray-700 via-gray-600 to-gray-500 rounded-lg shadow-2xl overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, perspective: '800px' }}
      >
        {/* Rainbow trail when invincible */}
        {invincible && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 opacity-40 animate-pulse" />
        )}

        {/* Lane dividers - 3D perspective */}
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute bg-yellow-400 opacity-60"
            style={{
              left: i * LANE_WIDTH,
              top: 0,
              width: 3,
              height: GAME_HEIGHT,
              transform: 'rotateY(0deg) translateZ(0px)'
            }}
          />
        ))}

        {/* Ground pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-500" />
        </div>

        {/* Obstacles - 3D perspective */}
        {obstacles.map((obs, i) => {
          const scale = getScale(obs.z);
          const displayY = getY(obs.y, obs.z);
          
          return (
            <div
              key={i}
              className="absolute bg-red-600 border-4 border-red-800 rounded-lg flex items-center justify-center shadow-2xl transition-all"
              style={{
                left: getLaneX(obs.lane) - (40 * scale) / 2,
                top: displayY,
                width: 40 * scale,
                height: obs.height * scale,
                fontSize: 25 * scale,
                opacity: scale
              }}
            >
              {obs.emoji}
            </div>
          );
        })}

        {/* Coins - 3D perspective */}
        {coins.map((coin, i) => {
          const scale = getScale(coin.z);
          const displayY = getY(coin.y, coin.z);
          
          return (
            <div
              key={i}
              className={`absolute ${coin.isPowerUp ? 'animate-spin' : 'animate-bounce'} transition-all`}
              style={{
                left: getLaneX(coin.lane) - (20 * scale),
                top: displayY,
                fontSize: 30 * scale,
                opacity: scale
              }}
            >
              {coin.emoji}
            </div>
          );
        })}

        {/* Player - bottom center with jump */}
        <div
          className={`absolute transition-all duration-100 ${invincible ? 'animate-pulse' : ''}`}
          style={{
            left: getLaneX(playerLane) - PLAYER_SIZE / 2,
            bottom: 150 - playerY + (isSliding ? PLAYER_SIZE/2 : 0),
            fontSize: isSliding ? PLAYER_SIZE * 0.6 : PLAYER_SIZE,
            transform: `${isJumping ? 'rotate(-10deg)' : 'rotate(0deg)'} ${isSliding ? 'scaleY(0.5)' : 'scaleY(1)'}`,
            zIndex: 100
          }}
        >
          {invincible ? '✨' : currentChar}
        </div>

        {/* Celebration */}
        {celebration && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-lg sm:text-2xl font-bold text-white animate-bounce pointer-events-none z-10 bg-black bg-opacity-60 px-3 py-2 rounded-full"
               style={{fontFamily: 'Comic Sans MS, cursive'}}>
            {celebration}
          </div>
        )}

        {/* Start screen */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white p-4">
              <p className="text-2xl sm:text-4xl font-bold mb-4 animate-bounce" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                🚇 TAP TO START! 🚇
              </p>
              <p className="text-sm sm:text-base mb-2">← → or A/D: Switch lanes</p>
              <p className="text-sm sm:text-base mb-2">↑ or W/Space: Jump</p>
              <p className="text-sm sm:text-base mb-2">↓ or S: Slide</p>
              <p className="text-xs sm:text-sm mt-2 text-yellow-300">Swipe on mobile! 📱</p>
            </div>
          </div>
        )}

        {/* Game over */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-center text-white p-4">
              <p className="text-3xl sm:text-5xl font-bold mb-2 animate-pulse" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                {cringe}
              </p>
              <p className="text-xl sm:text-3xl mb-2">Score: {score} 🏆</p>
              <p className="text-lg sm:text-2xl mb-4">Distance: {Math.floor(distance/10)}m 🏃</p>
              {score > highScore && (
                <p className="text-lg sm:text-xl text-yellow-300 mb-4 animate-bounce">
                  🎉 NEW RECORD! SLAY! 🎉
                </p>
              )}
              <p className="text-sm sm:text-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                TAP OR PRESS ANY KEY TO RETRY! 😤✨
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-4 text-white text-center drop-shadow">
        <p className="text-xs sm:text-sm" style={{fontFamily: 'Comic Sans MS, cursive'}}>
          🚇 SUBWAY SURFER BUT CRINGE! 🚇
        </p>
        <p className="text-xs sm:text-sm mt-1">Arrows/WASD or Swipe to move! Collect 🌟 for power!</p>
      </div>

      {/* Mobile swipe overlay */}
      <div 
        className="fixed inset-0 touch-none z-50 pointer-events-auto md:hidden"
        onTouchStart={(e) => {
          if (!gameStarted && !gameOver) {
            setGameStarted(true);
            return;
          }
          if (gameOver) {
            resetGame();
            return;
          }
          
          const touch = e.touches[0];
          const startX = touch.clientX;
          const startY = touch.clientY;
          
          const handleTouchMove = (moveEvent) => {
            const moveTouch = moveEvent.touches[0];
            const deltaX = moveTouch.clientX - startX;
            const deltaY = moveTouch.clientY - startY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
              if (deltaX > 0) moveRight();
              else moveLeft();
              window.removeEventListener('touchmove', handleTouchMove);
            } else if (Math.abs(deltaY) > 50) {
              if (deltaY < 0) jump();
              else slide();
              window.removeEventListener('touchmove', handleTouchMove);
            }
          };
          
          window.addEventListener('touchmove', handleTouchMove);
          setTimeout(() => window.removeEventListener('touchmove', handleTouchMove), 300);
        }}
      />
    </div>
  );
};

export default SubwayCringeRunner;