'use client';
import { useState, useCallback } from 'react';
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

  const handleClick = useCallback(() => {
    // 触发抖动动画
    setIsShaking(true);
    // 300ms 后停止抖动
    setTimeout(() => setIsShaking(false), 300);
    // 切换展开状态
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const shakeAnimation = {
    shake: {
      scale: [1, 1.02, 0.98, 1],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="w-full py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl mx-auto px-4"
      >
        {/* 黑色圆形背景容器 */}
        <motion.div
          className="relative cursor-pointer"
          animate={isShaking ? 'shake' : 'normal'}
          variants={shakeAnimation}
          whileHover={{ scale: 1.01 }}
          onClick={handleClick}
        >
          {/* 黑色圆形背景 */}
          <motion.div
            layout
            className={`relative mx-auto bg-black rounded-full overflow-hidden transition-all duration-300 ${
              isExpanded ? 'w-[640px] h-[640px]' : 'w-[440px] h-[440px]'
            }`}
            style={{
              padding: '20px',
              willChange: 'transform',
            }}
          >
            {/* GIF 容器 */}
            <motion.div
              layout
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{ willChange: 'transform' }}
            >
              <Image
                src={gif.src}
                alt={gif.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, 640px"
              />
              
              {/* 悬浮效果 */}
              <motion.div
                initial={false}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-opacity duration-200"
              />

              {/* 标题和描述 */}
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {gif.title && (
                      <motion.h3
                        layout
                        className="text-2xl font-bold mb-2"
                      >
                        {gif.title}
                      </motion.h3>
                    )}
                    {gif.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-white/90"
                      >
                        {gif.description}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 点击提示 */}
              <motion.div
                initial={false}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200"
              >
                <motion.span
                  initial={false}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium opacity-0 scale-95 transition duration-200"
                >
                  {isExpanded ? '点击收起' : '点击展开'}
                </motion.span>
              </motion.div>

              {/* 装饰性光效 - 使用CSS渐变替代动画 */}
              <div
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_60%)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
} 