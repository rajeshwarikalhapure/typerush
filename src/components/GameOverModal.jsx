import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * GameOverModal — post-game summary with stats and name entry.
 */
export default function GameOverModal({ score, bestCombo, accuracy, wpm, elapsed, onRestart, onSave }) {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSave = () => {
    if (playerName.trim() && !saved) {
      onSave(playerName.trim().slice(0, 12).toUpperCase());
      setSaved(true);
    }
  };

  const stats = [
    { label: 'Final Score', value: score.toLocaleString(), color: '#00ffff', icon: '◈' },
    { label: 'Best Combo', value: `x${bestCombo}`, color: '#ff00ff', icon: '⚡' },
    { label: 'Accuracy', value: `${accuracy}%`, color: '#00ff88', icon: '◎' },
    { label: 'WPM', value: wpm, color: '#ffee00', icon: '▸' },
    { label: 'Survived', value: timeStr, color: '#bb66ff', icon: '⏱' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        className="glass border-glow-pink w-full max-w-lg rounded-2xl overflow-hidden relative"
        initial={{ scale: 0.7, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-500/60" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500/60" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500/60" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-500/60" />

        {/* Header */}
        <div className="text-center py-8 px-6 border-b border-pink-500/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-3"
          >
            💀
          </motion.div>
          <motion.h2
            className="font-orbitron font-black text-4xl neon-text-pink tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            GAME OVER
          </motion.h2>
          <motion.p
            className="font-mono text-xs text-gray-500 tracking-widest mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            THE RUSH HAS ENDED
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="p-6 grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-black/30 rounded-xl p-3 flex flex-col items-center border border-gray-800/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase mb-1">
                {s.icon} {s.label}
              </span>
              <span
                className="font-orbitron font-bold text-2xl"
                style={{ color: s.color, textShadow: `0 0 10px ${s.color}66` }}
              >
                {s.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Save score section */}
        <motion.div
          className="px-6 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {!saved ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder="ENTER YOUR NAME"
                maxLength={12}
                className="type-input flex-1 px-3 py-2 rounded-lg text-sm"
                style={{ userSelect: 'text', cursor: 'text' }}
              />
              <motion.button
                onClick={handleSave}
                disabled={!playerName.trim()}
                className="btn-cyber px-4 py-2 rounded-lg text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                whileHover={playerName.trim() ? { scale: 1.05 } : {}}
                whileTap={playerName.trim() ? { scale: 0.96 } : {}}
              >
                SAVE
              </motion.button>
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center font-mono text-green-400 text-sm tracking-widest"
            >
              ✓ SCORE SAVED — {playerName}
            </motion.p>
          )}
        </motion.div>

        {/* Restart button */}
        <motion.div
          className="px-6 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            onClick={onRestart}
            className="w-full btn-cyber py-4 rounded-xl text-base font-orbitron tracking-widest"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(0,255,255,0.2)',
                '0 0 25px rgba(0,255,255,0.5)',
                '0 0 10px rgba(0,255,255,0.2)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            [ PLAY AGAIN ]
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
