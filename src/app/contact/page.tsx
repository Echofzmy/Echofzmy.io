'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟发送延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 重置表单
    setFormData({
      name: '',
      email: '',
      message: '',
    });
    
    // 显示成功提示
    setShowToast(true);
    setIsSubmitting(false);
    
    // 3秒后自动关闭提示
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Echofzmy' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 pt-24">
      {/* 成功提示弹窗 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>消息发送成功！</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">联系我</h1>
          <p className="text-xl text-gray-600 mb-12">
            如果您有任何问题或合作意向，请随时与我联系。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  留言
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>发送中...</span>
                  </>
                ) : (
                  <span>发送消息</span>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">其他联系方式</h2>
              <div className="space-y-4">
                <p className="flex items-center space-x-2">
                  <span className="text-gray-600">邮箱：</span>
                  <a
                    href="mailto:your.email@example.com"
                    className="text-blue-600 hover:underline"
                  >
                    3220103009@zju.edu.cn
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span className="text-gray-600">地址：</span>
                  <span>中国浙江省杭州市</span>
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">社交媒体</h2>
              <div className="flex flex-col space-y-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>{link.name}</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 