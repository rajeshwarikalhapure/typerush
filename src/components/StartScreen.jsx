import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'EASY',
    desc: 'Short words · Slow fall · 10 HP loss',
    icon: '◈',
    activeClass: 'active-easy',
    color: '#00ff88',
  },
  {
    id: 'medium',
    label: 'MEDIUM',
    desc: 'Mixed words · Normal speed · 15 HP loss',
    icon: '◉',
    activeClass: 'active-medium',
    color: '#00ffff',
  },
  {
    id: 'hard',
    label: 'HARD',
    desc: 'Long words · Fast fall · 20 HP loss',
    icon: '◆',
    activeClass: 'active-hard',
    color: '#ff00ff',
  },
];

export default function StartScreen({ onStart, difficulty, setDifficulty, leaderboard }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* ── Decorative corner lines ── */}
      <div className="fixed top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-cyan-400 opacity-40" />
      <div className="fixed top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-cyan-400 opacity-40" />
      <div className="fixed bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-pink-500 opacity-40" />
      <div className="fixed bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-pink-500 opacity-40" />

      {/* ── System badge ── */}
      <motion.div variants={itemVariants} className="mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-mono text-xs text-green-400 tracking-widest uppercase">
          SYSTEM ONLINE // NEURAL-LINK ACTIVE
        </span>
      </motion.div>

      {/* ── Title ── */}
      <motion.div variants={itemVariants} className="text-center mb-2">
        <motion.h1
          className="font-orbitron font-black text-8xl md:text-9xl gradient-title tracking-widest leading-none select-none"
          animate={{ filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          TYPE
        </motion.h1>
        <motion.h1
          className="font-orbitron font-black text-8xl md:text-9xl gradient-title tracking-widest leading-none select-none -mt-4"
          animate={{ filter: ['brightness(1.3)', 'brightness(1)', 'brightness(1.3)'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          RUSH
        </motion.h1>
      </motion.div>

      {/* ── Tagline ── */}
      <motion.p
        variants={itemVariants}
        className="font-mono text-sm text-cyan-400 tracking-[0.3em] uppercase mb-10 opacity-70"
      >
        ⚡ TYPE FASTER. SURVIVE LONGER. DOMINATE. ⚡
      </motion.p>

      {/* ── Difficulty Selector ── */}
      <motion.div variants={itemVariants} className="mb-8 w-full max-w-lg">
        <p className="font-orbitron text-xs text-center text-cyan-400 tracking-widest mb-4 opacity-60 uppercase">
          — Select Difficulty —
        </p>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map(d => (
            <motion.button
              key={d.id}
              className={`diff-btn relative p-4 rounded-lg font-rajdhani text-center transition-all ${
                difficulty === d.id ? d.activeClass : 'text-gray-400'
              }`}
              onClick={() => setDifficulty(d.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-2xl mb-1" style={{ color: difficulty === d.id ? d.color : '#666' }}>
                {d.icon}
              </div>
              <div className="font-orbitron font-bold text-sm tracking-widest">{d.label}</div>
              <div className="text-xs mt-1 opacity-60 leading-tight">{d.desc}</div>
              {difficulty === d.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{ boxShadow: `0 0 20px ${d.color}40` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ── Start Button ── */}
      <motion.div variants={itemVariants}>
        <motion.button
          className="btn-cyber relative px-16 py-5 text-xl rounded-lg font-orbitron tracking-widest"
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 0 10px rgba(0,255,255,0.3), 0 0 30px rgba(0,255,255,0.1)',
              '0 0 20px rgba(0,255,255,0.6), 0 0 60px rgba(0,255,255,0.2)',
              '0 0 10px rgba(0,255,255,0.3), 0 0 30px rgba(0,255,255,0.1)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="relative z-10">[ ENTER THE RUSH ]</span>
          {/* Animated corner bits */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </motion.button>
      </motion.div>

      {/* ── Leaderboard toggle ── */}
      <motion.div variants={itemVariants} className="mt-8">
        <button
          className="font-mono text-sm text-purple-400 hover:text-purple-300 tracking-widest uppercase transition-colors"
          onClick={() => setShowLeaderboard(v => !v)}
        >
          {showLeaderboard ? '▲ Hide Leaderboard' : '▼ View Leaderboard'}
        </button>
      </motion.div>

      {/* ── Inline Leaderboard ── */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 w-full max-w-md overflow-hidden"
          >
            <div className="glass border-glow-cyan p-4 rounded-xl">
              <h3 className="font-orbitron text-sm text-cyan-400 tracking-widest text-center mb-4 uppercase">
                ◈ Top Scores ◈
              </h3>
              {leaderboard.length === 0 ? (
                <p className="font-mono text-gray-600 text-center text-sm py-4">
                  No scores yet. Be the first!
                </p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, i) => (
                    <div
                      key={i}
                      className={`lb-row flex items-center justify-between px-3 py-2 rounded bg-black/30 font-mono text-sm`}
                    >
                      <span className="text-yellow-400 w-6">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                      </span>
                      <span className="text-cyan-300 flex-1 ml-2">{entry.name}</span>
                      <span className="text-pink-400 font-bold">{entry.score.toLocaleString()}</span>
                      <span className="text-gray-500 ml-3 text-xs">{entry.wpm} WPM</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── How to play ── */}
      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="font-mono text-xs text-gray-600 tracking-widest">
          TYPE THE FALLING WORDS · SPACE TO SUBMIT · DON'T LET THEM ESCAPE
        </p>
      </motion.div>
    </motion.div>
  );
}
