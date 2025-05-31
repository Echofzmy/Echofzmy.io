'use client';
import dynamic from 'next/dynamic';

// 动态导入组件
export const DynamicMusicPlayer = dynamic(() => import("@/components/MusicPlayer"), {
  ssr: false,
  loading: () => null
});

export const DynamicBackgroundAnimation = dynamic(() => import("@/components/BackgroundAnimation"), {
  ssr: false,
  loading: () => null
}); 