'use client';
import { motion } from 'framer-motion';

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -inset-[100px] opacity-50"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.1) 0%, rgba(255, 255, 255, 0) 50%)',
            'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0) 50%)',
            'radial-gradient(circle at 30% 70%, rgba(76, 29, 149, 0.1) 0%, rgba(255, 255, 255, 0) 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
    </div>
  );
} 