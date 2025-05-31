'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function BackgroundAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 如果用户设置了减少动画或者是服务器端渲染，则不显示动画
  if (!isClient || prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -inset-[100px] opacity-30"
        initial={false}
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.05) 0%, rgba(255, 255, 255, 0) 50%)',
            'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0) 50%)',
            'radial-gradient(circle at 30% 70%, rgba(76, 29, 149, 0.05) 0%, rgba(255, 255, 255, 0) 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
    </div>
  );
} 