import React from 'react';
import { motion } from 'framer-motion';

export default function ExplosionEffect({ x, y, color, text, hit, isPowerup }) {
  const glowColor = color === 'pink' ? '#ff44cc' : color === 'yellow' ? '#ffff00' : color === 'red' ? '#ff0055' : '#00ffff';
  const wordClasses = isPowerup ? 'word-yellow font-black' : `word-${color}`;
  
  // y is percentFallen (0 to 1). Calculate exact pixel offset relative to top to match FallingWord.
  const targetY = `calc(-60px + ${y * 100}vh + ${y * 60}px)`;

  return (
    <div className="absolute z-20 pointer-events-none" style={{ left: `${x}%`, top: targetY }}>
      
      {/* ── Pre-Hit: Frozen glowing word ── */}
      {!hit && text && (
        <div className={`absolute -translate-x-1/2 font-mono font-bold text-lg md:text-xl tracking-wider whitespace-nowrap ${wordClasses}`}>
          <motion.div
            initial={{ scale: 1, filter: 'brightness(1)' }}
            animate={{ scale: 1.2, filter: 'brightness(2)' }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.div>
        </div>
      )}

      {/* ── Post-Hit: Explosion and Shatter ── */}
      {hit && (
        <>
          {/* Central Flash */}
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white mix-blend-screen"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Shattered Text Letters */}
          {text && text.split('').map((char, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 100;
            const destX = Math.cos(angle) * dist;
            const destY = Math.sin(angle) * dist;
            const rot = (Math.random() - 0.5) * 360;

            return (
              <motion.div
                key={`char-${i}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-lg md:text-xl ${wordClasses}`}
                initial={{ x: (i - text.length / 2) * 12, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: destX, y: destY, opacity: 0, rotate: rot }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {char}
              </motion.div>
            );
          })}

          {/* Particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: glowColor, boxShadow: `0 0 10px ${glowColor}` }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150,
                opacity: 0,
                scale: 0
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </div>
  );
}
