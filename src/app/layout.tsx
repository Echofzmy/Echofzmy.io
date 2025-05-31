import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";
import BackgroundAnimation from "@/components/BackgroundAnimation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "梁宇澄的个人网站",
  description: "个人网站展示作品和技能",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <BackgroundAnimation />
        <Navbar />
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
