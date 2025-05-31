'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GifShowcase from '@/components/GifShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              你好，我是 <span className="text-blue-600">枫之牧屿</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              工业设计/ UI设计 / 创意工作者
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center space-x-4 mb-12"
          >
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              联系我
            </Link>
            <Link
              href="/projects"
              className="bg-white text-blue-600 px-8 py-3 rounded-full border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              查看作品
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <GifShowcase />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { title: '技术开发', desc: '专注于创建高质量的Web应用' },
              { title: 'UI设计', desc: '打造美观实用的用户界面' },
              { title: '用户体验', desc: '注重细节的交互设计' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
