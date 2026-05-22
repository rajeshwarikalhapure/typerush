import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HUD — top dashboard overlay during gameplay
 */
export default function HUD({ score, health, combo, wpm, accuracy, elapsed, activePowerup, powerupTimer, wave }) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const healthColor = health > 60 ? '#00ff88' : health > 30 ? '#ffee00' : '#ff0055';
  const healthGlow = health > 60
    ? '0 0 10px #00ff88, 0 0 20px #00ff8844'
    : health > 30
    ? '0 0 10px #ffee00, 0 0 20px #ffee0044'
    : '0 0 10px #ff0055, 0 0 20px #ff005544';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 pointer-events-none">
      <div className="flex items-start gap-3 max-w-screen-xl mx-auto">

        {/* ── Wave ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[70px]">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Wave</span>
          <span className="font-orbitron font-bold text-lg text-white">{wave || 1}</span>
        </div>

        {/* ── Score ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px]">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Score</span>
          <motion.span
            key={score}
            className="font-orbitron font-bold text-lg neon-text-cyan"
            initial={{ scale: 1.3, color: '#ffffff' }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {score.toLocaleString()}
          </motion.span>
        </div>

        {/* ── Health bar (center) ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Health</span>
            <span className="font-mono text-xs" style={{ color: healthColor }}>{health}%</span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden relative border border-gray-800">
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${health}%`, background: healthColor, boxShadow: healthGlow }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            {/* Health bar scan line */}
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── WPM ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px]">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">WPM</span>
          <span className="font-orbitron font-bold text-lg neon-text-green">{wpm}</span>
        </div>

        {/* ── Accuracy ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px]">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Acc</span>
          <span className="font-orbitron font-bold text-lg neon-text-pink">{accuracy}%</span>
        </div>

        {/* ── Combo ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[80px] relative overflow-hidden">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Combo</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={combo}
              className={`font-orbitron font-black text-lg ${combo >= 10 ? 'neon-text-pink' : combo >= 5 ? 'neon-text-purple' : 'text-white'}`}
              initial={{ y: -10, opacity: 0, scale: 1.4 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              x{combo}
            </motion.span>
          </AnimatePresence>
          {combo >= 5 && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ background: combo >= 10 ? 'rgba(255,0,255,0.1)' : 'rgba(139,0,255,0.1)' }}
            />
          )}
        </div>

        {/* ── Timer ── */}
        <div className="glass border-glow-cyan px-4 py-2 rounded-xl flex flex-col items-center min-w-[90px]">
          <span className="font-mono text-[10px] text-cyan-600 tracking-widest uppercase">Time</span>
          <span className="font-mono font-bold text-lg text-yellow-300">{timeStr}</span>
        </div>

        {/* ── Power-up indicator ── */}
        <AnimatePresence>
          {activePowerup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: 20 }}
              className="powerup-badge px-4 py-2 rounded-xl flex flex-col items-center min-w-[100px]"
            >
              <span className="font-mono text-[10px] tracking-widest uppercase">Power-up</span>
              <span className="font-orbitron font-bold text-sm">
                {activePowerup === 'slow' ? '❄️ FREEZE' : '🛡️ SHIELD'}
              </span>
              <span className="font-mono text-[10px] text-yellow-300">{powerupTimer}s</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
