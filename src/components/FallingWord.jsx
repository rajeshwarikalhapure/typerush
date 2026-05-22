import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * FallingWord — individual word that falls from top to bottom.
 * Calls onMissed when it reaches the bottom.
 */
export default function FallingWord({ word, typedValue, onMissed }) {
  const { id, text, xPercent, fallDuration, color, isPowerup } = word;
  const missedRef = useRef(false);

  // Highlight matching typed characters
  const renderLetters = () => {
    const typed = typedValue.toLowerCase();
    const wordLower = text.toLowerCase();

    return text.split('').map((char, i) => {
      let cls = '';
      if (i < typed.length) {
        cls = typed[i] === wordLower[i] ? 'text-white opacity-100' : 'text-red-500 opacity-100';
      }
      return (
        <span key={i} className={cls}>
          {char}
        </span>
      );
    });
  };

  const isBeingTyped = typedValue.length > 0 &&
    text.toLowerCase().startsWith(typedValue.toLowerCase());

  const wordClasses = isPowerup
    ? 'word-yellow font-black'
    : `word-${color}`;

  return (
    <motion.div
      key={id}
      className="absolute pointer-events-none select-none"
      style={{ left: `${xPercent}%`, top: 0 }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: '100vh', opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{
        y: { duration: fallDuration, ease: 'linear' },
        opacity: { duration: 0.2 }
      }}
      onAnimationComplete={() => {
        if (!missedRef.current) {
          missedRef.current = true;
          onMissed(id);
        }
      }}
    >
      {/* Word label */}
      <div
        className={`relative font-mono font-bold text-lg md:text-xl tracking-wider whitespace-nowrap
          ${wordClasses}
          ${isBeingTyped ? 'scale-110' : ''}
          transition-transform duration-100`}
      >
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 blur-sm opacity-30 font-mono font-bold text-lg md:text-xl tracking-wider whitespace-nowrap"
          aria-hidden="true"
          style={{ color: 'inherit' }}
        >
          {text}
        </div>
        {/* Actual letters (with per-char highlight) */}
        <span className="relative z-10">
          {renderLetters()}
        </span>

        {/* Power-up badge */}
        {isPowerup && (
          <motion.span
            className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-orbitron tracking-widest text-yellow-300 whitespace-nowrap"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            ⚡ POWER-UP
          </motion.span>
        )}

        {/* Active typing underline */}
        {isBeingTyped && (
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5"
            style={{ 
              background: color === 'pink' ? '#ff44cc' : '#00ffff',
              originX: 0
            }}
            layoutId="typingUnderline"
            animate={{ scaleX: typedValue.length / text.length }}
          />
        )}
      </div>
    </motion.div>
  );
}
