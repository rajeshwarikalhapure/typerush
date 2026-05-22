import React from 'react';
import { motion } from 'framer-motion';

export default function LaserBullet({ startX, startY, targetX, targetY }) {
  const [windowSize, setWindowSize] = React.useState({ w: window.innerWidth, h: window.innerHeight });

  React.useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert to pixels for accurate angle calculation
  const startXPx = (startX / 100) * windowSize.w;
  // Start from the cannon tip (roughly 140px from bottom)
  const startYPx = windowSize.h - 140; 
  
  const targetXPx = (targetX / 100) * windowSize.w;
  // targetY is percentFallen (0 to 1). The word animation goes from -60px to 100vh.
  const targetYPx = -60 + targetY * (windowSize.h + 60);

  const angle = Math.atan2(targetYPx - startYPx, targetXPx - startXPx) * (180 / Math.PI);

  return (
    <motion.div
      className="absolute w-1 h-8 bg-white rounded-full z-10 pointer-events-none origin-bottom"
      style={{
        boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
      }}
      initial={{ left: `${startX}%`, top: startYPx, rotate: angle - 90, opacity: 1 }}
      animate={{ left: `${targetX}%`, top: targetYPx, opacity: 1 }}
      transition={{ duration: 0.15, ease: 'linear' }}
    />
  );
}
