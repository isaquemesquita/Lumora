import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LumoraLogoProps {
  className?: string;
  size?: number;
}

interface Particle {
  id: number;
  char: string;
  angle: number;
  distance: number;
}

type AnimationPhase = 'idle' | 'waiting' | 'attacking' | 'charging' | 'exploding' | 'dying';

export function LumoraLogo({ className = '', size = 48 }: LumoraLogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    if (isHovered && phase === 'idle') {
      setPhase('waiting');
      
      // Após 3 segundos, iniciar ataque
      const waitTimer = setTimeout(() => {
        // Criar partículas ao redor
        const chars = ['#', '@', '%', '$', '&', '*', '!', '?', '0', '1'];
        const newParticles: Particle[] = [];
        const numParticles = 12;
        
        for (let i = 0; i < numParticles; i++) {
          newParticles.push({
            id: i,
            char: chars[Math.floor(Math.random() * chars.length)],
            angle: (360 / numParticles) * i,
            distance: 150,
          });
        }
        
        setParticles(newParticles);
        setPhase('attacking');
        
        // Após 1s de ataque, começar charging
        setTimeout(() => {
          setPhase('charging');
          
          // Após 0.8s charging, explodir
          setTimeout(() => {
            setPhase('exploding');
            setShowExplosion(true);
            
            // Esconder explosão rapidamente
            setTimeout(() => {
              setShowExplosion(false);
              setPhase('dying');
              
              // Limpar tudo após partículas caírem
              setTimeout(() => {
                setParticles([]);
                setPhase('idle');
              }, 1500);
            }, 300);
          }, 800);
        }, 1000);
      }, 3000);

      return () => clearTimeout(waitTimer);
    } else if (!isHovered) {
      setPhase('idle');
      setParticles([]);
      setShowExplosion(false);
    }
  }, [isHovered, phase]);

  const getParticlePosition = (angle: number, distance: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance,
    };
  };

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Particles - Deepfakes attacking */}
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence>
          {particles.map((particle) => {
            const startPos = getParticlePosition(particle.angle, particle.distance);
            const attackPos = getParticlePosition(particle.angle, 40);
            
            return (
              <motion.div
                key={particle.id}
                initial={{
                  opacity: 0,
                  x: startPos.x,
                  y: startPos.y,
                  scale: 0.5,
                  rotate: 0,
                }}
                animate={
                  phase === 'attacking'
                    ? {
                        opacity: 1,
                        x: attackPos.x,
                        y: attackPos.y,
                        scale: 1.2,
                        rotate: particle.angle,
                      }
                    : phase === 'charging'
                    ? {
                        opacity: 1,
                        x: attackPos.x,
                        y: attackPos.y,
                        scale: 1.2,
                        rotate: particle.angle,
                      }
                    : phase === 'exploding'
                    ? {
                        opacity: 1,
                        x: attackPos.x,
                        y: attackPos.y,
                        scale: 1.5,
                        rotate: particle.angle + 45,
                      }
                    : phase === 'dying'
                    ? {
                        opacity: 0,
                        x: attackPos.x + (Math.random() - 0.5) * 60,
                        y: attackPos.y + 200,
                        scale: 0.3,
                        rotate: particle.angle + (Math.random() - 0.5) * 720,
                      }
                    : {}
                }
                transition={{
                  duration:
                    phase === 'attacking'
                      ? 1
                      : phase === 'dying'
                      ? 1.5
                      : phase === 'exploding'
                      ? 0.2
                      : 0.8,
                  ease: phase === 'dying' ? [0.6, 0.01, 0.9, 0.9] : [0.4, 0, 0.2, 1],
                }}
                className="absolute left-1/2 top-1/2 select-none font-mono text-2xl font-bold text-red-500"
                style={{
                  textShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                }}
              >
                {particle.char}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Explosion effect */}
      <AnimatePresence>
        {showExplosion && (
          <>
            {/* Main flash */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2.5, 3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className="h-40 w-40 rounded-full bg-amber-400"
                style={{
                  boxShadow: '0 0 100px 50px rgba(251, 191, 36, 0.8)',
                }}
              />
            </motion.div>
            
            {/* Shockwave rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="h-32 w-32 rounded-full border-4 border-amber-400/50" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        animate={{
          scale:
            phase === 'charging'
              ? [1, 1.05, 1, 1.05, 1, 1.05, 1]
              : phase === 'exploding'
              ? 1.2
              : isHovered
              ? 1.1
              : 1,
          x:
            phase === 'charging'
              ? [0, -3, 3, -2, 2, -1, 1, 0]
              : 0,
          y:
            phase === 'charging'
              ? [0, -2, 2, -3, 3, -1, 1, 0]
              : 0,
        }}
        transition={{
          duration: phase === 'charging' ? 0.8 : phase === 'exploding' ? 0.2 : 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          filter:
            phase === 'charging'
              ? 'drop-shadow(0 0 40px rgba(251,191,36,1)) drop-shadow(0 0 80px rgba(251,191,36,0.8))'
              : phase === 'exploding'
              ? 'drop-shadow(0 0 60px rgba(251,191,36,1)) drop-shadow(0 0 120px rgba(251,191,36,1))'
              : isHovered
              ? 'drop-shadow(0 0 30px rgba(251,191,36,0.95)) drop-shadow(0 0 60px rgba(251,191,36,0.7))'
              : 'drop-shadow(0 0 15px rgba(251,191,36,0.5))',
        }}
      >
        <defs>
          {/* Gradient for the lighthouse beam */}
          <linearGradient id="beamGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Gradient for the shield */}
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
          </linearGradient>
          
          {/* Glow effect */}
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </radialGradient>

          {/* Filter for outer glow */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer glow circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#glowGradient)"
          animate={{
            opacity:
              phase === 'charging'
                ? [0.4, 1, 0.4, 1, 0.4]
                : phase === 'exploding'
                ? 1
                : isHovered
                ? 0.9
                : 0.4,
            r:
              phase === 'charging'
                ? [45, 52, 45, 52, 45]
                : phase === 'exploding'
                ? 60
                : isHovered
                ? 50
                : 45,
          }}
          transition={{
            duration: phase === 'charging' ? 0.8 : phase === 'exploding' ? 0.2 : 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
        
        {/* Shield base */}
        <motion.path
          d="M50 10 L75 20 L75 45 Q75 65 50 85 Q25 65 25 45 L25 20 Z"
          fill="url(#shieldGradient)"
          stroke="#fbbf24"
          strokeWidth="1.5"
          opacity="0.9"
          filter="url(#glow)"
          animate={{
            opacity: phase === 'charging' || phase === 'exploding' ? 1 : isHovered ? 1 : 0.9,
          }}
          transition={{
            duration: 0.3,
          }}
        />
        
        {/* Inner shield detail */}
        <path
          d="M50 18 L68 25 L68 45 Q68 60 50 75 Q32 60 32 45 L32 25 Z"
          fill="none"
          stroke="#fef3c7"
          strokeWidth="1"
          opacity="0.4"
        />
        
        {/* Lighthouse tower */}
        <path
          d="M45 35 L45 60 L55 60 L55 35 Z"
          fill="url(#beamGradient)"
          opacity="0.9"
        />
        
        {/* Lighthouse top (light source) */}
        <motion.circle
          cx="50"
          cy="32"
          r="6"
          fill="#fef3c7"
          filter="url(#glow)"
          animate={{
            r:
              phase === 'charging'
                ? [6, 10, 6, 10, 6]
                : phase === 'exploding'
                ? 12
                : isHovered
                ? 8
                : 6,
            opacity: phase === 'charging' || phase === 'exploding' ? 1 : isHovered ? 1 : 0.9,
          }}
          transition={{
            duration: phase === 'charging' ? 0.8 : phase === 'exploding' ? 0.2 : 0.3,
          }}
        />
        
        {/* Light beams radiating outward */}
        <motion.g
          animate={{
            opacity:
              phase === 'charging'
                ? [0.6, 1, 0.6, 1, 0.6]
                : phase === 'exploding'
                ? 1
                : isHovered
                ? 1
                : 0.6,
          }}
          transition={{
            duration: phase === 'charging' ? 0.8 : 0.3,
          }}
        >
          <motion.path
            d="M50 32 L35 25"
            stroke="#fbbf24"
            strokeLinecap="round"
            animate={{
              strokeWidth:
                phase === 'charging'
                  ? [1.5, 4, 1.5, 4, 1.5]
                  : phase === 'exploding'
                  ? 5
                  : isHovered
                  ? 3
                  : 1.5,
            }}
            transition={{
              duration: phase === 'charging' ? 0.8 : 0.3,
            }}
          />
          <motion.path
            d="M50 32 L65 25"
            stroke="#fbbf24"
            strokeLinecap="round"
            animate={{
              strokeWidth:
                phase === 'charging'
                  ? [1.5, 4, 1.5, 4, 1.5]
                  : phase === 'exploding'
                  ? 5
                  : isHovered
                  ? 3
                  : 1.5,
            }}
            transition={{
              duration: phase === 'charging' ? 0.8 : 0.3,
            }}
          />
          <motion.path
            d="M50 32 L30 32"
            stroke="#fbbf24"
            strokeLinecap="round"
            animate={{
              strokeWidth:
                phase === 'charging'
                  ? [1.5, 4, 1.5, 4, 1.5]
                  : phase === 'exploding'
                  ? 5
                  : isHovered
                  ? 3
                  : 1.5,
            }}
            transition={{
              duration: phase === 'charging' ? 0.8 : 0.3,
            }}
          />
          <motion.path
            d="M50 32 L70 32"
            stroke="#fbbf24"
            strokeLinecap="round"
            animate={{
              strokeWidth:
                phase === 'charging'
                  ? [1.5, 4, 1.5, 4, 1.5]
                  : phase === 'exploding'
                  ? 5
                  : isHovered
                  ? 3
                  : 1.5,
            }}
            transition={{
              duration: phase === 'charging' ? 0.8 : 0.3,
            }}
          />
        </motion.g>
        
        {/* Eye symbol in the middle (detection/awareness) */}
        <g transform="translate(50, 47)">
          <ellipse
            cx="0"
            cy="0"
            rx="8"
            ry="5"
            fill="none"
            stroke="#fef3c7"
            strokeWidth="1.5"
          />
          <circle
            cx="0"
            cy="0"
            r="2.5"
            fill="#fbbf24"
          />
        </g>
        
        {/* Bottom decorative elements */}
        <path
          d="M40 65 L45 70 L50 68 L55 70 L60 65"
          stroke="#fef3c7"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </motion.svg>
    </div>
  );
}
