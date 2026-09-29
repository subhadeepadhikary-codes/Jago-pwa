import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Splash({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.8 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center shadow-2xl shadow-saffron/30"
      >
        <span className="text-4xl">🏛️</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white">
          Tribal <span className="text-saffron">Scholarships</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2">Ministry of Tribal Affairs</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex items-center gap-2"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-saffron"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-gray-500 text-xs"
      >
        Government of India Initiative
      </motion.p>
    </div>
  );
}
