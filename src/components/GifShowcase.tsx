'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GifItem {
  title: string;
  src: string;
  description?: string;
}

export default function GifShowcase() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // 你的 GIF 信息
  const gif: GifItem = {
    title: '',
    src: '/images/gif1.gif',
    description: ''
  };

  const handleClick = () => {
    // 触发抖动动画
    setIsShaking(true);
    // 300ms 后停止抖动
    setTimeout(() => setIsShaking(false), 300);
    // 切换展开状态
    setIsExpanded(!isExpanded);
  };

  const shakeAnimation = {
    shake: {
      scale: [1, 1.02, 0.98, 1.02, 0.98, 1],
      rotate: [0, 1, -1, 1, -1, 0],
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="w-full py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-4xl mx-auto px-4"
      >
        {/* 黑色圆形背景容器 */}
        <motion.div
          className="relative cursor-pointer"
          animate={isShaking ? 'shake' : 'normal'}
          variants={shakeAnimation}
          whileHover={{ scale: 1.02 }}
          onClick={handleClick}
        >
          {/* 黑色圆形背景 */}
          <motion.div
            layout
            className={`relative mx-auto bg-black rounded-full overflow-hidden transition-all duration-500 ${
              isExpanded ? 'w-[640px] h-[640px]' : 'w-[440px] h-[440px]'
            }`}
            style={{
              padding: '20px', // 给 GIF 留出边距
            }}
          >
            {/* GIF 容器 */}
            <motion.div
              layout
              className={`relative w-full h-full rounded-full overflow-hidden`}
            >
              <Image
                src={gif.src}
                alt={gif.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* 悬浮效果 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"
              />

              {/* 标题和描述 */}
              <AnimatePresence>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <motion.h3
                    layout
                    className="text-2xl font-bold mb-2"
                  >
                    {gif.title}
                  </motion.h3>
                  {isExpanded && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-white/90"
                    >
                      {gif.description}
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* 点击提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20"
              >
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
                >
                  {isExpanded ? '点击收起' : '点击展开'}
                </motion.span>
              </motion.div>

              {/* 装饰性光效 */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 