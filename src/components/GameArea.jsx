import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FallingWord from './FallingWord.jsx';
import HUD from './HUD.jsx';
import Shooter from './Shooter.jsx';
import LaserBullet from './LaserBullet.jsx';
import ExplosionEffect from './ExplosionEffect.jsx';

/**
 * GameArea — the main gameplay screen.
 * Contains the falling word zone + bottom input area.
 */
export default function GameArea({
  isActive = true,
  words,
  lasers,
  explosions,
  score,
  health,
  combo,
  wpm,
  accuracy,
  elapsed,
  inputValue,
  handleInput,
  inputError,
  handleWordMissed,
  activePowerup,
  powerupTimer,
}) {
  const inputRef = useRef(null);

  // Always keep input focused during gameplay (if active)
  useEffect(() => {
    if (!isActive) return;
    const focus = () => inputRef.current?.focus();
    focus();
    document.addEventListener('keydown', focus);
    return () => document.removeEventListener('keydown', focus);
  }, [isActive]);

  const handleKeyDown = (e) => {
    // Allow space to submit
    if (e.key === ' ') {
      e.preventDefault();
      handleInput(inputValue + ' ');
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // Don't process if contains space (handled by keydown)
    if (!val.includes(' ')) {
      handleInput(val);
    }
  };

  // Find the word being currently typed
  const activeWord = words.find(w =>
    inputValue.length > 0 && w.text.toLowerCase().startsWith(inputValue.toLowerCase())
  );

  return (
    <motion.div 
      className="relative w-full h-screen overflow-hidden" 
      onClick={() => inputRef.current?.focus()}
      animate={inputError ? { x: [-8, 8, -5, 5, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hidden input to capture ALL typing */}
      <input
        ref={inputRef}
        type="text"
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck="false"
      />
      {/* ── HUD overlay ── */}
      <HUD
        score={score}
        health={health}
        combo={combo}
        wpm={wpm}
        accuracy={accuracy}
        elapsed={elapsed}
        activePowerup={activePowerup}
        powerupTimer={powerupTimer}
      />

      {/* ── Slow-motion overlay ── */}
      <AnimatePresence>
        {activePowerup === 'slow' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(circle, rgba(0,100,255,0.05) 0%, rgba(0,0,0,0) 70%)' }}
          />
        )}
      </AnimatePresence>

      {/* ── Falling words zone ── */}
      <div
        className="absolute inset-0 pt-20 pb-36"
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {words.map(word => (
            <FallingWord
              key={word.id}
              word={word}
              typedValue={activeWord?.id === word.id ? inputValue : ''}
              onMissed={handleWordMissed}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Lasers and Explosions ── */}
      {lasers?.map(l => <LaserBullet key={l.id} {...l} />)}
      {explosions?.map(e => <ExplosionEffect key={e.id} {...e} />)}

      {/* ── Shooter Cannon ── */}
      <Shooter combo={combo} activeWord={activeWord} />

      {/* ── Bottom danger zone line ── */}
      <div className="absolute bottom-32 left-0 right-0 h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, #ff0055 20%, #ff0055 80%, transparent)' }}
      />
      <div className="absolute bottom-32 left-4 font-mono text-[10px] text-red-500/40 tracking-widest uppercase">
        ◀ DANGER ZONE ▶
      </div>

      {/* ── Input area ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Input panel */}
          <motion.div
            className="glass border-glow-cyan rounded-2xl p-4 relative"
            animate={inputError ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Corner decorators */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50 rounded-br-2xl" />

            <div className="flex items-center gap-3">
              {/* Blinking cursor icon */}
              <motion.span
                className="font-mono text-cyan-400 text-xl"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ▶
              </motion.span>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`type-input flex-1 bg-transparent px-3 py-2 rounded-lg ${inputError ? 'error' : ''}`}
                placeholder="TYPE HERE..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                style={{ userSelect: 'text', cursor: 'text' }}
              />

              {/* Word count badge */}
              <div className="font-mono text-xs text-gray-600 whitespace-nowrap">
                {words.length} word{words.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Combo streak display */}
            {combo > 0 && (
              <div className="mt-2 flex justify-center">
                <motion.div
                  key={combo}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`font-orbitron text-xs tracking-widest px-3 py-1 rounded-full border ${
                    combo >= 10
                      ? 'border-pink-500/50 text-pink-400 bg-pink-500/10'
                      : combo >= 5
                      ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                      : 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5'
                  }`}
                >
                  {combo >= 10 ? '🔥 ' : combo >= 5 ? '⚡ ' : ''}
                  COMBO x{combo}
                  {combo >= 10 ? ' 🔥' : combo >= 5 ? ' ⚡' : ''}
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Hint */}
          <p className="font-mono text-[10px] text-center text-gray-700 mt-2 tracking-widest">
            PRESS SPACE TO SUBMIT • TYPE TO MATCH FALLING WORDS
          </p>
        </div>
      </div>
    </motion.div>
  );
}
