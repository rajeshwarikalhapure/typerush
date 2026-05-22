# TypeRush ⚡

A fast-paced, arcade-style cyberpunk typing shooter built with React, Vite, and Framer Motion. 

Type fast to shoot down falling words before they breach the danger zone. Survive as long as you can, build massive combos, and dominate the neural-link leaderboard!

## 🚀 Features

- **Cyberpunk Aesthetic**: Neon visuals, dynamic scanlines, and fluid framer-motion animations.
- **Arcade Shooter Mechanics**: A dynamically rotating cannon that fires pixel-perfect lasers at targeted words.
- **Dynamic Particle Physics**: Satisfying explosion and shatter effects when words are destroyed.
- **Live Sound Synthesis**: 100% procedurally generated Web Audio API sound effects (no external audio files!). Includes a pulsing electronic background drone, laser blasts, and explosion sounds.
- **Power-Ups**: Trigger special abilities like Shields, Time Freezes (Slow Motion), and Nuke screen clears by typing rare glowing words.
- **Local Leaderboard**: Automatically saves your top runs to a local high-score table.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Audio**: Native Web Audio API
- **Icons**: Lucide React

## 🎮 How to Play

1. **Select Difficulty**: Choose from Easy, Medium, or Hard.
2. **Type to Aim**: Start typing a falling word. The cannon will automatically lock on to the target.
3. **Submit**: Press `SPACE` to fire! If you typed the word correctly, the cannon fires a laser and shatters the word.
4. **Survive**: Don't let words hit the bottom of the screen, or you lose HP. If your HP hits 0, it's Game Over.

## 💻 Running Locally

To run this project on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/rajeshwarikalhapure/typerush.git
   ```
2. Navigate to the project directory:
   ```bash
   cd typerush
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.
