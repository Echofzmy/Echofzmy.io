'use client';
import { motion } from 'framer-motion';

export default function About() {
  const skills = [
    { category: '前端开发', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { category: '后端开发', items: ['Node.js', 'Python', 'SQL', 'RESTful API'] },
    { category: '设计工具', items: ['Figma', 'Adobe XD', 'Photoshop'] },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">关于我</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              你好！我是一名工业设计的大学本科生。我热爱创造美观且实用的数字产品，
              致力于为用户提供最佳的使用体验。在过去的几年里，我参与开发了多个成功的项目，
              并持续学习新的技术和设计理念。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">技能专长</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-4">{skill.category}</h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="text-gray-600 flex items-center space-x-2"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">教育背景</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">工业设计</h3>
            <p className="text-gray-600 mt-2">浙江大学 | 2022 - 2026</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 