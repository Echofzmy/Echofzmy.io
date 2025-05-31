import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import "./globals.css";
import Navbar from "@/components/Navbar";

// 动态导入组件
const MusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
  ssr: false,
  loading: () => null
});

const BackgroundAnimation = dynamic(() => import("@/components/BackgroundAnimation"), {
  ssr: false,
  loading: () => null
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "梁宇澄的个人网站",
  description: "个人网站展示作品和技能",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <BackgroundAnimation />
        <Navbar />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
