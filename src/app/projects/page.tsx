'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Projects() {
  const projects = [
    {
      title: '巴黎奥运会数据可视化网站',
      description: '基于Next.js开发的巴黎奥运会数据可视化网站，支持日程查看、成绩查看、数据分析等。',
      tech: ['Next.js', 'Tableau', 'Flourish', 'Echarts'],
      image: '/images/project1.png',
    },
    {
      title: 'Close for Zju社交媒体应用',
      description: '恋爱交友小程序界面设计优化与用户体验设计。',
      tech: ['Figma', 'Photoshop', 'Premiere', 'After Effects'],
      image: '/images/project2.png',
    },
    {
      title: 'AI数字人讲师',
      description: '基于comfyui的AI数字人讲师，可以生成AI数字人讲师视频。',
      tech: ['comfyui', 'python', 'ffmpeg'],
      image: '/images/project3.png',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">我的项目</h1>
          <p className="text-xl text-gray-600 mb-12">
            这里展示了我最近完成的一些项目作品，涵盖了Web开发、UI设计等多个领域。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
} 