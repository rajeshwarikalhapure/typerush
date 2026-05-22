// Word bank organized by difficulty
// Easy: short, common words
// Medium: moderate length, everyday words
// Hard: long, complex, technical words

export const WORD_BANKS = {
  easy: [
    'cat', 'dog', 'sun', 'run', 'fly', 'zip', 'hot', 'top', 'cup', 'map',
    'car', 'bus', 'jar', 'net', 'web', 'bin', 'key', 'fix', 'hop', 'jet',
    'fog', 'gem', 'hat', 'ink', 'jam', 'kit', 'lap', 'mud', 'nap', 'oak',
    'pen', 'ray', 'sap', 'tax', 'urn', 'van', 'wax', 'yam', 'zap', 'bat',
    'dim', 'elf', 'gap', 'hex', 'ivy', 'jab', 'kin', 'log', 'mop', 'nod',
  ],
  medium: [
    'pixel', 'cyber', 'laser', 'ghost', 'frost', 'storm', 'blade', 'flash',
    'crash', 'glitch', 'ninja', 'venom', 'chaos', 'surge', 'blaze', 'spark',
    'drift', 'forge', 'grind', 'haste', 'ionic', 'jumbo', 'knack', 'lumen',
    'morph', 'nexus', 'orbit', 'prism', 'quark', 'realm', 'shred', 'titan',
    'ultra', 'vibes', 'wrath', 'xenon', 'yield', 'zonal', 'alpha', 'brute',
    'clone', 'delta', 'ember', 'flare', 'glyph', 'hydra', 'index', 'joker',
    'karma', 'lunar', 'mango', 'nerve', 'omega', 'phase', 'queen', 'radar',
    'sigma', 'turbo', 'umbra', 'vapor', 'wired', 'xenos', 'yacht', 'zeros',
  ],
  hard: [
    'algorithm', 'bandwidth', 'cyberpunk', 'debugging', 'encrypted',
    'firewall', 'graphical', 'hardware', 'interface', 'javascript',
    'keyboard', 'language', 'megabyte', 'network', 'overflow',
    'processor', 'quantum', 'recursive', 'software', 'terminal',
    'underflow', 'variable', 'wireless', 'xorshift', 'yottabyte',
    'zelophobia', 'abstraction', 'blockchain', 'compilation', 'deployment',
    'encryption', 'framework', 'generative', 'hyperlink', 'iteration',
    'javascript', 'kubernetes', 'logarithm', 'motherboard', 'nanosecond',
    'opensource', 'polymorphic', 'quaternion', 'repository', 'stacktrace',
    'typescript', 'ultraviolet', 'virtualize', 'wavelength', 'xenolithic',
    'cybersecurity', 'decentralize', 'extrapolate', 'functionality',
  ],
};

// Power-up words that grant special abilities
export const POWERUP_WORDS = ['BOOST', 'SHIELD', 'FREEZE', 'NUKE'];

// Get a random word from a mix of banks based on difficulty & time elapsed
export function getRandomWord(difficulty, elapsed = 0) {
  const t = Math.min(elapsed / 60, 1); // 0→1 over 60 seconds

  let pool;
  if (difficulty === 'easy') {
    // Start pure easy, blend in medium over time
    pool = t < 0.5
      ? WORD_BANKS.easy
      : [...WORD_BANKS.easy, ...WORD_BANKS.medium.slice(0, 20)];
  } else if (difficulty === 'medium') {
    pool = t < 0.4
      ? [...WORD_BANKS.easy.slice(10), ...WORD_BANKS.medium]
      : [...WORD_BANKS.medium, ...WORD_BANKS.hard.slice(0, 15)];
  } else {
    // Hard — mostly medium/hard
    pool = t < 0.3
      ? WORD_BANKS.medium
      : [...WORD_BANKS.medium.slice(20), ...WORD_BANKS.hard];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Difficulty config: { spawnInterval, fallDuration, startSpeed, minSpeed }
export const DIFFICULTY_CONFIG = {
  easy:   { spawnInterval: 3000, fallDuration: 12, healthLoss: 10 },
  medium: { spawnInterval: 2000, fallDuration: 9,  healthLoss: 15 },
  hard:   { spawnInterval: 1200, fallDuration: 6,  healthLoss: 20 },
};
