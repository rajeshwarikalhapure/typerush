import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomWord, DIFFICULTY_CONFIG, POWERUP_WORDS } from '../data/words.js';
import { SoundManager } from '../utils/SoundManager.js';

let wordIdCounter = 0;

/**
 * useGameLogic — central state machine for TypeRush
 * Returns everything the UI needs to render the game.
 */
export function useGameLogic() {
  /* ── Screen state ── */
  const [screen, setScreen] = useState('start'); // 'start' | 'game' | 'gameover'
  const [difficulty, setDifficulty] = useState('medium');

  /* ── Game state ── */
  const [words, setWords] = useState([]);          // active falling words
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0); // total chars typed correctly
  const [totalAttempts, setTotalAttempts] = useState(0); // keystrokes
  const [elapsed, setElapsed] = useState(0);       // seconds played
  const [wpm, setWpm] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [lasers, setLasers] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [wave, setWave] = useState(1);

  /* ── Input state ── */
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);

  /* ── Power-up state ── */
  const [activePowerup, setActivePowerup] = useState(null); // 'slow' | 'shield' | null
  const [powerupTimer, setPowerupTimer] = useState(0);

  /* ── Refs for intervals ── */
  const spawnRef  = useRef(null);
  const timerRef  = useRef(null);
  const elapsedRef = useRef(0);
  const scoreRef  = useRef(0);
  const wordsCompletedRef = useRef(0);
  const activePowerupRef = useRef(null);
  const typedWordsRef = useRef(new Set());

  /* ── Computed accuracy ── */
  const accuracy = totalAttempts > 0
    ? Math.round((totalTyped / totalAttempts) * 100)
    : 100;

  /* ─────────────────────────────────────────────────
     SPAWN a new word
  ───────────────────────────────────────────────── */
  const spawnWord = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    // Speed scales with time: faster over 90 seconds
    const speedMultiplier = activePowerupRef.current === 'slow' ? 0.4 : 1;
    const timeScale = Math.max(0.5, 1 - (elapsedRef.current / 120));
    const fallDuration = config.fallDuration * timeScale * speedMultiplier;

    // Occasionally spawn a power-up word
    const isPowerup = Math.random() < 0.06;
    const text = isPowerup
      ? POWERUP_WORDS[Math.floor(Math.random() * POWERUP_WORDS.length)]
      : getRandomWord(difficulty, elapsedRef.current);

    // Random horizontal position (avoid edges)
    const xPercent = 5 + Math.random() * 80;

    // Color palette cycle
    const colors = ['cyan', 'pink', 'purple', 'green', 'yellow'];
    const color = isPowerup ? 'yellow' : colors[Math.floor(Math.random() * (colors.length - 1))];

    wordIdCounter += 1;
    const newWord = {
      id: wordIdCounter,
      text,
      xPercent,
      fallDuration,
      color,
      isPowerup,
      spawnedAt: Date.now(),
    };

    setWords(prev => [...prev, newWord]);
  }, [difficulty]);

  /* ─────────────────────────────────────────────────
     START GAME
  ───────────────────────────────────────────────── */
  const startGame = useCallback(() => {
    SoundManager.init();
    // Reset all state
    wordIdCounter = 0;
    elapsedRef.current = 0;
    scoreRef.current = 0;
    wordsCompletedRef.current = 0;
    activePowerupRef.current = null;
    typedWordsRef.current = new Set();

    setWords([]);
    setScore(0);
    setHealth(100);
    setCombo(0);
    setBestCombo(0);
    setTotalTyped(0);
    setTotalAttempts(0);
    setElapsed(0);
    setWpm(0);
    setWordsCompleted(0);
    setInputValue('');
    setInputError(false);
    setActivePowerup(null);
    setPowerupTimer(0);
    setScreen('game');
    SoundManager.startBGM();
  }, []);

  /* ─────────────────────────────────────────────────
     GAME TIMER & WPM
  ───────────────────────────────────────────────── */
  useEffect(() => {
    if (screen !== 'game') return;

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(e => {
        const newElapsed = e + 1;
        // Calculate WPM: words completed / minutes elapsed
        const minutes = newElapsed / 60;
        if (minutes > 0) {
          setWpm(Math.round(wordsCompletedRef.current / minutes));
        }
        return newElapsed;
      });

      // Power-up countdown
      setPowerupTimer(t => {
        if (t > 0) {
          if (t === 1) {
            activePowerupRef.current = null;
            setActivePowerup(null);
          }
          return t - 1;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [screen]);

  /* ─────────────────────────────────────────────────
     WORD SPAWNER — dynamic interval based on elapsed time
  ───────────────────────────────────────────────── */
  useEffect(() => {
    if (screen !== 'game') return;

    const config = DIFFICULTY_CONFIG[difficulty];

    const scheduleNext = () => {
      // Interval decreases over time (more words later)
      const timeScale = Math.max(0.45, 1 - (elapsedRef.current / 100));
      const interval = config.spawnInterval * timeScale;

      spawnRef.current = setTimeout(() => {
        spawnWord();
        scheduleNext();
      }, interval);
    };

    // Spawn first word immediately
    spawnWord();
    scheduleNext();

    return () => clearTimeout(spawnRef.current);
  }, [screen, difficulty, spawnWord]);

  /* ─────────────────────────────────────────────────
     WORD MISSED (fell off screen)
  ───────────────────────────────────────────────── */
  const handleWordMissed = useCallback((wordId) => {
    // If word was already typed, ignore this event (triggered by exit animation)
    if (typedWordsRef.current.has(wordId)) return;

    const config = DIFFICULTY_CONFIG[difficulty];

    setWords(prev => {
      const word = prev.find(w => w.id === wordId);
      if (word) {
        // Trigger red shatter effect at the bottom
        const explosionId = Date.now();
        setExplosions(ex => [...ex, {
          id: explosionId,
          x: word.xPercent,
          y: 1, // 100% fallen
          color: 'red',
          text: word.text,
          hit: true,
          isDamage: true
        }]);
        setTimeout(() => {
          setExplosions(ex => ex.filter(e => e.id !== explosionId));
        }, 600);
      }
      return prev.filter(w => w.id !== wordId);
    });

    // Shield power-up absorbs damage
    if (activePowerupRef.current === 'shield') return;

    SoundManager.playDamage();
    setCombo(0);
    setHealth(prev => {
      const next = prev - config.healthLoss;
      if (next <= 0) {
        SoundManager.stopBGM();
        setScreen('gameover');
        clearTimeout(spawnRef.current);
        clearInterval(timerRef.current);
      }
      return Math.max(0, next);
    });
  }, [difficulty]);

  /* ─────────────────────────────────────────────────
     INPUT HANDLER — real-time word matching
  ───────────────────────────────────────────────── */
  const handleInput = useCallback((value) => {
    setInputValue(value);
    setTotalAttempts(prev => prev + 1);

    const trimmed = value.trim().toLowerCase();
    const match = words.find(w => w.text.toLowerCase() === trimmed);

    if (match) {
      // ✅ Correct word!
      typedWordsRef.current.add(match.id);
      setWords(prev => prev.filter(w => w.id !== match.id));
      setInputValue('');

      wordsCompletedRef.current += 1;
      setWordsCompleted(wc => wc + 1);

      const charCount = match.text.length;
      setTotalTyped(prev => prev + charCount);

      // Fire laser
      const timeAlive = (Date.now() - match.spawnedAt) / 1000;
      const speedMultiplier = activePowerupRef.current === 'slow' ? 0.4 : 1;
      const timeScale = Math.max(0.5, 1 - ((elapsedRef.current - timeAlive) / 120));
      const fallDuration = DIFFICULTY_CONFIG[difficulty].fallDuration * timeScale * speedMultiplier;
      const percentFallen = Math.min(1, timeAlive / fallDuration);
      
      const laserId = Date.now();
      setLasers(prev => [...prev, { id: laserId, startX: 50, startY: 100, targetX: match.xPercent, targetY: percentFallen }]);
      SoundManager.playLaser();

      setExplosions(prev => [...prev, { 
        id: laserId, 
        x: match.xPercent, 
        y: percentFallen, 
        color: match.color, 
        text: match.text,
        isPowerup: match.isPowerup,
        hit: false 
      }]);

      setTimeout(() => {
        setLasers(prev => prev.filter(l => l.id !== laserId));
        setExplosions(prev => prev.map(e => e.id === laserId ? { ...e, hit: true } : e));
        SoundManager.playExplosion();
        
        setTimeout(() => {
          setExplosions(prev => prev.filter(e => e.id !== laserId));
        }, 600);
      }, 150);

      // Combo & score
      setCombo(prev => {
        const newCombo = prev + 1;
        if (newCombo % 5 === 0) SoundManager.playCombo();
        setBestCombo(b => Math.max(b, newCombo));
        // Score = word length * combo multiplier
        const points = charCount * 10 * Math.max(1, Math.floor(newCombo / 3));
        scoreRef.current += points;
        setScore(scoreRef.current);
        return newCombo;
      });

      // Power-up activation
      if (match.isPowerup) {
        const pu = match.text;
        if (pu === 'BOOST') {
          setScore(s => s + 500);
          scoreRef.current += 500;
        } else if (pu === 'SHIELD') {
          activePowerupRef.current = 'shield';
          setActivePowerup('shield');
          setPowerupTimer(8);
        } else if (pu === 'FREEZE') {
          activePowerupRef.current = 'slow';
          setActivePowerup('slow');
          setPowerupTimer(6);
        } else if (pu === 'NUKE') {
          // Clear all words and gain health
          setWords([]);
          setHealth(h => Math.min(100, h + 20));
        }
      }

      // Recover a bit of health on high combo
      if ((combo + 1) % 10 === 0) {
        setHealth(h => Math.min(100, h + 5));
      }
    } else {
      // Still typing
      SoundManager.playTyping();
      // Check if current input matches the START of any word
      const isPartialMatch = words.some(w => w.text.toLowerCase().startsWith(trimmed));
      if (!isPartialMatch && trimmed.length > 0) {
        setInputError(true);
        setCombo(0);
        SoundManager.playError();
        setTimeout(() => setInputError(false), 200);
      }
    }
  }, [words, combo, difficulty]);

  /* ─────────────────────────────────────────────────
     LEADERBOARD helpers
  ───────────────────────────────────────────────── */
  const saveScore = useCallback((playerName) => {
    const entry = {
      name: playerName,
      score: scoreRef.current,
      wpm,
      accuracy,
      difficulty,
      date: new Date().toLocaleDateString(),
    };
    const existing = JSON.parse(localStorage.getItem('typerush_scores') || '[]');
    const updated = [...existing, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    localStorage.setItem('typerush_scores', JSON.stringify(updated));
  }, [wpm, accuracy, difficulty]);

  const getLeaderboard = useCallback(() => {
    try {
      const data = localStorage.getItem('typerush_scores');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse leaderboard:", e);
    }

    // Default dummy data if leaderboard is empty
    return [
      { name: 'NEO', score: 15420, wpm: 120, accuracy: 98, difficulty: 'hard', date: new Date().toLocaleDateString() },
      { name: 'TRINITY', score: 12300, wpm: 105, accuracy: 95, difficulty: 'normal', date: new Date().toLocaleDateString() },
      { name: 'ZERO_COOL', score: 9850, wpm: 92, accuracy: 92, difficulty: 'normal', date: new Date().toLocaleDateString() },
      { name: 'ACID_BURN', score: 7500, wpm: 85, accuracy: 88, difficulty: 'easy', date: new Date().toLocaleDateString() },
      { name: 'GUEST_01', score: 3200, wpm: 60, accuracy: 80, difficulty: 'easy', date: new Date().toLocaleDateString() }
    ];
  }, []);

  return {
    // Screens
    screen, setScreen, startGame, difficulty, setDifficulty,
    // Game state
    words, lasers, explosions, wave, score, health, combo, bestCombo, elapsed, wpm, accuracy, wordsCompleted,
    // Input
    inputValue, handleInput, inputError,
    // Word lifecycle
    handleWordMissed,
    // Power-ups
    activePowerup, powerupTimer,
    // Leaderboard
    saveScore, getLeaderboard,
  };
}
