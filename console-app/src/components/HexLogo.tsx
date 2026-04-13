import React from 'react';
import { motion } from 'framer-motion';

export const HexLogo: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '80px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      {/* Outer rotating hexagon */}
      <motion.svg 
        width="80" 
        height="90" 
        viewBox="0 0 100 115" 
        style={{ position: 'absolute', inset: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <polygon 
          points="50,5 95,30 95,85 50,110 5,85 5,30" 
          fill="none" 
          stroke="url(#cyan-purple-grad)" 
          strokeWidth="2" 
          opacity="0.5"
        />
        <defs>
          <linearGradient id="cyan-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Inner pulsing hexagon */}
      <motion.svg 
        width="60" 
        height="70" 
        viewBox="0 0 100 115" 
        style={{ position: 'absolute', zIndex: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <polygon 
          points="50,5 95,30 95,85 50,110 5,85 5,30" 
          fill="none" 
          stroke="var(--cyan)" 
          strokeWidth="3" 
          opacity="0.8"
          style={{ filter: 'drop-shadow(0 0 10px var(--cyan))' }}
        />
      </motion.svg>

      {/* Center AK Text */}
      <motion.div 
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          color: '#fff', 
          fontFamily: 'var(--font)', 
          fontSize: '24px', 
          fontWeight: '900',
          letterSpacing: '2px',
          textShadow: '0 0 15px var(--cyan), 0 0 30px var(--purple)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        AK
      </motion.div>
    </div>
  );
};
