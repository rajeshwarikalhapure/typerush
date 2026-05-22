import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic.js';
import ParticleBackground from './components/ParticleBackground.jsx';
import StartScreen from './components/StartScreen.jsx';
import GameArea from './components/GameArea.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import { SoundManager } from './utils/SoundManager.js';

export default function App() {
  const {
    screen, startGame, setScreen,
    difficulty, setDifficulty,
    words, lasers, explosions, wave, score, health, combo, bestCombo,
    elapsed, wpm, accuracy, wordsCompleted,
    inputValue, handleInput, inputError,
    handleWordMissed,
    activePowerup, powerupTimer,
    saveScore, getLeaderboard,
  } = useGameLogic();

  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(SoundManager.toggleMute());
  };

  const leaderboard = getLeaderboard();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020408] cyber-grid scanlines">
      {/* ── Animated particle background ── */}
      <ParticleBackground />

      {/* ── Ambient glow blobs ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)',
          top: -200, left: -200,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,255,0.04) 0%, transparent 70%)',
          bottom: -150, right: -150,
        }}
      />

      {/* ── Version badge ── */}
      <div className="fixed bottom-2 left-2 z-50 font-mono text-[9px] text-gray-800 tracking-widest">
        TYPERUSH v1.0 // NEURAL ENGINE
      </div>

      {/* ── Sound Toggle ── */}
      <button
        onClick={toggleSound}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full glass border-glow-cyan flex items-center justify-center text-cyan-400 hover:text-white transition-colors"
        title="Toggle Sound"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* ── Screen Router ── */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">

          {/* START SCREEN */}
          {screen === 'start' && (
            <motion.div key="start" className="w-full h-full">
              <StartScreen
                onStart={startGame}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                leaderboard={leaderboard}
              />
            </motion.div>
          )}

          {/* GAME SCREEN */}
          {screen === 'game' && (
            <motion.div
              key="game"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameArea
                words={words}
                lasers={lasers}
                explosions={explosions}
                wave={wave}
                score={score}
                health={health}
                combo={combo}
                wpm={wpm}
                accuracy={accuracy}
                elapsed={elapsed}
                inputValue={inputValue}
                handleInput={handleInput}
                inputError={inputError}
                handleWordMissed={handleWordMissed}
                activePowerup={activePowerup}
                powerupTimer={powerupTimer}
              />
            </motion.div>
          )}

          {/* GAME OVER SCREEN */}
          {screen === 'gameover' && (
            <motion.div
              key="gameover"
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Dim game area in background */}
              <div className="opacity-20 pointer-events-none">
                <GameArea
                  isActive={false}
                  words={[]}
                  score={score}
                  health={0}
                  combo={combo}
                  wpm={wpm}
                  accuracy={accuracy}
                  elapsed={elapsed}
                  inputValue=""
                  handleInput={() => {}}
                  inputError={false}
                  handleWordMissed={() => {}}
                  activePowerup={null}
                  powerupTimer={0}
                />
              </div>

              <GameOverModal
                score={score}
                bestCombo={bestCombo}
                accuracy={accuracy}
                wpm={wpm}
                elapsed={elapsed}
                onRestart={() => setScreen('start')}
                onSave={saveScore}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
