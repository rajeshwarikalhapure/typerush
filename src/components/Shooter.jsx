import React from 'react';
import { motion } from 'framer-motion';

export default function Shooter({ combo, activeWord }) {
  const [angle, setAngle] = React.useState(0);

  React.useEffect(() => {
    if (activeWord) {
      // Calculate angle from cannon to word
      // Cannon is at X: 50%. dx is distance from center in vw.
      const targetX = activeWord.xPercent;
      const dx = targetX - 50; 
      // Approximate rotation based on horizontal distance
      const rotation = dx * 1.2; 
      setAngle(rotation);
    } else {
      setAngle(0);
    }
  }, [activeWord]);

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
      {/* Cannon Barrel */}
      <motion.div
        className="w-3 h-10 bg-cyan-300 rounded-t-lg origin-bottom"
        style={{ boxShadow: `0 0 ${10 + combo * 2}px #00ffff` }}
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      />
      {/* Cannon Base */}
      <motion.div
        className="w-16 h-8 bg-gray-900 border-2 border-cyan-500 rounded-t-2xl relative flex items-center justify-center overflow-hidden"
        style={{ boxShadow: `0 0 ${5 + combo}px #00ffff` }}
      >
        <div className="w-8 h-2 bg-cyan-500/50 rounded-full" />
      </motion.div>
    </div>
  );
}
